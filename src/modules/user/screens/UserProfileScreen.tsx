import { ArrowLeft } from 'lucide-react';
import { Header, Avatar, Title, Text, Button, Card, Badge, Divider } from '../../../shared/components/sketchy';
import { useFestipodData } from '../../../shared/context/FestipodDataContext';
import { useNavigate, useGoBack, useParams } from '../../../app/router';

export function UserProfileScreen() {
  const navigate = useNavigate();
  const goBack = useGoBack();
  const { userId } = useParams();
  const { users, currentUserId, getUser, getUserEvents, addFriend, getFriends } = useFestipodData();

  const viewedUser = userId ? getUser(userId) : users.find(u => u.id !== currentUserId);
  const friends = getFriends();
  const isFriend = viewedUser ? friends.some(f => f.id === viewedUser.id) : false;
  const userEvents = viewedUser ? getUserEvents(viewedUser.id) : [];

  const pastEvents = [
    { title: 'Forum Ouvert Transition', date: '22 jan.', location: "Tiers-lieu L'Hermitage", distance: 89, common: true },
    { title: 'Rencontre des Colibris', date: '12 jan.', location: "La Maison de l'Environnement", distance: 7, common: true },
    { title: 'Formation CNV', date: '8 jan.', location: 'MJC Montplaisir, Lyon', distance: 5, common: false },
    { title: 'Café des possibles', date: '15 déc.', location: 'Café de la Mairie, Lyon 3', distance: 2, common: false },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Profil"
        left={<ArrowLeft size={20} onClick={goBack} style={{ cursor: 'pointer' }} />}
      />

      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ padding: 24, textAlign: 'center' }}>
          <Avatar initials={viewedUser?.initials ?? '?'} color="#2B6CB0" size="lg" />
          <Title className="user-content" style={{ marginTop: 16, marginBottom: 4 }}>{viewedUser?.name}</Title>
          <Text className="user-content" style={{ margin: 0, color: '#888' }}>{viewedUser?.username}</Text>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 20 }}>
            <div style={{ textAlign: 'center' }}>
              <Text style={{ fontWeight: 'bold', margin: 0 }}>{viewedUser?.eventsCount ?? userEvents.length}</Text>
              <Text style={{ fontSize: 12, color: '#888', margin: 0 }}>Événements</Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Text style={{ fontWeight: 'bold', margin: 0 }}>{viewedUser?.friendsCount ?? 23}</Text>
              <Text style={{ fontSize: 12, color: '#888', margin: 0 }}>Contacts</Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Text style={{ fontWeight: 'bold', margin: 0 }}>{viewedUser?.participationsCount ?? 42}</Text>
              <Text style={{ fontSize: 12, color: '#888', margin: 0 }}>Participations</Text>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'center' }}>
            <Button
              variant={isFriend ? 'default' : 'primary'}
              onClick={() => viewedUser && addFriend(viewedUser.id)}
            >
              {isFriend ? '✓ Dans mon réseau' : 'Ajouter au réseau'}
            </Button>
            <Button>Contacter</Button>
          </div>
        </div>

        <Divider />

        <div style={{ padding: 16 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 12 }}>Événements à venir</Text>
          {userEvents.map((event) => (
            <Card key={event.id} onClick={() => navigate(`/events/${event.id}`)} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Text className="user-content" style={{ margin: 0, fontWeight: 'bold' }}>{event.title}</Text>
                  <Text style={{ margin: '4px 0 0 0', fontSize: 13, color: '#888' }}>{event.date}</Text>
                  <Text style={{ margin: '2px 0 0 0', fontSize: 13, color: '#888' }}>
                    📍 <span className="user-content">{event.location}</span>
                    {event.distance != null && ` · ${event.distance} km`}
                  </Text>
                </div>
                <Badge style={{ background: '#FFF7ED', color: '#E8590C' }}>moi aussi</Badge>
              </div>
            </Card>
          ))}
        </div>

        <Divider />

        <div style={{ padding: 16 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 12 }}>Événements passés</Text>
          {pastEvents.map((event, i) => (
            <Card key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Text style={{ margin: 0, fontWeight: 'bold' }}>{event.title}</Text>
                  <Text style={{ margin: '4px 0 0 0', fontSize: 13, color: '#888' }}>{event.date}</Text>
                  <Text style={{ margin: '2px 0 0 0', fontSize: 13, color: '#888' }}>
                    📍 {event.location} · {event.distance} km
                  </Text>
                </div>
                {event.common && <Badge style={{ background: '#FFF7ED', color: '#E8590C' }}>moi aussi</Badge>}
              </div>
            </Card>
          ))}
        </div>

        <Divider />

        <div style={{ padding: 16 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 12 }}>Envoyer un message</Text>
          <div style={{
            border: '1.5px solid #e0e0e0',
            borderRadius: 12,
            padding: 12,
            minHeight: 80,
            fontSize: 14,
            color: '#bbb',
          }}>
            Écrivez votre message ici...
          </div>
          <Button variant="primary" style={{ width: '100%', marginTop: 12 }}>
            Envoyer
          </Button>
        </div>
      </div>
    </div>
  );
}
