import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Header, Avatar, Text, Input } from '../components/sketchy';
import type { ScreenProps } from './index';

export function ParticipantsListScreen({ navigate }: ScreenProps) {
  const participants = [
    { name: 'Marie Dupont', color: '#E8590C', username: '@mariedupont', known: true },
    { name: 'Thomas Martin', color: '#2B6CB0', username: '@thomas', known: true },
    ...Array(10).fill({ known: false }),
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Participants (12)"
        left={<ArrowLeft size={20} onClick={() => navigate('event-detail')} style={{ cursor: 'pointer' }} />}
      />

      <div style={{ padding: 16, borderBottom: '1px solid #f0f0f0' }}>
        <Input placeholder="Rechercher un participant..." />
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {participants.map((p, i) => (
          <div
            key={i}
            onClick={p.known ? () => navigate('user-profile', { from: 'participants-list' }) : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              cursor: p.known ? 'pointer' : 'default',
              borderBottom: '1px solid #f5f5f5',
            }}
          >
            <Avatar
              name={p.known ? p.name : '?'}
              color={p.known ? (p as any).color : '#ccc'}
              size="sm"
            />
            <div style={{ flex: 1 }}>
              {p.known ? (
                <>
                  <Text style={{ margin: 0, fontWeight: 'bold' }}>{(p as any).name}</Text>
                  <Text style={{ margin: 0, fontSize: 13, color: '#888' }}>{(p as any).username}</Text>
                </>
              ) : (
                <Text style={{ margin: 0, color: '#999' }}>Participant inconnu</Text>
              )}
            </div>
            {p.known && <Text style={{ margin: 0, fontSize: 20, color: '#ccc' }}>›</Text>}
          </div>
        ))}
      </div>
    </div>
  );
}
