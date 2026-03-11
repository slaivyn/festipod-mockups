import React from 'react';

// Home module
import { HomeScreen } from '../modules/home/screens/HomeScreen';
import { SettingsScreen } from '../modules/home/screens/SettingsScreen';

// Auth module
import { LoginScreen } from '../modules/auth/screens/LoginScreen';
import { WelcomeScreen } from '../modules/auth/screens/WelcomeScreen';

// Event module
import { EventsScreen } from '../modules/event/screens/EventsScreen';
import { EventDetailScreen } from '../modules/event/screens/EventDetailScreen';
import { CreateEventScreen } from '../modules/event/screens/CreateEventScreen';
import { UpdateEventScreen } from '../modules/event/screens/UpdateEventScreen';
import { InviteScreen } from '../modules/event/screens/InviteScreen';
import { ParticipantsListScreen } from '../modules/event/screens/ParticipantsListScreen';
import { MeetingPointsScreen } from '../modules/event/screens/MeetingPointsScreen';

// User module
import { ProfileScreen } from '../modules/user/screens/ProfileScreen';
import { UpdateProfileScreen } from '../modules/user/screens/UpdateProfileScreen';
import { UserProfileScreen } from '../modules/user/screens/UserProfileScreen';
import { FriendsListScreen } from '../modules/user/screens/FriendsListScreen';
import { ShareProfileScreen } from '../modules/user/screens/ShareProfileScreen';

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
      { id: 'welcome', name: 'Bienvenue', component: WelcomeScreen },
      { id: 'home', name: 'Accueil', component: HomeScreen },
    ],
  },
  {
    id: 'events',
    name: 'Événements',
    screens: [
      { id: 'events', name: 'Découvrir', component: EventsScreen },
      { id: 'event-detail', name: 'Détail événement', component: EventDetailScreen },
      { id: 'create-event', name: 'Relayer événement', component: CreateEventScreen },
      { id: 'update-event', name: 'Modifier événement', component: UpdateEventScreen },
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
      { id: 'update-profile', name: 'Modifier mon profil', component: UpdateProfileScreen },
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
