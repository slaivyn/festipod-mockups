import React from 'react';
import { Header, Input, Card, Text, Badge, NavBar } from '../components/sketchy';
import type { ScreenProps } from './index';

function EventCard({ title, date, location, attendees, onClick }: {
  title: string;
  date: string;
  location: string;
  attendees: number;
  onClick: () => void;
}) {
  return (
    <Card onClick={onClick} style={{ marginBottom: 12 }}>
      <Text className="user-content" style={{ margin: 0, fontWeight: 'bold' }}>{title}</Text>
      <Text style={{ margin: '4px 0', fontSize: 14 }}>
        📅 <span className="user-content">{date}</span>
      </Text>
      <Text style={{ margin: '0 0 8px 0', fontSize: 14 }}>
        📍 <span className="user-content">{location}</span>
      </Text>
      <Badge>{attendees} inscrits</Badge>
    </Card>
  );
}

export function EventsScreen({ navigate }: ScreenProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Découvrir"
        left={<span onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>←</span>}
      />

      {/* Search */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--sketch-light-gray)' }}>
        <Input placeholder="Rechercher un événement..." />
      </div>

      {/* Filter tabs */}
      <div style={{
        display: 'flex',
        gap: 8,
        padding: '12px 16px',
        borderBottom: '1px solid var(--sketch-light-gray)',
      }}>
        <Badge style={{ background: 'var(--sketch-black)', color: 'var(--sketch-white)' }}>Tous</Badge>
        <Badge>Cette semaine</Badge>
        <Badge>Proches</Badge>
        <Badge>Amis</Badge>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 16, overflow: 'auto' }}>
        <EventCard
          title="Barbecue d'été"
          date="Sam. 25 jan. · 16h00"
          location="Parc Central"
          attendees={12}
          onClick={() => navigate('event-detail')}
        />
        <EventCard
          title="Soirée jeux de société"
          date="Ven. 31 jan. · 19h00"
          location="Chez Joe"
          attendees={8}
          onClick={() => navigate('event-detail')}
        />
        <EventCard
          title="Randonnée"
          date="Dim. 2 fév. · 9h00"
          location="Sentier de montagne"
          attendees={5}
          onClick={() => navigate('event-detail')}
        />
        <EventCard
          title="Marathon films"
          date="Sam. 8 fév. · 18h00"
          location="Chez Sarah"
          attendees={6}
          onClick={() => navigate('event-detail')}
        />
        <EventCard
          title="Yoga au parc"
          date="Dim. 9 fév. · 8h00"
          location="Parc Riverside"
          attendees={15}
          onClick={() => navigate('event-detail')}
        />
      </div>

      {/* Bottom Nav */}
      <NavBar
        items={[
          { icon: '⌂', label: 'Accueil', onClick: () => navigate('home') },
          { icon: '◎', label: 'Découvrir', active: true },
          { icon: '+', label: 'Créer', onClick: () => navigate('create-event') },
          { icon: '☺', label: 'Profil', onClick: () => navigate('profile') },
        ]}
      />
    </div>
  );
}
