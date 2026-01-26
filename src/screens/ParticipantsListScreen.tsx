import React from 'react';
import { Header, Avatar, Text, Input, Divider } from '../components/sketchy';
import type { ScreenProps } from './index';

export function ParticipantsListScreen({ navigate }: ScreenProps) {
  const participants = [
    { initials: 'MD', name: 'Marie Dupont', username: '@mariedupont', known: true },
    { initials: 'TM', name: 'Thomas Martin', username: '@thomas', known: true },
    { known: false },
    { known: false },
    { known: false },
    { known: false },
    { known: false },
    { known: false },
    { known: false },
    { known: false },
    { known: false },
    { known: false },
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
            onClick={p.known ? () => navigate('user-profile') : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              cursor: p.known ? 'pointer' : 'default',
              borderBottom: '1px solid var(--sketch-light-gray)',
            }}
          >
            <Avatar initials={p.known ? p.initials : '?'} size="sm" />
            <div style={{ flex: 1 }}>
              {p.known ? (
                <>
                  <Text className="user-content" style={{ margin: 0, fontWeight: 'bold' }}>{p.name}</Text>
                  <Text className="user-content" style={{ margin: 0, fontSize: 13 }}>
                    {p.username}
                  </Text>
                </>
              ) : (
                <Text style={{ margin: 0, color: 'var(--sketch-gray)' }}>Participant inconnu</Text>
              )}
            </div>
            {p.known && <Text style={{ margin: 0, fontSize: 20, color: 'var(--sketch-gray)' }}>›</Text>}
          </div>
        ))}
      </div>
    </div>
  );
}
