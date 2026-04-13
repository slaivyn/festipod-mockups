import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Header, Text, ListItem, Toggle, Divider, NavBar } from '../components/sketchy';
import type { ScreenProps } from './index';

export function SettingsScreen({ navigate }: ScreenProps) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [location, setLocation] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Paramètres"
        left={<ArrowLeft size={20} onClick={() => navigate('profile')} style={{ cursor: 'pointer' }} />}
      />

      <div style={{ flex: 1, overflow: 'auto' }}>
        <Text style={{ padding: '16px 16px 8px', fontSize: 12, color: '#999', margin: 0, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>
          Préférences
        </Text>

        <ListItem>
          <div style={{ flex: 1 }}>
            <Text style={{ margin: 0 }}>Notifications</Text>
            <Text style={{ margin: 0, fontSize: 12, color: '#888' }}>
              Recevoir les invitations par e-mail
            </Text>
          </div>
          <Toggle checked={notifications} onChange={setNotifications} />
        </ListItem>

        <ListItem>
          <div style={{ flex: 1 }}>
            <Text style={{ margin: 0 }}>Mode sombre</Text>
            <Text style={{ margin: 0, fontSize: 12, color: '#888' }}>
              Activer le thème sombre
            </Text>
          </div>
          <Toggle checked={darkMode} onChange={setDarkMode} />
        </ListItem>

        <ListItem>
          <div style={{ flex: 1 }}>
            <Text style={{ margin: 0 }}>Localisation</Text>
            <Text style={{ margin: 0, fontSize: 12, color: '#888' }}>
              Autoriser l'accès à la position
            </Text>
          </div>
          <Toggle checked={location} onChange={setLocation} />
        </ListItem>

        <Divider />

        <Text style={{ padding: '16px 16px 8px', fontSize: 12, color: '#999', margin: 0, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>
          Compte
        </Text>

        <ListItem onClick={() => navigate('profile')}>
          <Text style={{ margin: 0, flex: 1 }}>Modifier le profil</Text>
          <span style={{ color: '#ccc' }}>›</span>
        </ListItem>

        <ListItem>
          <Text style={{ margin: 0, flex: 1 }}>Changer le mot de passe</Text>
          <span style={{ color: '#ccc' }}>›</span>
        </ListItem>

        <ListItem>
          <Text style={{ margin: 0, flex: 1 }}>Confidentialité</Text>
          <span style={{ color: '#ccc' }}>›</span>
        </ListItem>

        <Divider />

        <ListItem onClick={() => navigate('login')}>
          <Text style={{ margin: 0, color: '#E53E3E' }}>Se déconnecter</Text>
        </ListItem>
      </div>

      <NavBar
        items={[
          { icon: '◎', label: 'Événements', onClick: () => navigate('home') },
          { icon: '⬡', label: 'Réseau', onClick: () => navigate('friends-list') },
          { icon: '◉', label: 'En direct', onClick: () => navigate('live') },
          { icon: '○', label: 'Profil', onClick: () => navigate('profile') },
        ]}
      />
    </div>
  );
}
