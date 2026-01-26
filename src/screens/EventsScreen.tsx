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
        <EventCard
          title="Formation CNV"
          date="Sam. 1 mars · 9h30"
          location="MJC Montplaisir, Lyon"
          attendees={16}
          onClick={() => navigate('event-detail')}
        />
        <EventCard
          title="Rencontre des Colibris"
          date="Mer. 12 fév. · 19h00"
          location="La Maison de l'Environnement"
          attendees={30}
          onClick={() => navigate('event-detail')}
        />
      </div>

      {/* Bottom Nav */}
      <NavBar
        items={[
          { icon: '⌂', label: 'Accueil', onClick: () => navigate('home') },
          { icon: '◎', label: 'Découvrir', active: true },
          { icon: '+', label: 'Relayer', onClick: () => navigate('create-event') },
          { icon: '☺', label: 'Profil', onClick: () => navigate('profile') },
        ]}
      />
    </div>
  );
}
