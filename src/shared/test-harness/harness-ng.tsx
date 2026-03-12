/**
 * Data-layer test harness (real NextGraph broker mode).
 *
 * Runs inside an iframe controlled by the NextGraph broker.
 * Uses real @ng-org/web init + @ng-org/orm useShape to test
 * the full data pipeline up to the broker.
 *
 * Exposes window.__testData for Playwright-driven Cucumber steps.
 */
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ng, init as initNgWeb } from '@ng-org/web';
import { initNg as initNgSignals } from '@ng-org/orm';
import { useShape } from '@ng-org/orm/react';
import type { DeepSignalSet } from '@ng-org/alien-deepsignals';
import {
  FpEventShapeType,
  FpUserProfileShapeType,
  FpParticipationShapeType,
} from '../shapes/orm/festipodShapes.shapeTypes';
import type { FpEvent, FpUserProfile, FpParticipation } from '../shapes/orm/festipodShapes.typings';

// ============================================================================
// Seed data — injected into the broker if the graph is empty
// ============================================================================

const SEED_EVENTS: Array<Omit<FpEvent, '@graph' | '@id'>> = [
  { '@type': 'http://festipod.org/Event', title: 'Résidence Reconnexion', date: 'Lun. 16 - Ven. 20 fév.', location: 'Écocentre de Villarceaux', participantCount: 24 },
  { '@type': 'http://festipod.org/Event', title: 'Marché des créateurs', date: 'Sam. 22 fév. · 10h', location: 'Place Bellecour, Lyon', participantCount: 12 },
  { '@type': 'http://festipod.org/Event', title: 'Cercle de parole', date: 'Dim. 23 fév. · 14h', location: 'Maison des associations', participantCount: 45 },
  { '@type': 'http://festipod.org/Event', title: 'Formation CNV', date: 'Sam. 1 mars · 9h30', location: 'Centre Iris, Paris', participantCount: 16 },
  { '@type': 'http://festipod.org/Event', title: 'Festival Printemps', date: 'Ven. 14 - Dim. 16 mars', location: 'Domaine de Longchamp', participantCount: 30 },
];

// ============================================================================
// NG initialization
// ============================================================================

let sessionReady = false;
let ngSession: any = null;

async function initNG() {
  console.log('[HarnessNG] Initializing NextGraph...');
  await initNgWeb(
    async (event: any) => {
      ngSession = event.session;
      ngSession.ng ??= ng;
      initNgSignals(ng, ngSession);
      sessionReady = true;
      console.log('[HarnessNG] NG session established, private_store_id:', ngSession.private_store_id);
    },
    true,  // singleton
    [],    // access_requests
  );
}

// Start init immediately (this will postMessage to parent broker)
initNG().catch((err) => {
  console.error('[HarnessNG] Init failed:', err);
  // Signal failure so tests don't hang
  (window as any).__testData = { ready: false, error: err.message };
});

// ============================================================================
// Harness component — uses real useShape, exposes window.__testData
// ============================================================================

function DataHarnessNG() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Wait for NG session before rendering useShape hooks
  if (!sessionReady) {
    return <WaitForSession onReady={() => setReady(true)} onError={setError} />;
  }

  return <ShapeConsumer />;
}

function WaitForSession({ onReady, onError }: { onReady: () => void; onError: (e: string) => void }) {
  useEffect(() => {
    const interval = setInterval(() => {
      if (sessionReady) {
        clearInterval(interval);
        onReady();
      }
    }, 100);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (!sessionReady) {
        onError('NG session timeout after 30s');
      }
    }, 30000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, []);

  return <div id="harness-status">WAITING_FOR_SESSION</div>;
}

function ShapeConsumer() {
  // Use "did:ng:i" scope = all data in private store (same as the app)
  const events = useShape(FpEventShapeType, 'did:ng:i') as DeepSignalSet<FpEvent>;
  const users = useShape(FpUserProfileShapeType, 'did:ng:i') as DeepSignalSet<FpUserProfile>;
  const participations = useShape(FpParticipationShapeType, 'did:ng:i') as DeepSignalSet<FpParticipation>;

  const [bridgeReady, setBridgeReady] = useState(false);

  useEffect(() => {
    // Wait a tick for useShape to populate
    const timer = setTimeout(() => {
      const graph = `did:ng:${ngSession.private_store_id}`;

      // Seed events if the graph is empty
      if (events.size === 0) {
        console.log('[HarnessNG] Graph empty, seeding test events...');
        for (const e of SEED_EVENTS) {
          events.add({ ...e, '@graph': graph, '@id': '' } as FpEvent);
        }
      }

      // Seed a test user if none exists
      if (users.size === 0) {
        console.log('[HarnessNG] No user profile, seeding test user...');
        users.add({
          '@graph': graph,
          '@id': '',
          '@type': 'http://festipod.org/UserProfile',
          name: 'Test User',
          initials: 'TU',
          username: '@testuser',
        } as FpUserProfile);
      }

      // Get current user ID (wait briefly for NG to assign @id)
      let currentUserId = '';
      const existingUsers = [...users];
      if (existingUsers.length > 0) {
        currentUserId = existingUsers[0]['@id'];
      }

      // Expose the test bridge
      (window as any).__testData = {
        ready: true,
        events,
        users,
        participations,
        currentUserId,
        session: ngSession,

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
        joinEvent(eventId: string, userId: string) {
          const already = [...participations].some(p => p.event === eventId && p.user === userId);
          if (already) return;
          participations.add({
            '@graph': `did:ng:${ngSession.private_store_id}`,
            '@type': 'http://festipod.org/Participation',
            '@id': '',  // auto-assigned by NG
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
      };

      console.log('[HarnessNG] Ready — events:', events.size, 'users:', users.size, 'participations:', participations.size);
      setBridgeReady(true);
    }, 500);  // Small delay for useShape to populate

    return () => clearTimeout(timer);
  }, [events, users, participations]);

  return <div id="harness-status">{bridgeReady ? 'READY' : 'LOADING_SHAPES'}</div>;
}

// ============================================================================
// Bootstrap
// ============================================================================

const root = createRoot(document.getElementById('root')!);
root.render(<DataHarnessNG />);
