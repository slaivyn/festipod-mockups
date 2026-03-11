import React, { useState } from 'react';
import { Header, Text, Avatar, Input, Button, Badge } from '../../../shared/components/sketchy';
import { useFestipodData } from '../../../shared/context/FestipodDataContext';
import type { ScreenProps } from '../../../screens';

export function FriendsListScreen({ navigate }: ScreenProps) {
  const { getFriends, users, setSelectedUserId } = useFestipodData();
  const [activeTab, setActiveTab] = useState<'friends' | 'public'>('friends');

  const friends = getFriends();
  const publicProfiles = users.filter(u => u.isPublic);

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
        {displayedList.map((person) => (
          <div
            key={person.id}
            onClick={() => { setSelectedUserId(person.id); navigate('user-profile'); }}
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
                {person.role && <Badge>{person.role}</Badge>}
              </div>
              <Text style={{ margin: 0, fontSize: 13 }}>
                <span className="user-content">{person.username}</span>
                {person.eventsCount != null && (
                  <span style={{ color: 'var(--sketch-gray)' }}> · {person.eventsCount} événements</span>
                )}
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
