import React, { useState } from 'react';
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
        left={<span onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>←</span>}
      />

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Text style={{ padding: '16px 16px 8px', fontSize: 14, color: 'var(--sketch-gray)', margin: 0 }}>
          PRÉFÉRENCES
        </Text>

        <ListItem>
          <div style={{ flex: 1 }}>
            <Text style={{ margin: 0 }}>Notifications</Text>
            <Text style={{ margin: 0, fontSize: 12, color: 'var(--sketch-gray)' }}>
              Recevoir les notifications push
            </Text>
          </div>
          <Toggle checked={notifications} onChange={setNotifications} />
        </ListItem>

        <ListItem>
          <div style={{ flex: 1 }}>
            <Text style={{ margin: 0 }}>Mode sombre</Text>
            <Text style={{ margin: 0, fontSize: 12, color: 'var(--sketch-gray)' }}>
              Activer le thème sombre
            </Text>
          </div>
          <Toggle checked={darkMode} onChange={setDarkMode} />
        </ListItem>

        <ListItem>
          <div style={{ flex: 1 }}>
            <Text style={{ margin: 0 }}>Localisation</Text>
            <Text style={{ margin: 0, fontSize: 12, color: 'var(--sketch-gray)' }}>
              Autoriser l'accès à la position
            </Text>
          </div>
          <Toggle checked={location} onChange={setLocation} />
        </ListItem>

        <Divider />

        <Text style={{ padding: '16px 16px 8px', fontSize: 14, color: 'var(--sketch-gray)', margin: 0 }}>
          COMPTE
        </Text>

        <ListItem onClick={() => navigate('profile')}>
          <Text style={{ margin: 0, flex: 1 }}>Modifier le profil</Text>
          <span>→</span>
        </ListItem>

        <ListItem>
          <Text style={{ margin: 0, flex: 1 }}>Changer le mot de passe</Text>
          <span>→</span>
        </ListItem>

        <ListItem>
          <Text style={{ margin: 0, flex: 1 }}>Confidentialité</Text>
          <span>→</span>
        </ListItem>

        <Divider />

        <ListItem onClick={() => navigate('login')}>
          <Text style={{ margin: 0, color: '#c00' }}>Se déconnecter</Text>
        </ListItem>
      </div>

      {/* Bottom Nav */}
      <NavBar
        items={[
          { icon: '⌂', label: 'Accueil', onClick: () => navigate('home') },
          { icon: '◎', label: 'Découvrir', onClick: () => navigate('events') },
          { icon: '+', label: 'Relayer', onClick: () => navigate('create-event') },
          { icon: '☺', label: 'Profil', onClick: () => navigate('profile') },
        ]}
      />
    </div>
  );
}
