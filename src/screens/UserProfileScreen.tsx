import React from 'react';
import { Header, Avatar, Title, Text, Button, Card, Badge, Divider } from '../components/sketchy';
import type { ScreenProps } from './index';

export function UserProfileScreen({ navigate }: ScreenProps) {
  const upcomingEvents = [
    { title: 'Résidence Reconnexion', date: '16-20 fév.', location: 'Le Revel, Rogues (30)', distance: '142 km', common: true },
    { title: 'Atelier permaculture', date: '28 fév.', location: 'Ferme des Music, Vénissieux', distance: '12 km', common: false },
  ];

  const pastEvents = [
    { title: 'Forum Ouvert Transition', date: '22 jan.', location: "Tiers-lieu L'Hermitage", distance: '89 km', common: true },
    { title: 'Rencontre des Colibris', date: '12 jan.', location: "La Maison de l'Environnement", distance: '7 km', common: true },
    { title: 'Formation CNV', date: '8 jan.', location: 'MJC Montplaisir, Lyon', distance: '5 km', common: false },
    { title: 'Café des possibles', date: '15 déc.', location: 'Café de la Mairie, Lyon 3', distance: '2 km', common: false },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Profil"
        left={<span onClick={() => navigate('event-detail')} style={{ cursor: 'pointer', fontSize: 18 }}>‹</span>}
      />

      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ padding: 24, textAlign: 'center' }}>
          <Avatar name="Jean Durand" color="#2B6CB0" size="lg" />
          <Title style={{ marginTop: 16, marginBottom: 4 }}>Jean Durand</Title>
          <Text style={{ margin: 0, color: '#888' }}>@jeandurand</Text>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 20 }}>
            <div style={{ textAlign: 'center' }}>
              <Text style={{ fontWeight: 'bold', margin: 0 }}>8</Text>
              <Text style={{ fontSize: 12, color: '#888', margin: 0 }}>Événements</Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Text style={{ fontWeight: 'bold', margin: 0 }}>23</Text>
              <Text style={{ fontSize: 12, color: '#888', margin: 0 }}>Contacts</Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Text style={{ fontWeight: 'bold', margin: 0 }}>42</Text>
              <Text style={{ fontSize: 12, color: '#888', margin: 0 }}>Participations</Text>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'center' }}>
            <Button variant="primary">Ajouter au réseau</Button>
            <Button>Contacter</Button>
          </div>
        </div>

        <Divider />

        <div style={{ padding: 16 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 12 }}>Événements à venir</Text>
          {upcomingEvents.map((event, i) => (
            <Card key={i} onClick={() => navigate('event-detail')} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Text style={{ margin: 0, fontWeight: 'bold' }}>{event.title}</Text>
                  <Text style={{ margin: '4px 0 0 0', fontSize: 13, color: '#888' }}>{event.date}</Text>
                  <Text style={{ margin: '2px 0 0 0', fontSize: 13, color: '#888' }}>
                    📍 {event.location} · {event.distance}
                  </Text>
                </div>
                {event.common && <Badge style={{ background: '#FFF7ED', color: '#E8590C' }}>moi aussi</Badge>}
              </div>
            </Card>
          ))}
        </div>

        <Divider />

        <div style={{ padding: 16 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 12 }}>Événements passés</Text>
          {pastEvents.map((event, i) => (
            <Card key={i} onClick={() => navigate('event-detail')} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Text style={{ margin: 0, fontWeight: 'bold' }}>{event.title}</Text>
                  <Text style={{ margin: '4px 0 0 0', fontSize: 13, color: '#888' }}>{event.date}</Text>
                  <Text style={{ margin: '2px 0 0 0', fontSize: 13, color: '#888' }}>
                    📍 {event.location} · {event.distance}
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
