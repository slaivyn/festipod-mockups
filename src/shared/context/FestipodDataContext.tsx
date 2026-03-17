import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type {
  FpEventData,
  FpUserData,
  FpParticipationData,
  FpMeetingPointData,
  FpFriendshipData,
} from '../data/types';
import {
  CURRENT_USER_ID,
  seedEvents,
  seedUsers,
  seedParticipations,
  seedMeetingPoints,
  seedFriendships,
} from '../data/seedData';
import { useNextGraph } from './NextGraphContext';
import { useShapeWithDefaults } from '../hooks/useShapeWithDefaults';
import {
  FpEventShapeType,
  FpUserProfileShapeType,
  FpParticipationShapeType,
} from '../shapes/orm/festipodShapes.shapeTypes';
import type { FpEvent, FpUserProfile, FpParticipation } from '../shapes/orm/festipodShapes.typings';
import { bootstrapWallet, type BootstrapResult } from '../utils/ngBootstrap';
import { ensureGraphNuri } from '../utils/ngGraph';

// ============================================================================
// Context interface
// ============================================================================

interface FestipodDataContextValue {
  currentUserId: string;
  currentUser: FpUserData | undefined;

  events: FpEventData[];
  users: FpUserData[];
  participations: FpParticipationData[];
  meetingPoints: FpMeetingPointData[];
  friendships: FpFriendshipData[];

  getEvent(id: string): FpEventData | undefined;
  getUser(id: string): FpUserData | undefined;
  getEventParticipants(eventId: string): FpUserData[];
  getUserEvents(userId: string): FpEventData[];
  isParticipating(eventId: string, userId?: string): boolean;
  getFriends(userId?: string): FpUserData[];
  getEventMeetingPoints(eventId: string): FpMeetingPointData[];

  selectedEventId: string;
  setSelectedEventId(id: string): void;
  selectedEvent: FpEventData | undefined;
  selectedUserId: string;
  setSelectedUserId(id: string): void;
  selectedUser: FpUserData | undefined;

  createEvent(event: Omit<FpEventData, 'id'>): FpEventData;
  updateEvent(id: string, updates: Partial<FpEventData>): void;
  joinEvent(eventId: string, userId?: string): void;
  leaveEvent(eventId: string, userId?: string): void;
  addMeetingPoint(mp: Omit<FpMeetingPointData, 'id'>): void;
  addFriend(friendId: string): void;
  updateProfile(updates: Partial<FpUserData>): void;
  loadTestData(): Promise<BootstrapResult>;
}

const FestipodDataContext = createContext<FestipodDataContextValue | null>(null);

// ============================================================================
// Helpers
// ============================================================================

let idCounter = 100;
function nextId(prefix: string): string {
  return `${prefix}-${++idCounter}`;
}

function findNg<T extends { "@id": string }>(set: Set<T>, predicate: (item: T) => boolean): T | undefined {
  for (const item of set) {
    if (predicate(item)) return item;
  }
  return undefined;
}

// NG shape → app type mappers
const mapEvent = (e: FpEvent): FpEventData => ({
  id: e["@id"],
  title: e.title,
  description: e.description || '',
  date: e.date,
  location: e.location,
  distance: e.distance,
  participantCount: e.participantCount,
  coverImage: e.coverImage,
  hostName: e.hostName,
  hostInitials: e.hostInitials,
});

const mapUser = (u: FpUserProfile): FpUserData => ({
  id: u["@id"],
  name: u.name,
  initials: u.initials,
  username: u.username,
  role: u.role,
  isPublic: u.isPublic,
});

const mapParticipation = (p: FpParticipation): FpParticipationData => ({
  id: p["@id"],
  eventId: p.event,
  userId: p.user,
  isConfirmed: p.isConfirmed,
});

// ============================================================================
// Shared queries builder — same logic for both local and NG modes
// ============================================================================

