import React from 'react';
import { Button, Title, Text, Card, NavBar, Badge } from '../components/sketchy';
import type { ScreenProps } from './index';

function EventCard({ title, date, location, attendees, onClick }: { title: string; date: string; location: string; attendees: number; onClick: () => void }) {
  return (
    <Card onClick={onClick} style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Text className="user-content" style={{ margin: 0, fontWeight: 'bold' }}>{title}</Text>
          <Text className="user-content" style={{ margin: '4px 0 0 0', fontSize: 14 }}>{date}</Text>
          <Text style={{ margin: '2px 0 0 0', fontSize: 14 }}>📍 <span className="user-content">{location}</span></Text>
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
        {/* Helper text */}
        <div style={{
          background: 'var(--sketch-light-gray)',
          padding: 12,
          borderRadius: 8,
          marginBottom: 16,
        }}>
          <Text style={{ margin: 0, fontSize: 13, color: 'var(--sketch-gray)', lineHeight: 1.5 }}>
            Voici les événements auxquels vous participez. Retrouvez les infos pratiques
            et les autres participants.
          </Text>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ margin: 0, fontWeight: 'bold' }}>Mes événements à venir</Text>
          <Text
            style={{ margin: 0, fontSize: 14, cursor: 'pointer' }}
            onClick={() => navigate('events')}
          >
            Voir tout →
          </Text>
        </div>

        <EventCard
          title="Résidence Reconnexion"
          date="Lun. 16 - Ven. 20 fév."
          location="Le Revel, Rogues (30)"
          attendees={24}
          onClick={() => navigate('event-detail')}
        />
        <EventCard
          title="Atelier low-tech"
          date="Sam. 8 fév. · 14h00"
          location="La Maison du Vélo, Lyon"
          attendees={12}
          onClick={() => navigate('event-detail')}
        />
        <EventCard
          title="Forum Ouvert Transition"
          date="Sam. 22 fév. · 9h00"
          location="Tiers-lieu L'Hermitage"
          attendees={45}
          onClick={() => navigate('event-detail')}
        />

        <div style={{ marginTop: 24 }}>
          <Button variant="primary" onClick={() => navigate('create-event')} style={{ width: '100%' }}>
            + Relayer un événement
          </Button>
        </div>
      </div>

      {/* Bottom Nav */}
      <NavBar
        items={[
          { icon: '⌂', label: 'Accueil', active: true },
          { icon: '◎', label: 'Découvrir', onClick: () => navigate('events') },
          { icon: '+', label: 'Relayer', onClick: () => navigate('create-event') },
          { icon: '☺', label: 'Profil', onClick: () => navigate('profile') },
        ]}
      />
    </div>
  );
}
