import { NavBar } from './NavBar';
import { useNavigate, useRouter } from '../../../app/router';

type ActiveTab = 'home' | 'friends' | 'discover' | 'profile';

interface BottomNavProps {
  active?: ActiveTab;
}

function deriveActive(page: string): ActiveTab | undefined {
  if (page === 'home') return 'home';
  if (page === 'friends') return 'friends';
  if (page === 'events' || page === 'event-detail' || page === 'create-event') return 'discover';
  if (page === 'profile' || page === 'edit-profile' || page === 'share-profile') return 'profile';
  return undefined;
}

export function BottomNav({ active }: BottomNavProps) {
  const navigate = useNavigate();
  const { route } = useRouter();
  const current = active ?? deriveActive(route.page);

  return (
    <NavBar
      items={[
        { icon: '◎', label: 'Accueil', active: current === 'home', onClick: () => navigate('/home') },
        { icon: '⬡', label: 'Réseau', active: current === 'friends', onClick: () => navigate('/profile/friends') },
        { icon: '✧', label: 'Découvrir', active: current === 'discover', onClick: () => navigate('/events') },
        { icon: '○', label: 'Profil', active: current === 'profile', onClick: () => navigate('/profile') },
      ]}
    />
  );
}
