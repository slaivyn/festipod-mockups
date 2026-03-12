/**
 * Data-layer test harness (mock mode).
 *
 * Uses DeepSignalSet directly — the same reactive data structure that
 * useShape returns — seeded with test data. No NextGraph broker required.
 *
 * Exposes window.__testData for Playwright-driven Cucumber steps.
 *
 * When a real broker is available, swap this for harness-ng.tsx.
 */
import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { deepSignal } from '@ng-org/alien-deepsignals';
import type { DeepSignalSet } from '@ng-org/alien-deepsignals';
import type { FpEvent, FpUserProfile, FpParticipation } from '../shapes/orm/festipodShapes.typings';

// ============================================================================
// Seed data — same events/users as the app's seedData.ts
// ============================================================================

const GRAPH = 'did:ng:test';

function seedEvents(): DeepSignalSet<FpEvent> {
  const set = deepSignal(new Set<FpEvent>()) as DeepSignalSet<FpEvent>;
  const events: Array<Omit<FpEvent, '@graph' | '@id'>> = [
    { '@type': 'http://festipod.org/Event', title: 'Résidence Reconnexion', date: 'Lun. 16 - Ven. 20 fév.', location: 'Écocentre de Villarceaux', participantCount: 24 },
    { '@type': 'http://festipod.org/Event', title: 'Marché des créateurs', date: 'Sam. 22 fév. · 10h', location: 'Place Bellecour, Lyon', participantCount: 12 },
    { '@type': 'http://festipod.org/Event', title: 'Cercle de parole', date: 'Dim. 23 fév. · 14h', location: 'Maison des associations', participantCount: 45 },
    { '@type': 'http://festipod.org/Event', title: 'Formation CNV', date: 'Sam. 1 mars · 9h30', location: 'Centre Iris, Paris', participantCount: 16 },
    { '@type': 'http://festipod.org/Event', title: 'Festival Printemps', date: 'Ven. 14 - Dim. 16 mars', location: 'Domaine de Longchamp', participantCount: 30 },
  ];
  for (const e of events) {
    set.add({ ...e, '@graph': GRAPH, '@id': `event:${e.title}` } as FpEvent);
  }
  return set;
}

function seedUsers(): DeepSignalSet<FpUserProfile> {
  const set = deepSignal(new Set<FpUserProfile>()) as DeepSignalSet<FpUserProfile>;
  const users: Array<Omit<FpUserProfile, '@graph' | '@id'>> = [
    { '@type': 'http://festipod.org/UserProfile', name: 'Marie Dupont', initials: 'MD', username: '@mariedupont' },
    { '@type': 'http://festipod.org/UserProfile', name: 'Jean Durand', initials: 'JD', username: '@jeandurand' },
    { '@type': 'http://festipod.org/UserProfile', name: 'Thomas Martin', initials: 'TM', username: '@thomasmartin' },
  ];
  for (const u of users) {
    set.add({ ...u, '@graph': GRAPH, '@id': `user:${u.username}` } as FpUserProfile);
  }
  return set;
}

function seedParticipations(
  events: DeepSignalSet<FpEvent>,
  users: DeepSignalSet<FpUserProfile>,
): DeepSignalSet<FpParticipation> {
  const set = deepSignal(new Set<FpParticipation>()) as DeepSignalSet<FpParticipation>;
  const marie = [...users].find(u => u.username === '@mariedupont')!;
  const jean = [...users].find(u => u.username === '@jeandurand')!;
  const thomas = [...users].find(u => u.username === '@thomasmartin')!;
  const ev1 = [...events].find(e => e.title === 'Résidence Reconnexion')!;
  const ev2 = [...events].find(e => e.title === 'Marché des créateurs')!;
  const ev3 = [...events].find(e => e.title === 'Cercle de parole')!;

  // Marie participates in events 1, 2, 3
  for (const ev of [ev1, ev2, ev3]) {
    set.add({ '@graph': GRAPH, '@type': 'http://festipod.org/Participation', '@id': `part:${marie['@id']}:${ev['@id']}`, event: ev['@id'], user: marie['@id'], isConfirmed: true } as FpParticipation);
  }
  // Jean participates in event 1
  set.add({ '@graph': GRAPH, '@type': 'http://festipod.org/Participation', '@id': `part:${jean['@id']}:${ev1['@id']}`, event: ev1['@id'], user: jean['@id'], isConfirmed: true } as FpParticipation);
  // Thomas participates in event 1
  set.add({ '@graph': GRAPH, '@type': 'http://festipod.org/Participation', '@id': `part:${thomas['@id']}:${ev1['@id']}`, event: ev1['@id'], user: thomas['@id'], isConfirmed: true } as FpParticipation);

  return set;
}

// ============================================================================
// Harness component — exposes window.__testData
// ============================================================================

function DataHarness() {
  const eventsRef = useRef(seedEvents());
  const usersRef = useRef(seedUsers());
  const participationsRef = useRef(seedParticipations(eventsRef.current, usersRef.current));

  const events = eventsRef.current;
  const users = usersRef.current;
  const participations = participationsRef.current;

  // Current user = first user (Marie)
  const currentUser = [...users][0];

  useEffect(() => {
    (window as any).__testData = {
      ready: true,
      events,
      users,
      participations,
      currentUserId: currentUser?.['@id'] || '',

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
          '@graph': GRAPH,
          '@type': 'http://festipod.org/Participation',
          '@id': `part:${userId}:${eventId}:${Date.now()}`,
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
      clearAll() {
        for (const p of [...participations]) participations.delete(p);
        for (const e of [...events]) events.delete(e);
        for (const u of [...users]) users.delete(u);
      },
    };
    console.log('[TestHarness] Ready — events:', events.size, 'users:', users.size, 'participations:', participations.size);
  }, []);

  return <div id="harness-status">READY</div>;
}

// ============================================================================
// Bootstrap
// ============================================================================

const root = createRoot(document.getElementById('root')!);
root.render(<DataHarness />);
