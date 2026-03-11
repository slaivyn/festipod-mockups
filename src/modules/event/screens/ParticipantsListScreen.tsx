import React from 'react';
import { Header, Avatar, Text, Input } from '../../../shared/components/sketchy';
import { useFestipodData } from '../../../shared/context/FestipodDataContext';
import type { ScreenProps } from '../../../screens';

export function ParticipantsListScreen({ navigate }: ScreenProps) {
  const { selectedEvent, selectedEventId, getEventParticipants, getFriends, setSelectedUserId } = useFestipodData();
  const participants = getEventParticipants(selectedEventId);
  const friends = getFriends();
  const friendIds = new Set(friends.map(f => f.id));

  const totalCount = selectedEvent?.participantCount ?? participants.length;
  const unknownCount = Math.max(0, totalCount - participants.length);

  // Build participant list: known participants + unknown placeholders
  const participantRows = [
    ...participants.map(p => ({
      key: p.id,
      initials: p.initials,
      name: p.name,
      username: p.username,
      known: true,
      isFriend: friendIds.has(p.id),
    })),
    ...Array.from({ length: unknownCount }, (_, i) => ({
      key: `unknown-${i}`,
      initials: '?',
      name: '',
      username: '',
      known: false,
      isFriend: false,
    })),
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title={`Participants (${totalCount})`}
        left={<span onClick={() => navigate('event-detail')} style={{ cursor: 'pointer' }}>←</span>}
      />

      {/* Search bar */}
      <div style={{ padding: 16, borderBottom: '1px solid var(--sketch-light-gray)' }}>
        <Input placeholder="Rechercher un participant..." />
      </div>

      {/* Participants list */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {participantRows.map((p) => (
          <div
            key={p.key}
            onClick={p.known ? () => { setSelectedUserId(p.key); navigate('user-profile'); } : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              cursor: p.known ? 'pointer' : 'default',
              borderBottom: '1px solid var(--sketch-light-gray)',
            }}
          >
            <Avatar initials={p.initials} size="sm" />
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
