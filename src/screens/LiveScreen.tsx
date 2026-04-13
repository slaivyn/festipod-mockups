import React, { useState } from 'react';
import { NavBar, Avatar, RelevanceIcon } from '../components/sketchy';
import type { ScreenProps } from './index';

const PEOPLE = [
  { name: 'Marie Leroy', color: '#E8590C' },
  { name: 'Jean Morel', color: '#2B6CB0' },
  { name: 'Alice Duval', color: '#9C4DC7' },
  { name: 'Thomas Bazin', color: '#38A169' },
  { name: 'Camille Noir', color: '#D69E2E' },
  { name: 'Léo Garnier', color: '#E53E3E' },
];

export function LiveScreen({ navigate }: ScreenProps) {
  const [joinedMeetings, setJoinedMeetings] = useState<Set<number>>(new Set());

  const toggleMeeting = (i: number) => {
    const next = new Set(joinedMeetings);
    if (next.has(i)) next.delete(i); else next.add(i);
    setJoinedMeetings(next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ padding: '12px 16px 8px' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', letterSpacing: -0.3 }}>En direct</div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Forum Ouvert Transition · Jour 1</div>
        </div>

        {/* Section title */}
        <div style={{ fontSize: 13, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 1, margin: '8px 16px 10px' }}>Points de rencontre</div>

        <div style={{ padding: '0 16px 16px' }}>
          {/* Upcoming meeting - green highlight */}
          <div style={{ padding: 14, borderRadius: 14, background: '#f7fff7', border: '1.5px solid #c6f6d5', marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#22543D' }}>Débrief habitat participatif</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <Avatar name={PEOPLE[1].name} color={PEOPLE[1].color} size={18} />
                  <span style={{ fontSize: 12, color: '#68D391', fontWeight: 600 }}>Dans 45 min · Salle B</span>
                </div>
              </div>
            </div>
          </div>

          {/* Meeting points with join buttons */}
          {[
            { title: 'Gouvernance coopérative', host: PEOPLE[0], time: "Dans 2h · Café d'en face", relevance: 3 },
            { title: "Café d'accueil", host: PEOPLE[3], time: 'Demain 8h15 · Hall', relevance: 0 },
          ].map((m, i) => (
            <div key={i} style={{ padding: 14, border: '1.5px solid #eee', borderRadius: 14, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>{m.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <Avatar name={m.host.name} color={m.host.color} size={18} />
                    <span style={{ fontSize: 12, color: '#888' }}>{m.time}</span>
                  </div>
                </div>
                {m.relevance > 0 && <RelevanceIcon level={m.relevance} />}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 10 }}>
                <button
                  onClick={() => toggleMeeting(i)}
                  style={{
                    background: joinedMeetings.has(i) ? '#22543D' : '#1a1a1a',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '7px 16px',
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {joinedMeetings.has(i) ? '✓ Rejoint' : 'Rejoindre'}
                </button>
              </div>
            </div>
          ))}

          {/* Present connections */}
          <div style={{ fontSize: 12, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 1, margin: '16px 0 10px' }}>Connexions présentes</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {PEOPLE.slice(0, 5).map((p, i) => (
              <div key={i} onClick={() => navigate('user-profile')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: 60, cursor: 'pointer' }}>
                <Avatar name={p.name} color={p.color} size={42} online={i < 3} />
                <span style={{ fontSize: 11, color: '#666', textAlign: 'center' }}>{p.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 8 }} />
      </div>

      <NavBar
        items={[
          { icon: '◎', label: 'Événements', onClick: () => navigate('home') },
          { icon: '⬡', label: 'Réseau', onClick: () => navigate('friends-list') },
          { icon: '◉', label: 'En direct', active: true },
          { icon: '○', label: 'Profil', onClick: () => navigate('profile') },
        ]}
      />
    </div>
  );
}
