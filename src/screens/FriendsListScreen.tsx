import React, { useState } from 'react';
import { Header, Text, Avatar, Input, Button, Badge } from '../components/sketchy';
import type { ScreenProps } from './index';

export function FriendsListScreen({ navigate }: ScreenProps) {
  const [activeTab, setActiveTab] = useState<'friends' | 'public'>('friends');

  const friends = [
    { initials: 'JD', name: 'Jean Durand', username: '@jeandurand', events: 5, mutual: true },
    { initials: 'AM', name: 'Alice Martin', username: '@alice', events: 12, mutual: true },
    { initials: 'BM', name: 'Baptiste Morel', username: '@baptiste', events: 3, mutual: true },
    { initials: 'CD', name: 'Camille Dubois', username: '@camille', events: 8, mutual: true },
    { initials: 'DL', name: 'David Leroy', username: '@david', events: 2, mutual: true },
    { initials: 'EG', name: 'Emma Girard', username: '@emma', events: 7, mutual: true },
  ];

  const publicProfiles = [
    { initials: 'LB', name: 'Léa Bernard', username: '@leabernard', events: 45, role: 'Organisatrice' },
    { initials: 'MR', name: 'Marc Richard', username: '@marcrichard', events: 67, role: 'Animateur' },
    { initials: 'SF', name: 'Sophie Fontaine', username: '@sophief', events: 23, role: 'Créatrice' },
    { initials: 'PG', name: 'Pierre Gagnon', username: '@pierreg', events: 89, role: 'Organisateur' },
  ];

  const displayedList = activeTab === 'friends' ? friends : publicProfiles;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Mon réseau"
        left={<span onClick={() => navigate('profile')} style={{ cursor: 'pointer' }}>←</span>}
      />

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--sketch-black)' }}>
        <button
          onClick={() => setActiveTab('friends')}
          style={{
            flex: 1,
            padding: '12px 16px',
            background: activeTab === 'friends' ? 'var(--sketch-light-gray)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'friends' ? '3px solid var(--sketch-black)' : '3px solid transparent',
            fontFamily: 'var(--font-sketch)',
            fontSize: 14,
            fontWeight: activeTab === 'friends' ? 'bold' : 'normal',
            cursor: 'pointer',
          }}
        >
          Mes amis ({friends.length})
        </button>
        <button
          onClick={() => setActiveTab('public')}
          style={{
            flex: 1,
            padding: '12px 16px',
            background: activeTab === 'public' ? 'var(--sketch-light-gray)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'public' ? '3px solid var(--sketch-black)' : '3px solid transparent',
            fontFamily: 'var(--font-sketch)',
            fontSize: 14,
            fontWeight: activeTab === 'public' ? 'bold' : 'normal',
            cursor: 'pointer',
          }}
        >
          Profils publics
        </button>
      </div>

      {/* Search bar */}
      <div style={{ padding: 16, borderBottom: '1px solid var(--sketch-light-gray)' }}>
        <Input placeholder="Rechercher..." />
      </div>

      {/* List */}
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
              borderBottom: '1px solid var(--sketch-light-gray)',
            }}
          >
            <Avatar initials={person.initials} size="sm" />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Text className="user-content" style={{ margin: 0, fontWeight: 'bold' }}>{person.name}</Text>
                {'role' in person && (
                  <Badge>{person.role}</Badge>
                )}
              </div>
              <Text style={{ margin: 0, fontSize: 13 }}>
                <span className="user-content">{person.username}</span>
                <span style={{ color: 'var(--sketch-gray)' }}> · {person.events} événements</span>
              </Text>
            </div>
            <Text style={{ margin: 0, fontSize: 20, color: 'var(--sketch-gray)' }}>›</Text>
          </div>
        ))}
      </div>

      {/* Add friend button */}
      {activeTab === 'friends' && (
        <div style={{ padding: 16, borderTop: '2px solid var(--sketch-black)' }}>
          <Button variant="primary" style={{ width: '100%' }}>
            + Ajouter un ami
          </Button>
        </div>
      )}
    </div>
  );
}
