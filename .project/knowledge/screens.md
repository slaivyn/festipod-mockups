# Screens

16 mobile mockup screens using the sketchy hand-drawn component library.

## Screen Inventory

### Home Module (`src/modules/home/screens/`)

| ID | Name | File | Description |
|----|------|------|-------------|
| `welcome` | Bienvenue | WelcomeScreen.tsx | Onboarding/welcome page |
| `home` | Accueil | HomeScreen.tsx | Dashboard with upcoming events, quick actions |
| `settings` | Parametres | SettingsScreen.tsx | Notifications, privacy, location settings |

### Event Module (`src/modules/event/screens/`)

| ID | Name | File | Description |
|----|------|------|-------------|
| `events` | Decouvrir | EventsScreen.tsx | Event discovery/search |
| `event-detail` | Detail evenement | EventDetailScreen.tsx | Event info, participants, join/leave |
| `create-event` | Relayer evenement | CreateEventScreen.tsx | Create/relay event, import from Mobilizon/Transiscope |
| `update-event` | Modifier evenement | UpdateEventScreen.tsx | Edit existing event |
| `invite` | Inviter des amis | InviteScreen.tsx | Invite contacts to event |
| `participants-list` | Liste des participants | ParticipantsListScreen.tsx | Event participant list |
| `meeting-points` | Points de rencontre | MeetingPointsScreen.tsx | Carpooling/meeting coordination |

### User Module (`src/modules/user/screens/`)

| ID | Name | File | Description |
|----|------|------|-------------|
| `profile` | Mon profil | ProfileScreen.tsx | Current user profile |
| `update-profile` | Modifier mon profil | UpdateProfileScreen.tsx | Edit profile form |
| `user-profile` | Profil d'un utilisateur | UserProfileScreen.tsx | View another user's profile |
| `friends-list` | Mon reseau | FriendsListScreen.tsx | Network/friends list |
| `share-profile` | Partager mon profil | ShareProfileScreen.tsx | QR code + link sharing |

### Auth Module (`src/modules/auth/screens/`)

| ID | Name | File | Description |
|----|------|------|-------------|
| `login` | Connexion | LoginScreen.tsx | Login (NextGraph + email fallback) |

## Screen Registry

`src/screens/index.ts` imports all screens and exports:

```typescript
export interface ScreenProps {
  navigate: (screenId: string) => void;
}

export const screenGroups: ScreenGroup[]  // Grouped: home, events, user, general
export const screens: Screen[]            // Flat list
export function getScreen(id: string): Screen | undefined
```

## Sketchy Component Library

`src/shared/components/sketchy/` — hand-drawn UI with custom font:

| Component | Usage |
|-----------|-------|
| `Header` | Screen header with back button |
| `NavBar` | Bottom tab navigation |
| `Button` | Action buttons |
| `Card` | Content cards |
| `Input` | Text inputs |
| `Title`, `Subtitle`, `Text` | Typography |
| `Avatar` | User avatars with initials |
| `Badge` | Status/category badges |
| `Toggle`, `Checkbox` | Form controls |
| `ListItem` | List row items |
| `Divider` | Section separators |
| `Placeholder` | Image/content placeholders |
| `PhoneFrame` | Phone device frame wrapper |
| `BrokerBanner` | NextGraph connection status banner |
| `NgStatus` | Connection indicator dot |

## Screen Patterns

All screens follow the same pattern:

```typescript
import { Header, Button, ... } from '../../../shared/components/sketchy';
import { useFestipodData } from '../../../shared/context/FestipodDataContext';
import type { ScreenProps } from '../../../screens';

export function MyScreen({ navigate }: ScreenProps) {
  const { events, currentUser, ... } = useFestipodData();
  // render with sketchy components
}
```

Navigation between screens uses `navigate(screenId)` — the prototyping tool intercepts this to switch the displayed screen.
