import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button, Avatar, EventCover, EventMeetingPoints, showToast, type MeetingPointData } from '../components/sketchy';
import type { ScreenProps } from './index';

const PEOPLE = [
  { name: 'Marie Leroy', color: '#E8590C', intentions: ['gouvernance coopérative', 'financement solidaire'] },
  { name: 'Jean Morel', color: '#2B6CB0', intentions: ['low-tech', 'habitat participatif'] },
  { name: 'Alice Duval', color: '#9C4DC7', intentions: ['communs numériques'] },
  { name: 'Thomas Bazin', color: '#38A169', intentions: ['circuits courts', 'gouvernance coopérative'] },
  { name: 'Camille Noir', color: '#D69E2E', intentions: ['éducation populaire'] },
];

const meetingPoints: MeetingPointData[] = [
  { id: 'fot-1', title: 'Gouvernance coopérative', when: 'Ven. 22 · 9h00', duration: '~60 min', lieu: "Café d'en face" },
  { id: 'fot-2', title: "Café d'accueil", when: 'Ven. 22 · 8h15', duration: '~30 min', lieu: 'Hall principal' },
  { id: 'fot-3', title: 'Débrief habitat participatif', when: 'Sam. 23 · 12h30', duration: '~45 min', lieu: 'Salle B' },
];

export function EventDetailScreen({ navigate }: ScreenProps) {
  const [isJoined, setIsJoined] = useState(true);
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set(['fot-1']));

  const toggleParticipate = () => {
    setIsJoined(prev => {
      const next = !prev;
      showToast(next ? 'Tu participes à cet événement' : 'Participation annulée', next ? 'success' : 'info');
      return next;
    });
  };

  const toggleMeeting = (id: string) => {
    setJoinedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#333', padding: 0, display: 'flex', alignItems: 'center' }}><ArrowLeft size={20} /></button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Forum Ouvert Transition</div>
            <div style={{ fontSize: 12, color: '#888' }}>89 km</div>
          </div>
          <span onClick={() => navigate('update-event')} style={{ cursor: 'pointer', fontSize: 18, color: '#888' }}>✎</span>
        </div>

        <div style={{ padding: '0 16px 12px' }}>
          <EventCover eventId={1} height={100} />
        </div>

        <div style={{ margin: '0 16px 12px', padding: 14, background: '#fafafa', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 15 }}>📅</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>22 – 23 Fév. 2026</div>
              <div style={{ fontSize: 12, color: '#888' }}>9h00 – 18h00</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 15 }}>📍</span>
            <span style={{ fontSize: 13, color: '#1a1a1a' }}>Le Chapeau Rouge, Lyon (69)</span>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 15 }}>📝</span>
            <span style={{ fontSize: 13, color: '#555', lineHeight: 1.5 }}>
              Un forum ouvert pour explorer ensemble les transitions écologiques et sociales. Venez partager vos projets et rencontrer d'autres acteurs du changement.
            </span>
          </div>
        </div>

        <div style={{ margin: '4px 16px 16px', display: 'flex', gap: 8 }}>
          <Button
            variant={isJoined ? 'green' : 'primary'}
            onClick={toggleParticipate}
            style={{ flex: 1, padding: '12px 0' }}
          >
            {isJoined ? '✓ Je participe' : "J'y serai"}
          </Button>
          {isJoined && (
            <Button
              onClick={() => navigate('invite')}
              style={{ flex: 1, padding: '12px 0' }}
            >
              Inviter
            </Button>
          )}
        </div>

        <div style={{ padding: '0 16px 8px' }}>
          <EventMeetingPoints
            points={meetingPoints}
            joinedIds={joinedIds}
            onToggle={toggleMeeting}
            expanded
          />
          <button
            onClick={() => navigate('meeting-points')}
            style={{ width: '100%', padding: 12, border: '2px dashed #ddd', borderRadius: 12, background: 'none', fontSize: 13, fontWeight: 600, color: '#999', cursor: 'pointer', marginTop: 4, fontFamily: 'var(--font-app)' }}
          >
            + Proposer un point de rencontre
          </button>
        </div>

        <div style={{ padding: '16px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            Participants ({PEOPLE.length})
          </div>
          {PEOPLE.map((p, i) => (
            <div
              key={i}
              onClick={() => navigate('user-profile', { from: 'event-detail' })}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f5f5f5', cursor: 'pointer' }}
            >
              <Avatar name={p.name} color={p.color} size={38} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{p.name}</div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                  {p.intentions.join(' · ')}
                </div>
              </div>
              <button style={{ background: 'none', border: '1.5px solid #ddd', borderRadius: 8, padding: '6px 10px', fontSize: 18, cursor: 'pointer', color: '#999' }}>💬</button>
            </div>
          ))}
          <div
            style={{ marginTop: 12, padding: 12, background: '#f9f9f9', borderRadius: 12, textAlign: 'center', cursor: 'pointer' }}
            onClick={() => navigate('participants-list')}
          >
            <span style={{ fontSize: 12, color: '#999' }}>Voir tous les participants →</span>
          </div>
        </div>
      </div>
    </div>
  );
}