function buildQueries(
  events: FpEventData[],
  users: FpUserData[],
  participations: FpParticipationData[],
  meetingPoints: FpMeetingPointData[],
  friendships: FpFriendshipData[],
  currentUserId: string,
) {
  const getEvent = (id: string) => events.find(e => e.id === id);
  const getUser = (id: string) => users.find(u => u.id === id);

  const getEventParticipants = (eventId: string) => {
    const partUserIds = participations.filter(p => p.eventId === eventId).map(p => p.userId);
    return users.filter(u => partUserIds.includes(u.id));
  };

  const getUserEvents = (userId: string) => {
    const partEventIds = participations.filter(p => p.userId === userId).map(p => p.eventId);
    return events.filter(e => partEventIds.includes(e.id));
  };

  const isParticipating = (eventId: string, userId?: string) => {
    const uid = userId || currentUserId;
    return participations.some(p => p.eventId === eventId && p.userId === uid);
  };

  const getFriends = (userId?: string) => {
    const uid = userId || currentUserId;
    const friendIds = friendships
      .filter(f => f.userId === uid || f.friendId === uid)
      .map(f => f.userId === uid ? f.friendId : f.userId);
    return users.filter(u => friendIds.includes(u.id));
  };

  const getEventMeetingPoints = (eventId: string) => {
    return meetingPoints.filter(mp => mp.eventId === eventId);
  };

  return { getEvent, getUser, getEventParticipants, getUserEvents, isParticipating, getFriends, getEventMeetingPoints };
}

// ============================================================================
// Local (disconnected) provider — uses seed data directly, read-only
// ============================================================================

function useLocalData(empty?: boolean): FestipodDataContextValue {
  const [selectedEventId, setSelectedEventId] = useState<string>(empty ? '' : 'event-1');
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const events = empty ? [] : seedEvents;
  const users = empty ? [] : seedUsers;
  const participations = empty ? [] : seedParticipations;
  const meetingPoints = empty ? [] : seedMeetingPoints;
  const friendships = empty ? [] : seedFriendships;

  const currentUserId = empty ? '' : CURRENT_USER_ID;
  const currentUser = users.find(u => u.id === currentUserId);
  const selectedEvent = events.find(e => e.id === selectedEventId);
  const selectedUser = users.find(u => u.id === selectedUserId);

  const queries = buildQueries(events, users, participations, meetingPoints, friendships, currentUserId);

  console.log('[FestipodData] Render —', empty ? 'connecting (empty)' : 'local',
    '| events:', events.length,
    '| selectedEvent:', selectedEvent?.title ?? '(none)');

  // Local mode: mutations are no-ops (static defaults)
  const createEvent = useCallback((event: Omit<FpEventData, 'id'>): FpEventData => {
    console.log('[FestipodData] createEvent (local, no-op):', event.title);
    return { ...event, id: nextId('event') };
  }, []);
  const updateEvent = useCallback((_id: string, _updates: Partial<FpEventData>) => {
    console.log('[FestipodData] updateEvent (local, no-op)');
  }, []);
  const joinEvent = useCallback((_eventId: string) => {
    console.log('[FestipodData] joinEvent (local, no-op)');
  }, []);
  const leaveEvent = useCallback((_eventId: string) => {
    console.log('[FestipodData] leaveEvent (local, no-op)');
  }, []);
  const addMeetingPoint = useCallback((_mp: Omit<FpMeetingPointData, 'id'>) => {
    console.log('[FestipodData] addMeetingPoint (local, no-op)');
  }, []);
  const addFriend = useCallback((_friendId: string) => {
    console.log('[FestipodData] addFriend (local, no-op)');
  }, []);
  const updateProfile = useCallback((_updates: Partial<FpUserData>) => {
    console.log('[FestipodData] updateProfile (local, no-op)');
  }, []);
  const loadTestData = useCallback(async (): Promise<BootstrapResult> => {
    console.log('[FestipodData] loadTestData (local, no-op)');
    return { seeded: false, userIdMap: new Map(), eventIdMap: new Map() };
  }, []);

  return {
    currentUserId, currentUser,
    events, users, participations, meetingPoints, friendships,
    selectedEventId, setSelectedEventId, selectedEvent,
    selectedUserId, setSelectedUserId, selectedUser,
    ...queries,
    createEvent, updateEvent, joinEvent, leaveEvent,
    addMeetingPoint, addFriend, updateProfile, loadTestData,
  };
}

// ============================================================================
// NextGraph-connected provider — reads directly from NG wallet
// ============================================================================

