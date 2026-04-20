import { useState } from 'react';
import { Title, Card, AvatarStack, BottomNav, EventCover, EventMeetingPoints, type MeetingPointData } from '../components/sketchy';
import type { ScreenProps } from './index';

type Person = { name: string; color: string };

const PEOPLE: Person[] = [
  { name: 'Marie Leroy', color: '#E8590C' },
  { name: 'Jean Morel', color: '#2B6CB0' },
  { name: 'Alice Duval', color: '#9C4DC7' },
  { name: 'Thomas Bazin', color: '#38A169' },
  { name: 'Camille Noir', color: '#D69E2E' },
];

interface Ev {
  id: number;
  name: string;
  date: string;
  lieu: string;
  people: Person[];
  color: string;
  meetingPoints: MeetingPointData[];
}

const ongoingEvent: Ev = {
  id: 1,
  name: 'Forum Ouvert Transition',
  date: '22-23 Fév.',
  lieu: "Tiers-lieu l'Hermitage",
  people: PEOPLE.slice(0, 5),
  color: '#E8590C',
  meetingPoints: [
    { id: 'fot-1', title: 'Gouvernance coopérative', when: 'Ven. 22 · 9h00', duration: '~60 min', lieu: "Café d'en face" },
    { id: 'fot-2', title: "Café d'accueil", when: 'Ven. 22 · 8h15', duration: '~30 min', lieu: 'Hall principal' },
    { id: 'fot-3', title: 'Débrief habitat participatif', when: 'Sam. 23 · 12h30', duration: '~45 min', lieu: 'Salle B' },
    { id: 'fot-4', title: 'Low-tech sans écran', when: 'Sam. 23 · 15h00', duration: '~50 min', lieu: 'Atelier 2' },
  ],
};

const upcomingEvents: Ev[] = [
  {
    id: 2,
    name: 'Résidence Reconnexion',
    date: 'Lun. 16 – Ven. 20 Fév.',
    lieu: 'Le Revel, Rogues (30)',
    people: PEOPLE.slice(1, 5),
    color: '#2B6CB0',
    meetingPoints: [
      { id: 'rc-1', title: 'Gouvernance partagée', when: 'Mar. 17 · 10h00', duration: '~60 min', lieu: 'Salle centrale' },
      { id: 'rc-2', title: 'Pique-nique des communs', when: 'Jeu. 19 · 12h30', duration: '~90 min', lieu: 'Jardin' },
      { id: 'rc-3', title: 'Cartographie des projets', when: 'Ven. 20 · 9h00', duration: '~75 min', lieu: 'Salle B' },
    ],
  },
];

function EventCardBody({
  ev,
  joinedIds,
  onToggle,
  onClick,
  isOngoing = false,
}: {
  ev: Ev;
  joinedIds: Set<string>;
  onToggle: (id: string) => void;
  onClick: () => void;
  isOngoing?: boolean;
}) {
  const borderStyle = isOngoing ? '2px solid #c6f6d5' : undefined;
  return (
    <Card
      onClick={onClick}
      style={{ marginBottom: 14, padding: 0, overflow: 'hidden', border: borderStyle }}
      accentColor={ev.color}
    >
      <EventCover eventId={ev.id} height={110} borderRadius={0} />
      <div style={{ padding: 14 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>
          {ev.name}
        </div>
        <div style={{ fontSize: 12.5, color: '#888', marginBottom: 10 }}>
          {ev.date} · {ev.lieu}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <AvatarStack people={ev.people} size={26} />
          <span style={{ fontSize: 12, color: '#666' }}>
            {ev.people.length} {isOngoing ? 'connexions présentes' : 'connexions'}
          </span>
        </div>

        <EventMeetingPoints
          points={ev.meetingPoints}
          joinedIds={joinedIds}
          onToggle={(id) => onToggle(id)}
        />
      </div>
    </Card>
  );
}

export function HomeScreen({ navigate }: ScreenProps) {
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set(['fot-1', 'rc-2']));

  const toggle = (id: string) => {
    setJoinedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ padding: '12px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title style={{ margin: 0 }}>Festipod</Title>
          <button
            onClick={() => navigate('create-event')}
            aria-label="Relayer un événement"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              border: 'none',
              borderRadius: 20,
              background: '#E8590C',
              color: '#fff',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'var(--font-app)',
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Relayer
          </button>
        </div>

        <div style={{ padding: '0 16px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#22543D', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#38A169', display: 'inline-block' }} />
            En cours
          </div>

          <EventCardBody
            ev={ongoingEvent}
            joinedIds={joinedIds}
            onToggle={toggle}
            onClick={() => navigate('event-detail')}
            isOngoing
          />

          <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#E8590C', margin: '20px 0 10px' }}>
            À venir
          </div>

          {upcomingEvents.map(ev => (
            <EventCardBody
              key={ev.id}
              ev={ev}
              joinedIds={joinedIds}
              onToggle={toggle}
              onClick={() => navigate('event-detail')}
            />
          ))}
        </div>
        <div style={{ height: 8 }} />
      </div>

      <BottomNav active="home" navigate={navigate} />
    </div>
  );
}
