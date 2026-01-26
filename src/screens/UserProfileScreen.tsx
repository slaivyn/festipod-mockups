import React from 'react';
import { Header, Avatar, Title, Text, Button, Card, Badge, Divider } from '../components/sketchy';
import type { ScreenProps } from './index';

export function UserProfileScreen({ navigate }: ScreenProps) {
  const upcomingEvents = [
    { title: 'Résidence Reconnexion', date: '16-20 fév.', common: true },
    { title: 'Atelier permaculture', date: '28 fév.', common: false },
  ];

  const pastEvents = [
    { title: 'Forum Ouvert Transition', date: '22 jan.', common: true },
    { title: 'Rencontre des Colibris', date: '12 jan.', common: true },
    { title: 'Formation CNV', date: '8 jan.', common: false },
    { title: 'Café des possibles', date: '15 déc.', common: false },
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
          <Avatar initials="JD" size="lg" />
          <Title className="user-content" style={{ marginTop: 16, marginBottom: 4 }}>Jean Durand</Title>
          <Text className="user-content" style={{ margin: 0 }}>@jeandurand</Text>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 20 }}>
            <div style={{ textAlign: 'center' }}>
              <Text style={{ fontWeight: 'bold', margin: 0 }}>8</Text>
              <Text style={{ fontSize: 12, color: 'var(--sketch-gray)', margin: 0 }}>Événements</Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Text style={{ fontWeight: 'bold', margin: 0 }}>23</Text>
              <Text style={{ fontSize: 12, color: 'var(--sketch-gray)', margin: 0 }}>Contacts</Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Text style={{ fontWeight: 'bold', margin: 0 }}>42</Text>
              <Text style={{ fontSize: 12, color: 'var(--sketch-gray)', margin: 0 }}>Participations</Text>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'center' }}>
            <Button variant="primary">Ajouter au réseau</Button>
            <Button>Contacter</Button>
          </div>
        </div>

        <Divider />

        {/* Upcoming events */}
        <div style={{ padding: 16 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 12 }}>Événements à venir</Text>

          {upcomingEvents.map((event, i) => (
            <Card key={i} onClick={() => navigate('event-detail')} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Text className="user-content" style={{ margin: 0, fontWeight: 'bold' }}>{event.title}</Text>
                  <Text className="user-content" style={{ margin: '4px 0 0 0', fontSize: 14 }}>
                    {event.date}
                  </Text>
                </div>
                {event.common && <Badge>moi aussi</Badge>}
              </div>
            </Card>
          ))}
        </div>

        <Divider />

        {/* Past events */}
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
