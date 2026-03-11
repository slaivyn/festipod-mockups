import React from 'react';
import { Header, Avatar, Title, Text, Button, Card, Badge, Divider } from '../../../shared/components/sketchy';
import { useFestipodData } from '../../../shared/context/FestipodDataContext';
import type { ScreenProps } from '../../../screens';

export function UserProfileScreen({ navigate }: ScreenProps) {
  const { users, currentUserId, selectedUser, getUserEvents, addFriend, getFriends, setSelectedEventId } = useFestipodData();

  // Use selectedUser from context, fallback to first non-current user
  const viewedUser = selectedUser
    || users.find(u => u.id !== currentUserId);

  const friends = getFriends();
  const isFriend = viewedUser ? friends.some(f => f.id === viewedUser.id) : false;
  const userEvents = viewedUser ? getUserEvents(viewedUser.id) : [];

  // Hardcoded past events for this mockup view (not all in store yet)
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
        left={<span onClick={() => navigate('event-detail')} style={{ cursor: 'pointer' }}>←</span>}
      />

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* User profile header */}
        <div style={{ padding: 24, textAlign: 'center' }}>
          <Avatar initials={viewedUser?.initials ?? '?'} size="lg" />
          <Title className="user-content" style={{ marginTop: 16, marginBottom: 4 }}>{viewedUser?.name}</Title>
          <Text className="user-content" style={{ margin: 0 }}>{viewedUser?.username}</Text>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 20 }}>
            <div style={{ textAlign: 'center' }}>
              <Text style={{ fontWeight: 'bold', margin: 0 }}>{viewedUser?.eventsCount ?? userEvents.length}</Text>
              <Text style={{ fontSize: 12, color: 'var(--sketch-gray)', margin: 0 }}>Événements</Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Text style={{ fontWeight: 'bold', margin: 0 }}>{viewedUser?.friendsCount ?? 23}</Text>
              <Text style={{ fontSize: 12, color: 'var(--sketch-gray)', margin: 0 }}>Contacts</Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Text style={{ fontWeight: 'bold', margin: 0 }}>{viewedUser?.participationsCount ?? 42}</Text>
              <Text style={{ fontSize: 12, color: 'var(--sketch-gray)', margin: 0 }}>Participations</Text>
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

        {/* Upcoming events from store */}
        <div style={{ padding: 16 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 12 }}>Événements à venir</Text>

          {(userEvents.length > 0 ? userEvents : [
            { id: 'event-1', title: 'Résidence Reconnexion', date: '16-20 fév.', location: 'Le Revel, Rogues (30)', distance: 142 },
          ]).map((event) => (
            <Card key={event.id} onClick={() => { setSelectedEventId(event.id); navigate('event-detail'); }} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Text className="user-content" style={{ margin: 0, fontWeight: 'bold' }}>{event.title}</Text>
                  <Text className="user-content" style={{ margin: '4px 0 0 0', fontSize: 14 }}>
                    {event.date}
                  </Text>
                  <Text style={{ margin: '2px 0 0 0', fontSize: 14 }}>
                    📍 <span className="user-content">{event.location}</span>
                    {event.distance != null && (
                      <span style={{ color: 'var(--sketch-gray)' }}> · {event.distance} km</span>
                    )}
                  </Text>
                </div>
                <Badge>moi aussi</Badge>
              </div>
            </Card>
          ))}
        </div>

        <Divider />

        {/* Past events (still hardcoded for mockup) */}
        <div style={{ padding: 16 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 12 }}>Événements passés</Text>

          {pastEvents.map((event, i) => (
            <Card key={i} onClick={() => navigate('event-detail')} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Text className="user-content" style={{ margin: 0, fontWeight: 'bold' }}>{event.title}</Text>
                  <Text className="user-content" style={{ margin: '4px 0 0 0', fontSize: 14 }}>
                    {event.date}
                  </Text>
                  <Text style={{ margin: '2px 0 0 0', fontSize: 14 }}>
                    📍 <span className="user-content">{event.location}</span>
                    <span style={{ color: 'var(--sketch-gray)' }}> · {event.distance} km</span>
                  </Text>
                </div>
                {event.common && <Badge>moi aussi</Badge>}
              </div>
            </Card>
          ))}
        </div>

        <Divider />

        {/* Contact form section */}
        <div style={{ padding: 16 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 12 }}>Envoyer un message</Text>
          <div style={{
            border: '2px solid var(--sketch-black)',
            borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
            padding: 12,
            minHeight: 80,
            fontFamily: 'var(--font-sketch)',
            fontSize: 14,
            color: 'var(--sketch-gray)',
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
