/**
 * Data-layer test harness (real NextGraph broker mode).
 *
 * Runs inside an iframe controlled by the NextGraph broker.
 * Uses the REAL app providers (NextGraphProvider + FestipodDataProvider)
 * so tests face the same code paths as the app.
 *
 * Exposes window.__testData for Playwright-driven Cucumber steps.
 */
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { NextGraphProvider, useNextGraph } from '../context/NextGraphContext';
import { FestipodDataProvider, useFestipodData } from '../context/FestipodDataContext';
import { useShape } from '@ng-org/orm/react';
import type { DeepSignalSet } from '@ng-org/alien-deepsignals';
import {
  FpEventShapeType,
  FpUserProfileShapeType,
  FpParticipationShapeType,
} from '../shapes/orm/festipodShapes.shapeTypes';
import type { FpEvent, FpUserProfile, FpParticipation } from '../shapes/orm/festipodShapes.typings';
import { seedEvents, seedUsers, seedParticipations } from '../data/seedData';
import { bootstrapWallet } from '../utils/ngBootstrap';

// ============================================================================
// App — uses real providers (same tree as the real app)
// ============================================================================

function DataHarnessNG() {
  return (
    <NextGraphProvider>
      <FestipodDataProvider>
        <HarnessRouter />
      </FestipodDataProvider>
    </NextGraphProvider>
  );
}

// Wait for NG connection before exposing the test bridge
function HarnessRouter() {
  const { status } = useNextGraph();

  if (status === 'connected') {
    return <ConnectedHarness />;
  }

  if (status === 'error') {
    return <div id="harness-status">ERROR</div>;
  }

  return <div id="harness-status">WAITING_FOR_SESSION</div>;
}

// ============================================================================
// Connected harness — exposes window.__testData through real providers
// ============================================================================

function ConnectedHarness() {
  const ngCtx = useNextGraph();
  const appData = useFestipodData();

  // Raw DeepSignalSets for direct manipulation in tests
  const events = useShape(FpEventShapeType, 'did:ng:i') as DeepSignalSet<FpEvent>;
  const users = useShape(FpUserProfileShapeType, 'did:ng:i') as DeepSignalSet<FpUserProfile>;
  const participations = useShape(FpParticipationShapeType, 'did:ng:i') as DeepSignalSet<FpParticipation>;

  const [bridgeReady, setBridgeReady] = useState(false);

  useEffect(() => {
    // Small delay for useShape to populate
    const timer = setTimeout(() => {
      const session = ngCtx.session!;

      // Get current user ID
      let currentUserId = '';
      const existingUsers = [...users];
      if (existingUsers.length > 0) {
        currentUserId = existingUsers[0]['@id'];
      }

      // Expose the test bridge
      (window as any).__testData = {
        ready: true,

        // --- Raw DeepSignalSets (backward compatible with existing tests) ---
        events,
        users,
        participations,
        currentUserId,
        session,

        // --- App-level view (through real providers, same as what screens see) ---
        appData,
        ngStatus: ngCtx.status,

        // --- Query helpers ---
        getEvent(id: string) {
          return [...events].find(e => e['@id'] === id);
        },
        getEventByTitle(title: string) {
          return [...events].find(e => e.title === title);
        },
        isParticipating(eventId: string, userId: string) {
          return [...participations].some(p => p.event === eventId && p.user === userId);
        },
        getEventParticipants(eventId: string) {
          return [...participations].filter(p => p.event === eventId);
        },

        // --- Mutations (direct ngSet access) ---
        joinEvent(eventId: string, userId: string) {
          const already = [...participations].some(p => p.event === eventId && p.user === userId);
          if (already) return;
          participations.add({
            '@graph': `did:ng:${session.private_store_id}`,
            '@type': 'http://festipod.org/Participation',
            '@id': '',
            event: eventId,
            user: userId,
            isConfirmed: true,
          } as FpParticipation);
          const ev = [...events].find(e => e['@id'] === eventId);
          if (ev) ev.participantCount = ev.participantCount + 1;
        },
        leaveEvent(eventId: string, userId: string) {
          const part = [...participations].find(p => p.event === eventId && p.user === userId);
          if (!part) return;
          participations.delete(part);
          const ev = [...events].find(e => e['@id'] === eventId);
          if (ev) ev.participantCount = Math.max(0, ev.participantCount - 1);
        },
        updateEvent(eventId: string, updates: Record<string, any>) {
          const ev = [...events].find(e => e['@id'] === eventId);
          if (!ev) return;
          for (const [key, value] of Object.entries(updates)) {
            if (key !== '@id' && key !== '@graph' && key !== '@type') {
              (ev as any)[key] = value;
            }
          }
        },

        /** Load the app's default seed data into the wallet */
        loadTestData() {
          return bootstrapWallet(events as any, users as any, participations as any);
        },
      };

      console.log('[HarnessNG] Ready — events:', events.size, 'users:', users.size,
        'participations:', participations.size, '| ngStatus:', ngCtx.status,
        '| appData.events:', appData.events.length);
      setBridgeReady(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [events, users, participations, ngCtx, appData]);

  return <div id="harness-status">{bridgeReady ? 'READY' : 'LOADING_SHAPES'}</div>;
}

// ============================================================================
// Bootstrap
// ============================================================================

const root = createRoot(document.getElementById('root')!);
root.render(<DataHarnessNG />);
