import { ArrowLeft } from 'lucide-react';
import { Header, Text, Avatar, Input, Button, BottomNav } from '../components/sketchy';
import type { ScreenProps } from './index';

export function FriendsListScreen({ navigate }: ScreenProps) {
  const friends = [
    { name: 'Jean Durand', color: '#2B6CB0', username: '@jeandurand', events: 5 },
    { name: 'Alice Martin', color: '#9C4DC7', username: '@alice', events: 12 },
    { name: 'Baptiste Morel', color: '#38A169', username: '@baptiste', events: 3 },
    { name: 'Camille Dubois', color: '#D69E2E', username: '@camille', events: 8 },
    { name: 'David Leroy', color: '#E53E3E', username: '@david', events: 2 },
    { name: 'Emma Girard', color: '#E8590C', username: '@emma', events: 7 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title={`Mon réseau (${friends.length})`}
        left={<ArrowLeft size={20} onClick={() => navigate('home')} style={{ cursor: 'pointer' }} />}
      />

      <div style={{ padding: 16, borderBottom: '1px solid #f0f0f0' }}>
        <Input placeholder="Rechercher..." />
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {friends.map((person, i) => (
          <div
            key={i}
            onClick={() => navigate('user-profile', { from: 'friends-list' })}
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
              <Text style={{ margin: 0, fontWeight: 'bold' }}>{person.name}</Text>
              <Text style={{ margin: 0, fontSize: 13, color: '#888' }}>
                {person.username} · {person.events} événements
              </Text>
            </div>
            <Text style={{ margin: 0, fontSize: 20, color: '#ccc' }}>›</Text>
          </div>
        ))}
      </div>

      <div style={{ padding: 16, borderTop: '1px solid #f0f0f0' }}>
        <Button
          variant="primary"
          style={{ width: '100%' }}
          onClick={() => navigate('connect', { from: 'friends-list' })}
        >
          Se connecter
        </Button>
      </div>

      <BottomNav active="friends" navigate={navigate} />
    </div>
  );
}
