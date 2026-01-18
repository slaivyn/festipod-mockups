import React, { useState } from 'react';
import { Header, Input, Text, Avatar, Checkbox, Button } from '../components/sketchy';
import type { ScreenProps } from './index';

interface Friend {
  id: string;
  name: string;
  initials: string;
  username: string;
}

const friends: Friend[] = [
  { id: '1', name: 'Alice Martin', initials: 'AM', username: '@alice' },
  { id: '2', name: 'Baptiste Morel', initials: 'BM', username: '@baptiste' },
  { id: '3', name: 'Camille Dubois', initials: 'CD', username: '@camille' },
  { id: '4', name: 'David Leroy', initials: 'DL', username: '@david' },
  { id: '5', name: 'Emma Bernard', initials: 'EB', username: '@emma' },
  { id: '6', name: 'François Petit', initials: 'FP', username: '@francois' },
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
        left={<span onClick={() => navigate('event-detail')} style={{ cursor: 'pointer' }}>←</span>}
      />

      {/* Search */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--sketch-light-gray)' }}>
        <Input placeholder="Rechercher un ami..." />
      </div>

      {/* Selected count */}
      {selected.size > 0 && (
        <div style={{
          padding: '8px 16px',
          background: 'var(--sketch-light-gray)',
          fontSize: 14,
          fontFamily: 'var(--font-sketch)',
        }}>
          {selected.size} ami{selected.size > 1 ? 's' : ''} sélectionné{selected.size > 1 ? 's' : ''}
        </div>
      )}

      {/* Friends list */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {friends.map((friend) => (
          <div
            key={friend.id}
            onClick={() => toggleFriend(friend.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              borderBottom: '1px solid var(--sketch-light-gray)',
              cursor: 'pointer',
              background: selected.has(friend.id) ? 'var(--sketch-light-gray)' : 'transparent',
            }}
          >
            <Avatar initials={friend.initials} size="sm" />
            <div style={{ flex: 1, marginLeft: 12 }}>
              <Text className="user-content" style={{ margin: 0, fontWeight: 'bold' }}>{friend.name}</Text>
              <Text className="user-content" style={{ margin: 0, fontSize: 14 }}>
                {friend.username}
              </Text>
            </div>
            <Checkbox checked={selected.has(friend.id)} />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: 16, borderTop: '2px solid var(--sketch-black)' }}>
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
