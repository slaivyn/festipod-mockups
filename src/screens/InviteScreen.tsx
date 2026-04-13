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
  const [step, setStep] = useState<'select' | 'message'>('select');
  const [message, setMessage] = useState('');

  const toggleFriend = (id: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const selectedFriends = friends.filter((f) => selected.has(f.id));

  if (step === 'message') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Header
          title="Ajouter un message"
          left={<span onClick={() => setStep('select')} style={{ cursor: 'pointer', fontSize: 18 }}>‹</span>}
        />

        <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
          <div style={{ marginBottom: 16 }}>
            <Text style={{ margin: '0 0 8px', fontSize: 13, color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>
              Invitations pour
            </Text>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {selectedFriends.map((friend) => (
                <div
                  key={friend.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: '#FFF7ED',
                    border: '1.5px solid #FBD38D',
                    borderRadius: 20,
                    padding: '4px 10px',
                  }}
                >
                  <Avatar name={friend.name} color={friend.color} size={22} />
                  <Text style={{ margin: 0, fontSize: 13, color: '#C05621', fontWeight: 600 }}>
                    {friend.name.split(' ')[0]}
                  </Text>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 8 }}>
            <Text style={{ margin: '0 0 8px', fontSize: 13, color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>
              Message <span style={{ fontWeight: 400, fontSize: 12 }}>(optionnel)</span>
            </Text>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ajouter un message personnalisé à votre invitation..."
              rows={5}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: 15,
                fontFamily: 'inherit',
                border: '2px solid #e2e8f0',
                borderRadius: 8,
                resize: 'none',
                outline: 'none',
                boxSizing: 'border-box',
                color: '#2d3748',
                lineHeight: 1.5,
              }}
            />
          </div>
        </div>

        <div style={{ padding: 16, borderTop: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Button
            variant="primary"
            style={{ width: '100%' }}
            onClick={() => navigate('event-detail')}
          >
            Envoyer {selected.size} invitation{selected.size !== 1 ? 's' : ''}
          </Button>
          {message.trim() === '' && (
            <button
              onClick={() => navigate('event-detail')}
              style={{
                background: 'none',
                border: 'none',
                color: '#888',
                fontSize: 14,
                cursor: 'pointer',
                textAlign: 'center',
                padding: '4px 0',
              }}
            >
              Envoyer sans message
            </button>
          )}
        </div>
      </div>
    );
  }

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
          onClick={() => setStep('message')}
          disabled={selected.size === 0}
        >
          Suivant →
        </Button>
      </div>
    </div>
  );
}
