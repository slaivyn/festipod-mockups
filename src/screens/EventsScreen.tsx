import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Header, Input, Card, Text, Badge, NavBar, AvatarStack, RelevanceIcon } from '../components/sketchy';
import type { ScreenProps } from './index';

const PEOPLE = [
  { name: 'Marie Leroy', color: '#E8590C' },
  { name: 'Jean Morel', color: '#2B6CB0' },
  { name: 'Alice Duval', color: '#9C4DC7' },
  { name: 'Thomas Bazin', color: '#38A169' },
  { name: 'Camille Noir', color: '#D69E2E' },
];

const events = [
  { id: 1, name: 'Forum Ouvert Transition', date: 'Sam. 22 fév. · 9h00', location: "Tiers-lieu L'Hermitage", distance: '89 km', people: PEOPLE.slice(0, 5), rdvs: 3, relevance: 3, color: '#E8590C' },
  { id: 2, name: 'Résidence Reconnexion', date: 'Lun. 16 - Ven. 20 fév.', location: 'Le Revel, Rogues (30)', distance: '142 km', people: PEOPLE.slice(1, 4), rdvs: 1, relevance: 2, color: '#2B6CB0' },
  { id: 3, name: 'Atelier low-tech', date: 'Sam. 8 fév. · 14h00', location: 'La Maison du Vélo, Lyon', distance: '3 km', people: PEOPLE.slice(2, 4), rdvs: 0, relevance: 0, color: '#38A169' },
  { id: 4, name: 'Formation CNV', date: 'Sam. 1 mars · 9h30', location: 'MJC Montplaisir, Lyon', distance: '5 km', people: PEOPLE.slice(0, 2), rdvs: 0, relevance: 1, color: '#9C4DC7' },
  { id: 5, name: 'Rencontre des Colibris', date: 'Mer. 12 fév. · 19h00', location: "La Maison de l'Environnement", distance: '7 km', people: PEOPLE.slice(3, 5), rdvs: 0, relevance: 0, color: '#D69E2E' },
];

function EventCard({ ev, onClick }: { ev: typeof events[0]; onClick: () => void }) {
  return (
    <Card onClick={onClick} style={{ marginBottom: 12 }} accentColor={ev.color}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div style={{ fontSize: 15.5, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.3, flex: 1 }}>{ev.name}</div>
        <RelevanceIcon level={ev.relevance} />
      </div>
      <div style={{ fontSize: 12.5, color: '#888', marginBottom: 10 }}>
        {ev.date} · {ev.location} · {ev.distance}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <AvatarStack people={ev.people} size={26} />
          <span style={{ fontSize: 12, color: '#666' }}>{ev.people.length} connexions</span>
        </div>
        {ev.rdvs > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#E8590C', fontWeight: 600 }}>
            <span style={{ fontSize: 16 }}>●</span> {ev.rdvs} rdv{ev.rdvs > 1 && 's'}
          </div>
        )}
      </div>
    </Card>
  );
}

export function EventsScreen({ navigate }: ScreenProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Découvrir"
        left={<ArrowLeft size={20} onClick={() => navigate('home')} style={{ cursor: 'pointer' }} />}
      />

      {/* Search */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <Input placeholder="Rechercher un événement..." />
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <Badge style={{ background: '#1a1a1a', color: '#fff' }}>Tous</Badge>
        <Badge>Cette semaine</Badge>
        <Badge>Proches</Badge>
        <Badge>Amis</Badge>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 16, overflow: 'auto' }}>
        {events.map(ev => (
          <EventCard key={ev.id} ev={ev} onClick={() => navigate('event-detail')} />
        ))}
      </div>

      <NavBar
        items={[
          { icon: '◎', label: 'Événements', onClick: () => navigate('home') },
          { icon: '⬡', label: 'Réseau', onClick: () => navigate('friends-list') },
          { icon: '◉', label: 'En direct', onClick: () => navigate('live') },
          { icon: '○', label: 'Profil', onClick: () => navigate('profile') },
        ]}
      />
    </div>
  );
}
