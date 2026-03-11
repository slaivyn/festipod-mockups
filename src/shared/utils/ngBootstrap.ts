/**
 * Bootstrap: seeds default data into the NextGraph wallet on first use.
 *
 * Called once after NG connection + shapes ready. If the wallet already
 * has events/users, it's a returning user — skip seeding.
 */

import type { DeepSignalSet } from '@ng-org/alien-deepsignals';
import type { FpEvent, FpUserProfile, FpParticipation } from '../shapes/orm/festipodShapes.typings';
import { sessionPromise } from './ngSession';
import {
  seedEvents,
  seedUsers,
  seedParticipations,
} from '../data/seedData';

export interface BootstrapResult {
  seeded: boolean;
  userIdMap: Map<string, string>;
  eventIdMap: Map<string, string>;
}

export async function bootstrapWallet(
  ngEvents: DeepSignalSet<FpEvent>,
  ngUsers: DeepSignalSet<FpUserProfile>,
  ngParticipations: DeepSignalSet<FpParticipation>,
): Promise<BootstrapResult> {
  const session = await sessionPromise;
  const graph = `did:ng:${session.private_store_id}`;

  // Already has data → returning user, nothing to seed
  if (ngEvents.size > 0 || ngUsers.size > 0) {
    console.log('[Bootstrap] Wallet already has data — events:', ngEvents.size,
      'users:', ngUsers.size, 'participations:', ngParticipations.size);
    return { seeded: false, userIdMap: new Map(), eventIdMap: new Map() };
  }

  console.log('[Bootstrap] First time for this wallet — seeding default data...');

  // Seed users
  const userIdMap = new Map<string, string>();
  for (const u of seedUsers) {
    ngUsers.add({
      "@graph": graph,
      "@type": "http://festipod.org/UserProfile",
      "@id": "",
      name: u.name,
      initials: u.initials,
      username: u.username,
      role: u.role,
      isPublic: u.isPublic,
    } as FpUserProfile);
    const added = [...ngUsers].find(nu => nu.username === u.username);
    if (added) userIdMap.set(u.id, added["@id"]);
  }
  console.log('[Bootstrap] Seeded', userIdMap.size, 'users');

  // Seed events
  const eventIdMap = new Map<string, string>();
  for (const e of seedEvents) {
    ngEvents.add({
      "@graph": graph,
      "@type": "http://festipod.org/Event",
      "@id": "",
      title: e.title,
      description: e.description,
      date: e.date,
      location: e.location,
      distance: e.distance,
      participantCount: e.participantCount,
      coverImage: e.coverImage,
      hostName: e.hostName,
      hostInitials: e.hostInitials,
    } as FpEvent);
    const added = [...ngEvents].find(ne => ne.title === e.title);
    if (added) eventIdMap.set(e.id, added["@id"]);
  }
  console.log('[Bootstrap] Seeded', eventIdMap.size, 'events');

  // Seed participations with mapped IDs
  let partCount = 0;
  for (const p of seedParticipations) {
    const eventIri = eventIdMap.get(p.eventId) || p.eventId;
    const userIri = userIdMap.get(p.userId) || p.userId;
    ngParticipations.add({
      "@graph": graph,
      "@type": "http://festipod.org/Participation",
      "@id": "",
      event: eventIri,
      user: userIri,
      isConfirmed: p.isConfirmed,
    } as FpParticipation);
    partCount++;
  }
  console.log('[Bootstrap] Seeded', partCount, 'participations');

  return { seeded: true, userIdMap, eventIdMap };
}
