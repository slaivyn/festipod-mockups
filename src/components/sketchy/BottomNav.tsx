import { NavBar } from './NavBar';

type ActiveTab = 'home' | 'friends' | 'discover' | 'profile';

interface BottomNavProps {
  active: ActiveTab;
  navigate: (screenId: string) => void;
}

export function BottomNav({ active, navigate }: BottomNavProps) {
  return (
    <NavBar
      items={[
        { icon: '◎', label: 'Accueil', active: active === 'home', onClick: () => navigate('home') },
        { icon: '⬡', label: 'Réseau', active: active === 'friends', onClick: () => navigate('friends-list') },
        { icon: '✧', label: 'Découvrir', active: active === 'discover', onClick: () => navigate('events') },
        { icon: '○', label: 'Profil', active: active === 'profile', onClick: () => navigate('profile') },
      ]}
    />
  );
}
