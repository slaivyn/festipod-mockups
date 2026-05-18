import { Header, Avatar, Title, Text, Button, Card, Divider, BottomNav, Tag } from '../../../shared/components/sketchy';
import { useFestipodData } from '../../../shared/context/FestipodDataContext';
import { useNavigate } from '../../../app/router';

export function ProfileScreen() {
  const navigate = useNavigate();
  const { currentUser, getUserEvents, currentUserId, getFriends } = useFestipodData();
  const myEvents = getUserEvents(currentUserId);
  const friends = getFriends();
  const user = currentUser;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Mon profil"
        right={<span onClick={() => navigate('/settings')} style={{ cursor: 'pointer', fontSize: 18 }}>⚙</span>}
      />

      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ padding: 24, textAlign: 'center' }}>
          <Avatar initials={user?.initials ?? '?'} color="#E8590C" size="lg" />
          <Title className="user-content" style={{ marginTop: 16, marginBottom: 4 }}>{user?.name}</Title>
          <Text className="user-content" style={{ margin: 0, color: '#888' }}>{user?.username}</Text>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 20 }}>
            <div style={{ textAlign: 'center' }}>
              <Text style={{ fontWeight: 'bold', margin: 0 }}>{user?.eventsCount ?? myEvents.length}</Text>
              <Text style={{ fontSize: 12, color: '#888', margin: 0 }}>Événements</Text>
            </div>
            <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('/profile/friends')}>
              <Text style={{ fontWeight: 'bold', margin: 0 }}>{user?.friendsCount ?? friends.length}</Text>
              <Text style={{ fontSize: 12, color: '#888', margin: 0 }}>Amis</Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Text style={{ fontWeight: 'bold', margin: 0 }}>{user?.participationsCount ?? 0}</Text>
              <Text style={{ fontSize: 12, color: '#888', margin: 0 }}>Participations</Text>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'center' }}>
            <Button variant="primary" onClick={() => navigate('/profile/edit')}>Modifier le profil</Button>
            <Button onClick={() => navigate('/profile/share')}>Partager</Button>
          </div>
        </div>

        <Divider />

        <div style={{
          margin: '12px 16px',
          padding: '14px 16px',
          background: 'linear-gradient(135deg, #FFF7ED, #FFFBF5)',
          borderRadius: 16,
          border: '1px solid #FDDCB5',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#C05621', marginBottom: 8 }}>
            Mes intentions
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            <Tag label="gouvernance coopérative" />
            <Tag label="communs numériques" />
            <Tag label="habitat participatif" color="#4a3000" bg="#e8f5e9" />
            <span style={{ fontSize: 20, cursor: 'pointer', color: '#C05621', lineHeight: 1 }}>
              +
            </span>
          </div>
        </div>

        <Divider />

        <div style={{ padding: 16 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 12 }}>Mes événements à venir</Text>
          {myEvents.slice(0, 3).map((event) => (
            <Card key={event.id} onClick={() => navigate(`/events/${event.id}`)} style={{ marginBottom: 12 }}>
              <Text className="user-content" style={{ margin: 0, fontWeight: 'bold' }}>{event.title}</Text>
              <Text style={{ margin: '4px 0 0 0', fontSize: 13, color: '#888' }}>{event.date}</Text>
            </Card>
          ))}
          <Button style={{ width: '100%' }} onClick={() => navigate('/events')}>
            Voir tous les événements
          </Button>
        </div>

        <Divider />

        <div style={{ padding: '0 16px 16px' }}>
          <div className="app-list-item" onClick={() => navigate('/events/new')}>
            <span style={{ marginRight: 12 }}>+</span>
            <Text style={{ margin: 0 }}>Relayer un événement</Text>
          </div>
          <div className="app-list-item" onClick={() => navigate('/profile/friends')}>
            <span style={{ marginRight: 12 }}>👥</span>
            <Text style={{ margin: 0 }}>Mon réseau</Text>
          </div>
          <div className="app-list-item">
            <span style={{ marginRight: 12 }}>📜</span>
            <Text style={{ margin: 0 }}>Événements passés</Text>
          </div>
        </div>
      </div>

      <BottomNav active="profile" />
    </div>
  );
}
