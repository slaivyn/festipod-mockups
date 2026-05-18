// Screen registry — used by Storybook and tests
// Screens no longer receive props; they use useNavigate/useParams hooks from the router.

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
  path: string;
  component: React.ComponentType;
}

export const screens: Screen[] = [
  { id: 'welcome', name: 'Bienvenue', path: '/', component: WelcomeScreen },
  { id: 'login', name: 'Connexion', path: '/login', component: LoginScreen },
  { id: 'home', name: 'Accueil', path: '/home', component: HomeScreen },
  { id: 'events', name: 'Découvrir', path: '/events', component: EventsScreen },
  { id: 'create-event', name: 'Relayer événement', path: '/events/new', component: CreateEventScreen },
  { id: 'event-detail', name: 'Détail événement', path: '/events/:id', component: EventDetailScreen },
  { id: 'update-event', name: 'Modifier événement', path: '/events/:id/edit', component: UpdateEventScreen },
  { id: 'invite', name: 'Inviter des amis', path: '/events/:id/invite', component: InviteScreen },
  { id: 'participants', name: 'Participants', path: '/events/:id/participants', component: ParticipantsListScreen },
  { id: 'meeting-points', name: 'Points de rencontre', path: '/events/:id/meeting-points', component: MeetingPointsScreen },
  { id: 'profile', name: 'Mon profil', path: '/profile', component: ProfileScreen },
  { id: 'edit-profile', name: 'Modifier profil', path: '/profile/edit', component: UpdateProfileScreen },
  { id: 'friends', name: 'Mon réseau', path: '/profile/friends', component: FriendsListScreen },
  { id: 'share-profile', name: 'Partager profil', path: '/profile/share', component: ShareProfileScreen },
  { id: 'user-profile', name: 'Profil utilisateur', path: '/users/:id', component: UserProfileScreen },
  { id: 'settings', name: 'Paramètres', path: '/settings', component: SettingsScreen },
];

export function getScreen(id: string): Screen | undefined {
  return screens.find(s => s.id === id);
}