function useNgData(): FestipodDataContextValue {
  const { session } = useNextGraph();
  // Use private store NURI as scope (same as expense-tracker-rdf).
  // This opens the store repo in the verifier, enabling both reads and writes.
  const privateNuri = session && `did:ng:${session.private_store_id}`;

  // useShapeWithDefaults: show EMPTY data until NG populates (no seed defaults)
  const emptyEvents: FpEventData[] = [];
  const emptyUsers: FpUserData[] = [];
  const emptyParticipations: FpParticipationData[] = [];

  const eventsShape = useShapeWithDefaults(FpEventShapeType, privateNuri, emptyEvents, mapEvent, true);
  const usersShape = useShapeWithDefaults(FpUserProfileShapeType, privateNuri, emptyUsers, mapUser, true);
  const participationsShape = useShapeWithDefaults(FpParticipationShapeType, privateNuri, emptyParticipations, mapParticipation, true);

  const events = eventsShape.items;
  const users = usersShape.items;
  const participations = participationsShape.items;

  // Not in SHEX shapes yet
  const [meetingPoints, setMeetingPoints] = useState<FpMeetingPointData[]>([]);
  const [friendships, setFriendships] = useState<FpFriendshipData[]>([]);

  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  // Auto-select first event when data appears from NG
  useEffect(() => {
    if (!selectedEventId && events.length > 0) {
      setSelectedEventId(events[0].id);
    }
  }, [events.length, selectedEventId]);

  // --- Derived ---
  const currentUser = users.find(u => u.username === '@mariedupont') || users[0];
  const currentUserId = currentUser?.id || '';
  const selectedEvent = events.find(e => e.id === selectedEventId);
  const selectedUser = users.find(u => u.id === selectedUserId);

  const queries = buildQueries(events, users, participations, meetingPoints, friendships, currentUserId);

  console.log('[FestipodData] Render — NG | events:', events.length,
    '| users:', users.length, '| participations:', participations.length,
    '| selectedEvent:', selectedEvent?.title ?? '(none)');

  // --- Mutations (NG) ---
  const createEvent = useCallback((event: Omit<FpEventData, 'id'>): FpEventData => {
    console.log('[FestipodData] createEvent (NG):', event.title);
    (async () => {
      const graph = await ensureGraphNuri(eventsShape.ngSet as any, usersShape.ngSet as any, participationsShape.ngSet as any);
      eventsShape.ngSet.add({
        "@graph": graph, "@type": "http://festipod.org/Event", "@id": "",
        title: event.title, description: event.description, date: event.date,
        location: event.location, distance: event.distance,
        participantCount: event.participantCount || 1,
        coverImage: event.coverImage, hostName: event.hostName, hostInitials: event.hostInitials,
      } as FpEvent);
      const addedEvent = [...eventsShape.ngSet].find(e => e.title === event.title);
      if (addedEvent && currentUserId) {
        participationsShape.ngSet.add({
          "@graph": graph, "@type": "http://festipod.org/Participation", "@id": "",
          event: addedEvent["@id"], user: currentUserId, isConfirmed: true,
        } as FpParticipation);
        setSelectedEventId(addedEvent["@id"]);
      }
    })();
    return { ...event, id: `ng-pending-${Date.now()}` };
  }, [eventsShape.ngSet, usersShape.ngSet, participationsShape.ngSet, currentUserId]);

  const updateEvent = useCallback((id: string, updates: Partial<FpEventData>) => {
    console.log('[FestipodData] updateEvent (NG):', id, updates);
    const ngEvent = findNg(eventsShape.ngSet as any as Set<FpEvent>, e => e["@id"] === id);
    if (ngEvent) {
      if (updates.title !== undefined) ngEvent.title = updates.title;
      if (updates.description !== undefined) ngEvent.description = updates.description;
      if (updates.date !== undefined) ngEvent.date = updates.date;
      if (updates.location !== undefined) ngEvent.location = updates.location;
      if (updates.distance !== undefined) ngEvent.distance = updates.distance;
      if (updates.participantCount !== undefined) ngEvent.participantCount = updates.participantCount;
    }
  }, [eventsShape.ngSet]);

  const joinEvent = useCallback((eventId: string, userId?: string) => {
    const uid = userId || currentUserId;
    console.log('[FestipodData] joinEvent (NG):', eventId, 'user:', uid);
    const existing = [...participationsShape.ngSet].find(p => p.event === eventId && p.user === uid);
    if (existing) {
      console.log('[FestipodData] Already participating, skipping');
      return;
    }
    (async () => {
      const graph = await ensureGraphNuri(eventsShape.ngSet as any, usersShape.ngSet as any, participationsShape.ngSet as any);
      participationsShape.ngSet.add({
        "@graph": graph, "@type": "http://festipod.org/Participation", "@id": "",
        event: eventId, user: uid, isConfirmed: true,
      } as FpParticipation);
      const ngEvent = findNg(eventsShape.ngSet as any as Set<FpEvent>, e => e["@id"] === eventId);
      if (ngEvent) {
        ngEvent.participantCount = ngEvent.participantCount + 1;
      }
      console.log('[FestipodData] joinEvent done');
    })();
  }, [participationsShape.ngSet, eventsShape.ngSet, usersShape.ngSet, currentUserId]);

  const leaveEvent = useCallback((eventId: string, userId?: string) => {
    const uid = userId || currentUserId;
    console.log('[FestipodData] leaveEvent (NG):', eventId, 'user:', uid);
    const ngPart = [...participationsShape.ngSet].find(p => p.event === eventId && p.user === uid);
    if (ngPart) {
      console.log('[FestipodData] Deleting participation:', ngPart["@id"]);
      participationsShape.ngSet.delete(ngPart);
      const ngEvent = findNg(eventsShape.ngSet as any as Set<FpEvent>, e => e["@id"] === eventId);
      if (ngEvent) {
        ngEvent.participantCount = Math.max(0, ngEvent.participantCount - 1);
      }
    }
  }, [participationsShape.ngSet, eventsShape.ngSet, currentUserId]);

  const addMeetingPoint = useCallback((mp: Omit<FpMeetingPointData, 'id'>) => {
    setMeetingPoints(prev => [...prev, { ...mp, id: `ng-mp-${Date.now()}` }]);
  }, []);

  const addFriend = useCallback((friendId: string) => {
    setFriendships(prev => {
      if (prev.some(f =>
        (f.userId === currentUserId && f.friendId === friendId) ||
        (f.userId === friendId && f.friendId === currentUserId)
      )) return prev;
      return [...prev, { id: `ng-fr-${Date.now()}`, userId: currentUserId, friendId }];
    });
  }, [currentUserId]);

  const updateProfile = useCallback((updates: Partial<FpUserData>) => {
    console.log('[FestipodData] updateProfile (NG):', updates);
    const ngUser = findNg(usersShape.ngSet as any as Set<FpUserProfile>, u => u.username === '@mariedupont')
      || [...usersShape.ngSet][0];
    if (ngUser) {
      if (updates.name !== undefined) ngUser.name = updates.name;
      if (updates.initials !== undefined) ngUser.initials = updates.initials;
      if (updates.username !== undefined) ngUser.username = updates.username;
      if (updates.role !== undefined) ngUser.role = updates.role;
      if (updates.isPublic !== undefined) ngUser.isPublic = updates.isPublic;
    }
  }, [usersShape.ngSet]);

  const loadTestData = useCallback(async (): Promise<BootstrapResult> => {
    console.log('[FestipodData] loadTestData (NG)');
    return bootstrapWallet(
      eventsShape.ngSet as any,
      usersShape.ngSet as any,
      participationsShape.ngSet as any,
    );
  }, [eventsShape.ngSet, usersShape.ngSet, participationsShape.ngSet]);

  return {
    currentUserId, currentUser,
    events, users, participations, meetingPoints, friendships,
    selectedEventId, setSelectedEventId, selectedEvent,
    selectedUserId, setSelectedUserId, selectedUser,
    ...queries,
    createEvent, updateEvent, joinEvent, leaveEvent,
    addMeetingPoint, addFriend, updateProfile, loadTestData,
  };
}

