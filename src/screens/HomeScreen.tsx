import React from 'react';
import { Button, Title, Text, Card, NavBar, Badge } from '../components/sketchy';
import type { ScreenProps } from './index';

function EventCard({ title, date, attendees, onClick }: { title: string; date: string; attendees: number; onClick: () => void }) {
  return (
    <Card onClick={onClick} style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Text className="user-content" style={{ margin: 0, fontWeight: 'bold' }}>{title}</Text>
          <Text className="user-content" style={{ margin: '4px 0 0 0', fontSize: 14 }}>{date}</Text>
        </div>
        <Badge>{attendees} inscrits</Badge>
      </div>
    </Card>
  );
}

export function HomeScreen({ navigate }: ScreenProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ padding: '16px', borderBottom: '2px solid var(--sketch-black)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title style={{ margin: 0 }}>Festipod</Title>
          <span onClick={() => navigate('profile')} style={{ cursor: 'pointer', fontSize: 24 }}>☺</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 16, overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ margin: 0, fontWeight: 'bold' }}>Événements à venir</Text>
          <Text
            style={{ margin: 0, fontSize: 14, cursor: 'pointer' }}
            onClick={() => navigate('events')}
          >
            Voir tout →
          </Text>
        </div>

        <EventCard
          title="Barbecue d'été"
          date="Sam. 25 jan. · 16h00"
          attendees={12}
          onClick={() => navigate('event-detail')}
        />
        <EventCard
          title="Soirée jeux de société"
          date="Ven. 31 jan. · 19h00"
          attendees={8}
          onClick={() => navigate('event-detail')}
        />
        <EventCard
          title="Randonnée"
          date="Dim. 2 fév. · 9h00"
          attendees={5}
          onClick={() => navigate('event-detail')}
        />

        <div style={{ marginTop: 24 }}>
          <Button variant="primary" onClick={() => navigate('create-event')} style={{ width: '100%' }}>
            + Créer un événement
          </Button>
        </div>
      </div>

      {/* Bottom Nav */}
      <NavBar
        items={[
          { icon: '⌂', label: 'Accueil', active: true },
          { icon: '◎', label: 'Découvrir', onClick: () => navigate('events') },
          { icon: '+', label: 'Créer', onClick: () => navigate('create-event') },
          { icon: '☺', label: 'Profil', onClick: () => navigate('profile') },
        ]}
      />
    </div>
  );
}
