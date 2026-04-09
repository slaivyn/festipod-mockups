import React, { useState } from 'react';
import { Header, Text, Avatar, Input, Button, Badge, NavBar } from '../components/sketchy';
import type { ScreenProps } from './index';

export function FriendsListScreen({ navigate }: ScreenProps) {
  const [activeTab, setActiveTab] = useState<'friends' | 'public'>('friends');

  const friends = [
    { name: 'Jean Durand', color: '#2B6CB0', username: '@jeandurand', events: 5 },
    { name: 'Alice Martin', color: '#9C4DC7', username: '@alice', events: 12 },
    { name: 'Baptiste Morel', color: '#38A169', username: '@baptiste', events: 3 },
    { name: 'Camille Dubois', color: '#D69E2E', username: '@camille', events: 8 },
    { name: 'David Leroy', color: '#E53E3E', username: '@david', events: 2 },
    { name: 'Emma Girard', color: '#E8590C', username: '@emma', events: 7 },
  ];

  const publicProfiles = [
    { name: 'Léa Bernard', color: '#9C4DC7', username: '@leabernard', events: 45, role: 'Relayeuse' },
    { name: 'Marc Richard', color: '#2B6CB0', username: '@marcrichard', events: 67, role: 'Animateur' },
    { name: 'Sophie Fontaine', color: '#38A169', username: '@sophief', events: 23, role: 'Créatrice' },
    { name: 'Pierre Gagnon', color: '#D69E2E', username: '@pierreg', events: 89, role: 'Relayeur' },
  ];

  const displayedList = activeTab === 'friends' ? friends : publicProfiles;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Mon réseau"
        left={<span onClick={() => navigate('home')} style={{ cursor: 'pointer', fontSize: 18 }}>‹</span>}
      />

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid #f0f0f0' }}>
        <button
          onClick={() => setActiveTab('friends')}
          className={`app-tab ${activeTab === 'friends' ? 'active' : ''}`}
        >
          Mes amis ({friends.length})
        </button>
        <button
          onClick={() => setActiveTab('public')}
          className={`app-tab ${activeTab === 'public' ? 'active' : ''}`}
        >
          Profils publics
        </button>
      </div>

      <div style={{ padding: 16, borderBottom: '1px solid #f0f0f0' }}>
        <Input placeholder="Rechercher..." />
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {displayedList.map((person, i) => (
          <div
            key={i}
            onClick={() => navigate('user-profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              cursor: 'pointer',
              borderBottom: '1px solid #f5f5f5',
            }}
          >
            <Avatar name={person.name} color={person.color} size="sm" />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Text style={{ margin: 0, fontWeight: 'bold' }}>{person.name}</Text>
                {'role' in person && <Badge>{(person as any).role}</Badge>}
              </div>
              <Text style={{ margin: 0, fontSize: 13, color: '#888' }}>
                {person.username} · {person.events} événements
              </Text>
            </div>
            <Text style={{ margin: 0, fontSize: 20, color: '#ccc' }}>›</Text>
          </div>
        ))}
      </div>

      {activeTab === 'friends' && (
        <div style={{ padding: 16, borderTop: '1px solid #f0f0f0' }}>
          <Button variant="primary" style={{ width: '100%' }}>
            + Ajouter un ami
          </Button>
        </div>
      )}

      <NavBar
        items={[
          { icon: '◎', label: 'Événements', onClick: () => navigate('home') },
          { icon: '⬡', label: 'Réseau', active: true },
          { icon: '◉', label: 'En direct', onClick: () => navigate('live') },
          { icon: '○', label: 'Profil', onClick: () => navigate('profile') },
        ]}
      />
    </div>
  );
}