// ============================================================================
// Provider — switches between local and NG
// ============================================================================

function LocalDataProvider({ children, empty }: { children: ReactNode; empty?: boolean }) {
  const data = useLocalData(empty);
  return <FestipodDataContext.Provider value={data}>{children}</FestipodDataContext.Provider>;
}

function NgDataProvider({ children }: { children: ReactNode }) {
  const data = useNgData();
  return <FestipodDataContext.Provider value={data}>{children}</FestipodDataContext.Provider>;
}

export function FestipodDataProvider({ children }: { children: ReactNode }) {
  const { status } = useNextGraph();
  console.log('[FestipodData] Provider — NG status:', status);

  if (status === 'connected') {
    return <NgDataProvider>{children}</NgDataProvider>;
  }
  if (status === 'connecting') {
    // NG initializing: show empty state (no misleading seed data flash)
    return <LocalDataProvider empty>{children}</LocalDataProvider>;
  }
  // Disconnected or error: demo mode with seed data
  return <LocalDataProvider>{children}</LocalDataProvider>;
}

// ============================================================================
// Hook
// ============================================================================

export function useFestipodData() {
  const context = useContext(FestipodDataContext);
  if (!context) {
    throw new Error('useFestipodData must be used within a FestipodDataProvider');
  }
  return context;
}
