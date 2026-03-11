import React from 'react';
import { Header, Avatar, Title, Text, Button, Card, Badge, Divider, NavBar } from '../../../shared/components/sketchy';
import { useFestipodData } from '../../../shared/context/FestipodDataContext';
import type { ScreenProps } from '../../../screens';

export function ProfileScreen({ navigate }: ScreenProps) {
  const { currentUser, getUserEvents, currentUserId, getFriends, setSelectedEventId } = useFestipodData();
  const myEvents = getUserEvents(currentUserId);
  const friends = getFriends();

  const user = currentUser;

  const handleEventClick = (eventId: string) => {
    setSelectedEventId(eventId);
    navigate('event-detail');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Mon profil"
        left={<span onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>←</span>}
        right={<span onClick={() => navigate('settings')} style={{ cursor: 'pointer' }}>⚙</span>}
      />

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Profile header */}
        <div style={{ padding: 24, textAlign: 'center' }}>
          <Avatar initials={user?.initials ?? '?'} size="lg" />
          <Title className="user-content" style={{ marginTop: 16, marginBottom: 4 }}>{user?.name}</Title>
          <Text className="user-content" style={{ margin: 0 }}>{user?.username}</Text>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 20 }}>
            <div style={{ textAlign: 'center' }}>
              <Text style={{ fontWeight: 'bold', margin: 0 }}>{user?.eventsCount ?? myEvents.length}</Text>
              <Text style={{ fontSize: 12, color: 'var(--sketch-gray)', margin: 0 }}>Événements</Text>
            </div>
            <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('friends-list')}>
              <Text style={{ fontWeight: 'bold', margin: 0 }}>{user?.friendsCount ?? friends.length}</Text>
              <Text style={{ fontSize: 12, color: 'var(--sketch-gray)', margin: 0 }}>Amis</Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Text style={{ fontWeight: 'bold', margin: 0 }}>{user?.participationsCount ?? 0}</Text>
              <Text style={{ fontSize: 12, color: 'var(--sketch-gray)', margin: 0 }}>Participations</Text>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'center' }}>
            <Button variant="primary" onClick={() => navigate('update-profile')}>Modifier le profil</Button>
            <Button onClick={() => navigate('share-profile')}>Partager</Button>
          </div>
        </div>

        <Divider />

        {/* Upcoming events */}
        <div style={{ padding: 16 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 12 }}>Mes événements à venir</Text>
          {myEvents.slice(0, 3).map((event) => (
            <Card key={event.id} onClick={() => handleEventClick(event.id)} style={{ marginBottom: 12 }}>
              <Text className="user-content" style={{ margin: 0, fontWeight: 'bold' }}>{event.title}</Text>
              <Text className="user-content" style={{ margin: '4px 0 0 0', fontSize: 14 }}>
                {event.date}
              </Text>
            </Card>
          ))}
          <Button style={{ width: '100%' }} onClick={() => navigate('events')}>
            Voir tous les événements
          </Button>
        </div>

        <Divider />

        {/* Quick actions */}
        <div style={{ padding: '0 16px 16px' }}>
          <div
            className="sketchy-list-item"
            onClick={() => navigate('create-event')}
          >
            <span style={{ marginRight: 12 }}>+</span>
            <Text style={{ margin: 0 }}>Relayer un événement</Text>
          </div>
          <div className="sketchy-list-item" onClick={() => navigate('friends-list')}>
            <span style={{ marginRight: 12 }}>👥</span>
            <Text style={{ margin: 0 }}>Mes amis</Text>
          </div>
          <div className="sketchy-list-item">
            <span style={{ marginRight: 12 }}>📜</span>
            <Text style={{ margin: 0 }}>Événements passés</Text>
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <NavBar
        items={[
          { icon: '⌂', label: 'Accueil', onClick: () => navigate('home') },
          { icon: '◎', label: 'Découvrir', onClick: () => navigate('events') },
          { icon: '+', label: 'Relayer', onClick: () => navigate('create-event') },
          { icon: '☺', label: 'Profil', active: true },
        ]}
      />
    </div>
  );
}
