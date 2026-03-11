/**
 * Seed/fake data for Festipod mockups.
 * Used as defaults when not connected to NextGraph or when the store is empty.
 */

import type { FpEventData, FpUserData, FpParticipationData, FpMeetingPointData, FpFriendshipData } from './types';

// Current user (the logged-in user in the mockup)
export const CURRENT_USER_ID = 'user-1';

export const seedUsers: FpUserData[] = [
  {
    id: 'user-1',
    name: 'Marie Dupont',
    initials: 'MD',
    username: '@mariedupont',
    bio: 'Passionnée de transition écologique et de rencontres humaines.',
    city: 'Lyon, France',
    eventsCount: 12,
    friendsCount: 48,
    participationsCount: 156,
  },
  {
    id: 'user-2',
    name: 'Jean Durand',
    initials: 'JD',
    username: '@jeandurand',
    eventsCount: 8,
    friendsCount: 23,
    participationsCount: 42,
  },
  {
    id: 'user-3',
    name: 'Alice Martin',
    initials: 'AM',
    username: '@alice',
  },
  {
    id: 'user-4',
    name: 'Baptiste Morel',
    initials: 'BM',
    username: '@baptiste',
  },
  {
    id: 'user-5',
    name: 'Camille Dubois',
    initials: 'CD',
    username: '@camille',
  },
  {
    id: 'user-6',
    name: 'David Leroy',
    initials: 'DL',
    username: '@david',
  },
  {
    id: 'user-7',
    name: 'Thomas Martin',
    initials: 'TM',
    username: '@thomas',
  },
  {
    id: 'user-8',
    name: 'Emma Bernard',
    initials: 'EB',
    username: '@emma',
  },
  {
    id: 'user-9',
    name: 'François Petit',
    initials: 'FP',
    username: '@francois',
  },
  {
    id: 'user-10',
    name: 'Emma Girard',
    initials: 'EG',
    username: '@emma',
    eventsCount: 7,
  },
  // Public profiles
  {
    id: 'user-pub-1',
    name: 'Léa Bernard',
    initials: 'LB',
    username: '@leabernard',
    role: 'Relayeuse',
    isPublic: true,
    eventsCount: 45,
  },
  {
    id: 'user-pub-2',
    name: 'Marc Richard',
    initials: 'MR',
    username: '@marcrichard',
    role: 'Animateur',
    isPublic: true,
    eventsCount: 67,
  },
  {
    id: 'user-pub-3',
    name: 'Sophie Fontaine',
    initials: 'SF',
    username: '@sophief',
    role: 'Créatrice',
    isPublic: true,
    eventsCount: 23,
  },
  {
    id: 'user-pub-4',
    name: 'Pierre Gagnon',
    initials: 'PG',
    username: '@pierreg',
    role: 'Relayeur',
    isPublic: true,
    eventsCount: 89,
  },
];

export const seedEvents: FpEventData[] = [
  {
    id: 'event-1',
    title: 'Résidence Reconnexion',
    date: 'Lun. 16 - Ven. 20 fév.',
    startDate: '2026-02-16',
    endDate: '2026-02-20',
    startTime: '09:00',
    endTime: '18:00',
    location: 'Le Revel, Rogues (30)',
    distance: 142,
    participantCount: 24,
    description: 'Une semaine collaborative pour se rencontrer, co-créer et faire avancer le projet de Réseau Social Universel. Au programme : sessions plénières en intelligence collective, ateliers en forum ouvert, et randonnée au Cirque de Navacelles. Hébergement sur place au Revel, écolieu à Rogues dans le Gard.',
    hostName: 'Reconnexion',
    hostInitials: 'RC',
    themes: ['Social'],
  },
  {
    id: 'event-2',
    title: 'Atelier low-tech',
    date: 'Sam. 8 fév. · 14h00',
    startDate: '2026-02-08',
    startTime: '14:00',
    endTime: '17:00',
    location: 'La Maison du Vélo, Lyon',
    distance: 3,
    participantCount: 12,
    description: 'Un atelier pratique pour découvrir les low-tech et apprendre à fabriquer des objets du quotidien.',
    hostName: 'La Maison du Vélo',
    hostInitials: 'MV',
    themes: ['Tech', 'Nature'],
  },
  {
    id: 'event-3',
    title: 'Forum Ouvert Transition',
    date: 'Sam. 22 fév. · 9h00',
    startDate: '2026-02-22',
    startTime: '09:00',
    endTime: '18:00',
    location: "Tiers-lieu L'Hermitage",
    distance: 89,
    participantCount: 45,
    description: "Un forum ouvert sur la transition écologique et sociale, dans le tiers-lieu L'Hermitage.",
    hostName: "L'Hermitage",
    hostInitials: 'LH',
    themes: ['Social', 'Nature'],
  },
  {
    id: 'event-4',
    title: 'Formation CNV',
    date: 'Sam. 1 mars · 9h30',
    startDate: '2026-03-01',
    startTime: '09:30',
    endTime: '17:00',
    location: 'MJC Montplaisir, Lyon',
    distance: 5,
    participantCount: 16,
    description: 'Initiation à la Communication Non Violente. Venez découvrir les bases de la CNV pour améliorer vos relations.',
    hostName: 'MJC Montplaisir',
    hostInitials: 'MJ',
    themes: ['Social'],
  },
  {
    id: 'event-5',
    title: 'Rencontre des Colibris',
    date: 'Mer. 12 fév. · 19h00',
    startDate: '2026-02-12',
    startTime: '19:00',
    endTime: '21:00',
    location: "La Maison de l'Environnement",
    distance: 7,
    participantCount: 30,
    description: "Rencontre mensuelle du groupe local des Colibris pour échanger sur les projets en cours.",
    hostName: 'Les Colibris',
    hostInitials: 'LC',
    themes: ['Social', 'Nature'],
  },
];

// Participations: which users are in which events
export const seedParticipations: FpParticipationData[] = [
  // Marie (current user) participates in events 1, 2, 3
  { id: 'part-1', eventId: 'event-1', userId: 'user-1', isConfirmed: true },
  { id: 'part-2', eventId: 'event-2', userId: 'user-1', isConfirmed: true },
  { id: 'part-3', eventId: 'event-3', userId: 'user-1', isConfirmed: true },
  // Jean participates in events 1
  { id: 'part-4', eventId: 'event-1', userId: 'user-2', isConfirmed: true },
  // Thomas participates in event 1
  { id: 'part-5', eventId: 'event-1', userId: 'user-7', isConfirmed: true },
];

export const seedMeetingPoints: FpMeetingPointData[] = [
  {
    id: 'mp-1',
    eventId: 'event-1',
    location: 'Café de la Place',
    time: '30 min avant',
    hostName: 'Marie',
    hostInitials: 'MD',
  },
  {
    id: 'mp-2',
    eventId: 'event-1',
    location: 'Station de métro Bellecour',
    time: '15h30',
    hostName: 'Jean',
    hostInitials: 'JD',
  },
];

export const seedFriendships: FpFriendshipData[] = [
  { id: 'fr-1', userId: 'user-1', friendId: 'user-2' },
  { id: 'fr-2', userId: 'user-1', friendId: 'user-3' },
  { id: 'fr-3', userId: 'user-1', friendId: 'user-4' },
  { id: 'fr-4', userId: 'user-1', friendId: 'user-5' },
  { id: 'fr-5', userId: 'user-1', friendId: 'user-6' },
  { id: 'fr-6', userId: 'user-1', friendId: 'user-10' },
];
