import React from 'react';
import { HomeScreen } from './HomeScreen';
import { LoginScreen } from './LoginScreen';
import { ProfileScreen } from './ProfileScreen';
import { SettingsScreen } from './SettingsScreen';
import { UserProfileScreen } from './UserProfileScreen';
import { EventsScreen } from './EventsScreen';
import { EventDetailScreen } from './EventDetailScreen';
import { CreateEventScreen } from './CreateEventScreen';
import { InviteScreen } from './InviteScreen';
import { ParticipantsListScreen } from './ParticipantsListScreen';
import { MeetingPointsScreen } from './MeetingPointsScreen';
import { FriendsListScreen } from './FriendsListScreen';
import { ShareProfileScreen } from './ShareProfileScreen';

export interface Screen {
  id: string;
  name: string;
  component: React.ComponentType<ScreenProps>;
}

export interface ScreenGroup {
  id: string;
  name: string;
  screens: Screen[];
}

export interface ScreenProps {
  navigate: (screenId: string) => void;
}

export const screenGroups: ScreenGroup[] = [
  {
    id: 'home',
    name: 'Accueil',
    screens: [
      { id: 'home', name: 'Accueil', component: HomeScreen },
    ],
  },
  {
    id: 'events',
    name: 'Événements',
    screens: [
      { id: 'events', name: 'Découvrir', component: EventsScreen },
      { id: 'event-detail', name: 'Détail événement', component: EventDetailScreen },
      { id: 'create-event', name: 'Créer événement', component: CreateEventScreen },
      { id: 'invite', name: 'Inviter des amis', component: InviteScreen },
      { id: 'participants-list', name: 'Liste des participants', component: ParticipantsListScreen },
      { id: 'meeting-points', name: 'Points de rencontre', component: MeetingPointsScreen },
    ],
  },
  {
    id: 'user',
    name: 'Utilisateur',
    screens: [
      { id: 'profile', name: 'Mon profil', component: ProfileScreen },
      { id: 'user-profile', name: 'Profil d\'un utilisateur', component: UserProfileScreen },
      { id: 'friends-list', name: 'Mon réseau', component: FriendsListScreen },
      { id: 'share-profile', name: 'Partager mon profil', component: ShareProfileScreen },
    ],
  },
  {
    id: 'general',
    name: 'Général',
    screens: [
      { id: 'login', name: 'Connexion', component: LoginScreen },
      { id: 'settings', name: 'Paramètres', component: SettingsScreen },
    ],
  },
];

// Flat list of all screens for compatibility
export const screens: Screen[] = screenGroups.flatMap(group => group.screens);

export function getScreen(id: string): Screen | undefined {
  return screens.find(s => s.id === id);
}
