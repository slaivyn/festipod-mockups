import { ArrowLeft } from 'lucide-react';
import { Header, Text, Avatar, Input, Button, BottomNav } from '../../../shared/components/sketchy';
import { useFestipodData } from '../../../shared/context/FestipodDataContext';
import { useNavigate } from '../../../app/router';

const COLORS = ['#2B6CB0', '#9C4DC7', '#38A169', '#D69E2E', '#E53E3E', '#E8590C'];

export function FriendsListScreen() {
  const navigate = useNavigate();
  const { getFriends } = useFestipodData();
  const friends = getFriends();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title={`Mon réseau (${friends.length})`}
        left={<ArrowLeft size={20} onClick={() => navigate('/home')} style={{ cursor: 'pointer' }} />}
      />

      <div style={{ padding: 16, borderBottom: '1px solid #f0f0f0' }}>
        <Input placeholder="Rechercher..." />
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {friends.map((person, i) => (
          <div
            key={person.id}
            onClick={() => navigate(`/users/${person.id}`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              cursor: 'pointer',
              borderBottom: '1px solid #f5f5f5',
            }}
          >
            <Avatar initials={person.initials} color={COLORS[i % COLORS.length]} size="sm" />
            <div style={{ flex: 1 }}>
              <Text className="user-content" style={{ margin: 0, fontWeight: 'bold' }}>{person.name}</Text>
              <Text style={{ margin: 0, fontSize: 13, color: '#888' }}>
                <span className="user-content">{person.username}</span>
                {person.eventsCount != null && ` · ${person.eventsCount} événements`}
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
          onClick={() => navigate('/profile/connect')}
        >
          Se connecter
        </Button>
      </div>

      <BottomNav active="friends" />
    </div>
  );
}
