import { RouterProvider, useRouter } from './router';
import { ThemeProvider } from '../shared/context/ThemeContext';
import { NextGraphProvider } from '../shared/context/NextGraphContext';
import { FestipodDataProvider } from '../shared/context/FestipodDataContext';
import { ToastContainer } from '../shared/components/sketchy';

// Auth
import { WelcomeScreen } from '../modules/auth/screens/WelcomeScreen';
import { LoginScreen } from '../modules/auth/screens/LoginScreen';

// Home
import { HomeScreen } from '../modules/home/screens/HomeScreen';
import { SettingsScreen } from '../modules/home/screens/SettingsScreen';

// Event
import { EventsScreen } from '../modules/event/screens/EventsScreen';
import { EventDetailScreen } from '../modules/event/screens/EventDetailScreen';
import { CreateEventScreen } from '../modules/event/screens/CreateEventScreen';
import { UpdateEventScreen } from '../modules/event/screens/UpdateEventScreen';
import { InviteScreen } from '../modules/event/screens/InviteScreen';
import { ParticipantsListScreen } from '../modules/event/screens/ParticipantsListScreen';
import { MeetingPointsScreen } from '../modules/event/screens/MeetingPointsScreen';

// User
import { ProfileScreen } from '../modules/user/screens/ProfileScreen';
import { UpdateProfileScreen } from '../modules/user/screens/UpdateProfileScreen';
import { UserProfileScreen } from '../modules/user/screens/UserProfileScreen';
import { FriendsListScreen } from '../modules/user/screens/FriendsListScreen';
import { ShareProfileScreen } from '../modules/user/screens/ShareProfileScreen';
import { ConnectScreen } from '../modules/user/screens/ConnectScreen';

function AppContent() {
  const { route } = useRouter();

  switch (route.page) {
    case 'welcome': return <WelcomeScreen />;
    case 'login': return <LoginScreen />;
    case 'home': return <HomeScreen />;
    case 'events': return <EventsScreen />;
    case 'create-event': return <CreateEventScreen />;
    case 'event-detail': return <EventDetailScreen />;
    case 'update-event': return <UpdateEventScreen />;
    case 'invite': return <InviteScreen />;
    case 'participants': return <ParticipantsListScreen />;
    case 'meeting-points': return <MeetingPointsScreen />;
    case 'profile': return <ProfileScreen />;
    case 'edit-profile': return <UpdateProfileScreen />;
    case 'friends': return <FriendsListScreen />;
    case 'share-profile': return <ShareProfileScreen />;
    case 'connect': return <ConnectScreen />;
    case 'user-profile': return <UserProfileScreen />;
    case 'settings': return <SettingsScreen />;
  }
}

export function App() {
  return (
    <ThemeProvider>
      <NextGraphProvider>
        <FestipodDataProvider>
          <RouterProvider>
            <div className="app-container">
              <AppContent />
              <ToastContainer />
            </div>
          </RouterProvider>
        </FestipodDataProvider>
      </NextGraphProvider>
    </ThemeProvider>
  );
}

export default App;
