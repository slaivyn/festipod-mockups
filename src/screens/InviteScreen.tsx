import React, { useState } from 'react';
import { Header, Input, Text, Avatar, Checkbox, Button } from '../components/sketchy';
import type { ScreenProps } from './index';

interface Friend {
  id: string;
  name: string;
  color: string;
  username: string;
}

const friends: Friend[] = [
  { id: '1', name: 'Alice Martin', color: '#9C4DC7', username: '@alice' },
  { id: '2', name: 'Baptiste Morel', color: '#38A169', username: '@baptiste' },
  { id: '3', name: 'Camille Dubois', color: '#D69E2E', username: '@camille' },
  { id: '4', name: 'David Leroy', color: '#E53E3E', username: '@david' },
  { id: '5', name: 'Emma Bernard', color: '#2B6CB0', username: '@emma' },
  { id: '6', name: 'François Petit', color: '#E8590C', username: '@francois' },
];

export function InviteScreen({ navigate }: ScreenProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleFriend = (id: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Inviter des amis"
        left={<span onClick={() => navigate('event-detail')} style={{ cursor: 'pointer', fontSize: 18 }}>‹</span>}
      />

      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <Input placeholder="Rechercher un ami..." />
      </div>

      {selected.size > 0 && (
        <div style={{
          padding: '8px 16px',
          background: '#FFF7ED',
          fontSize: 14,
          color: '#C05621',
          fontWeight: 600,
        }}>
          {selected.size} ami{selected.size > 1 ? 's' : ''} sélectionné{selected.size > 1 ? 's' : ''}
        </div>
      )}

      <div style={{ flex: 1, overflow: 'auto' }}>
        {friends.map((friend) => (
          <div
            key={friend.id}
            onClick={() => toggleFriend(friend.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              borderBottom: '1px solid #f5f5f5',
              cursor: 'pointer',
              background: selected.has(friend.id) ? '#FFF7ED' : 'transparent',
            }}
          >
            <Avatar name={friend.name} color={friend.color} size="sm" />
            <div style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ margin: 0, fontWeight: 'bold' }}>{friend.name}</Text>
              <Text style={{ margin: 0, fontSize: 13, color: '#888' }}>{friend.username}</Text>
            </div>
            <Checkbox checked={selected.has(friend.id)} />
          </div>
        ))}
      </div>

      <div style={{ padding: 16, borderTop: '1px solid #f0f0f0' }}>
        <Button
          variant="primary"
          style={{ width: '100%' }}
          onClick={() => navigate('event-detail')}
          disabled={selected.size === 0}
        >
          Envoyer {selected.size > 0 ? `${selected.size} ` : ''}invitation{selected.size !== 1 ? 's' : ''}
        </Button>
      </div>
    </div>
  );
}
