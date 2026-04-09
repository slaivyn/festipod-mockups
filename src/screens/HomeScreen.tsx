import React from 'react';
import { Title, Text, Card, NavBar, Avatar, AvatarStack, Tag, RelevanceIcon } from '../components/sketchy';
import type { ScreenProps } from './index';

const PEOPLE = [
  { name: 'Marie Leroy', color: '#E8590C' },
  { name: 'Jean Morel', color: '#2B6CB0' },
  { name: 'Alice Duval', color: '#9C4DC7' },
  { name: 'Thomas Bazin', color: '#38A169' },
  { name: 'Camille Noir', color: '#D69E2E' },
];

const myEvents = [
  { id: 1, name: 'Forum Ouvert Transition', date: '22-23 Fév.', lieu: "Tiers-lieu l'Hermitage", distance: '89 km', people: PEOPLE.slice(0, 5), rdvs: 3, relevance: 3, color: '#E8590C' },
  { id: 2, name: 'Résidence Reconnexion', date: 'Lun. 16 – Ven. 20 Fév.', lieu: 'Le Revel, Rogues (30)', distance: '142 km', people: PEOPLE.slice(1, 5), rdvs: 1, relevance: 2, color: '#2B6CB0' },
];

const otherEvents = [
  { id: 3, name: 'Atelier low-tech', date: 'Sam. 8 Fév. · 14h', lieu: 'La Maison du Vélo, Lyon', distance: '3 km', people: PEOPLE.slice(2, 4), rdvs: 0, relevance: 0, color: '#38A169' },
  { id: 4, name: 'Rencontres des communs', date: 'Mar. 4 Mars · 10h', lieu: 'La Base, Paris', distance: '250 km', people: PEOPLE.slice(0, 3), rdvs: 2, relevance: 1, color: '#9C4DC7' },
];

function EventCard({ ev, onClick }: { ev: typeof myEvents[0]; onClick: () => void }) {
  return (
    <Card onClick={onClick} style={{ marginBottom: 12 }} accentColor={ev.color}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div style={{ fontSize: 15.5, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.3, flex: 1 }}>{ev.name}</div>
        <RelevanceIcon level={ev.relevance} />
      </div>
      <div style={{ fontSize: 12.5, color: '#888', marginBottom: 10 }}>
        {ev.date} · {ev.lieu}
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

export function HomeScreen({ navigate }: ScreenProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Header */}
        <div style={{ padding: '12px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title style={{ margin: 0 }}>Festipod</Title>
          <div onClick={() => navigate('profile')} style={{ cursor: 'pointer' }}>
            <Avatar name="Sylvain R" color="#555" size={34} />
          </div>
        </div>

        {/* Mes intentions */}
        <div style={{
          margin: '8px 16px 12px',
          padding: '14px 16px',
          background: 'linear-gradient(135deg, #FFF7ED, #FFFBF5)',
          borderRadius: 16,
          border: '1px solid #FDDCB5',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#C05621', marginBottom: 8 }}>
            Mes intentions
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            <Tag label="gouvernance coopérative" />
            <Tag label="communs numériques" />
            <Tag label="habitat participatif" color="#4a3000" bg="#e8f5e9" />
            <span
              onClick={() => navigate('intentions')}
              style={{ fontSize: 20, cursor: 'pointer', color: '#C05621', lineHeight: 1 }}
            >
              +
            </span>
          </div>
        </div>

        {/* My events */}
        <div style={{ padding: '0 16px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#E8590C', marginBottom: 10 }}>
            J'y participe
          </div>
          {myEvents.map(ev => (
            <EventCard key={ev.id} ev={ev} onClick={() => navigate('event-detail')} />
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#999' }}>
              A découvrir
            </div>
            <span onClick={() => navigate('events')} style={{ fontSize: 13, color: '#E8590C', cursor: 'pointer', fontWeight: 600 }}>
              Voir tout →
            </span>
          </div>
          {otherEvents.map(ev => (
            <EventCard key={ev.id} ev={ev} onClick={() => navigate('event-detail')} />
          ))}

          <button
            onClick={() => navigate('create-event')}
            style={{
              width: '100%',
              padding: 14,
              border: '2px dashed #ddd',
              borderRadius: 14,
              background: 'none',
              fontSize: 14,
              fontWeight: 600,
              color: '#E8590C',
              cursor: 'pointer',
              marginTop: 8,
              fontFamily: 'var(--font-app)',
            }}
          >
            + Relayer un événement
          </button>
        </div>
        <div style={{ height: 8 }} />
      </div>

      <NavBar
        items={[
          { icon: '◎', label: 'Événements', active: true },
          { icon: '⬡', label: 'Réseau', onClick: () => navigate('friends-list') },
          { icon: '◉', label: 'En direct', onClick: () => navigate('live') },
          { icon: '○', label: 'Profil', onClick: () => navigate('profile') },
        ]}
      />
    </div>
  );
}
