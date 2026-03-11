import React from 'react';
import { Header, Input, Card, Text, Badge, NavBar } from '../../../shared/components/sketchy';
import { useFestipodData } from '../../../shared/context/FestipodDataContext';
import type { ScreenProps } from '../../../screens';

function EventCard({ title, date, location, distance, attendees, onClick }: {
  title: string;
  date: string;
  location: string;
  distance: number;
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
        {distance != null && <span style={{ color: 'var(--sketch-gray)' }}> · {distance} km</span>}
      </Text>
      <Badge>{attendees} inscrits</Badge>
    </Card>
  );
}

export function EventsScreen({ navigate }: ScreenProps) {
  const { events, setSelectedEventId } = useFestipodData();

  const handleEventClick = (eventId: string) => {
    setSelectedEventId(eventId);
    navigate('event-detail');
  };

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
        {/* Helper text */}
        <div style={{
          background: 'var(--sketch-light-gray)',
          padding: 12,
          borderRadius: 8,
          marginBottom: 16,
        }}>
          <Text style={{ margin: 0, fontSize: 13, color: 'var(--sketch-gray)', lineHeight: 1.5 }}>
            Événements relayés par vos contacts. Explorez, participez, et relayez
            à votre tour pour faire grandir votre réseau.
          </Text>
        </div>

        {events.map((event) => (
          <EventCard
            key={event.id}
            title={event.title}
            date={event.date}
            location={event.location}
            distance={event.distance ?? 0}
            attendees={event.participantCount}
            onClick={() => handleEventClick(event.id)}
          />
        ))}
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
