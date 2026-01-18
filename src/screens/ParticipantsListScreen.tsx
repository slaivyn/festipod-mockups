import React from 'react';
import { Header, Avatar, Text, Input, Divider } from '../components/sketchy';
import type { ScreenProps } from './index';

export function ParticipantsListScreen({ navigate }: ScreenProps) {
  const participants = [
    { initials: 'AM', name: 'Alice Martin', username: '@alice' },
    { initials: 'BM', name: 'Baptiste Morel', username: '@baptiste' },
    { initials: 'CD', name: 'Camille Dubois', username: '@camille' },
    { initials: 'DL', name: 'David Leroy', username: '@david' },
    { initials: 'EG', name: 'Emma Girard', username: '@emma' },
    { initials: 'FB', name: 'François Bernard', username: '@francois' },
    { initials: 'GM', name: 'Guillaume Mercier', username: '@guillaume' },
    { initials: 'HT', name: 'Hélène Thomas', username: '@helene' },
    { initials: 'MD', name: 'Marie Dupont', username: '@mariedupont' },
    { initials: 'PD', name: 'Pierre Durand', username: '@pierre' },
    { initials: 'SL', name: 'Sophie Lambert', username: '@sophie' },
    { initials: 'TM', name: 'Thomas Martin', username: '@thomas' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Participants (12)"
        left={<span onClick={() => navigate('event-detail')} style={{ cursor: 'pointer' }}>←</span>}
      />

      {/* Search bar */}
      <div style={{ padding: 16, borderBottom: '1px solid var(--sketch-light-gray)' }}>
        <Input placeholder="Rechercher un participant..." />
      </div>

      {/* Participants list */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {participants.map((p, i) => (
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
            <Avatar initials={p.initials} size="sm" />
            <div style={{ flex: 1 }}>
              <Text className="user-content" style={{ margin: 0, fontWeight: 'bold' }}>{p.name}</Text>
              <Text className="user-content" style={{ margin: 0, fontSize: 13 }}>
                {p.username}
              </Text>
            </div>
            <Text style={{ margin: 0, fontSize: 20, color: 'var(--sketch-gray)' }}>›</Text>
          </div>
        ))}
      </div>
    </div>
  );
}
