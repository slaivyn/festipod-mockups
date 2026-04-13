import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Text, Button, Avatar, AvatarStack, Tag, RelevanceIcon, Placeholder } from '../components/sketchy';
import type { ScreenProps } from './index';

const PEOPLE = [
  { name: 'Marie Leroy', color: '#E8590C', intentions: ['gouvernance coopérative', 'financement solidaire'] },
  { name: 'Jean Morel', color: '#2B6CB0', intentions: ['low-tech', 'habitat participatif'] },
  { name: 'Alice Duval', color: '#9C4DC7', intentions: ['communs numériques'] },
  { name: 'Thomas Bazin', color: '#38A169', intentions: ['circuits courts', 'gouvernance coopérative'] },
  { name: 'Camille Noir', color: '#D69E2E', intentions: ['éducation populaire'] },
];

const meetingPoints = [
  { title: 'Gouvernance coopérative', host: PEOPLE[0], time: 'Ven. 22 · 9h00', relevance: 3 },
  { title: "Café d'accueil", host: PEOPLE[3], time: 'Ven. 22 · 8h15', relevance: 0 },
  { title: 'Débrief habitat participatif', host: PEOPLE[1], time: 'Sam. 23 · 12h30', relevance: 2 },
];

const intentionTopics = [
  { label: 'gouvernance coopérative', count: 4, relevance: 3 },
  { label: 'low-tech', count: 3, relevance: 0 },
  { label: 'habitat participatif', count: 3, relevance: 2 },
  { label: 'communs numériques', count: 2, relevance: 2 },
  { label: 'financement solidaire', count: 2, relevance: 0 },
  { label: 'circuits courts', count: 1, relevance: 0 },
];

export function EventDetailScreen({ navigate }: ScreenProps) {
  const [tab, setTab] = useState('présences');
  const [isJoined, setIsJoined] = useState(true);
  const [joinedMeetings, setJoinedMeetings] = useState<Set<number>>(new Set());

  const toggleMeeting = (i: number) => {
    const next = new Set(joinedMeetings);
    if (next.has(i)) next.delete(i); else next.add(i);
    setJoinedMeetings(next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Header */}
        <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#333', padding: 0, display: 'flex', alignItems: 'center' }}><ArrowLeft size={20} /></button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Forum Ouvert Transition</div>
            <div style={{ fontSize: 12, color: '#888' }}>89 km</div>
          </div>
          <span onClick={() => navigate('update-event')} style={{ cursor: 'pointer', fontSize: 18, color: '#888' }}>✎</span>
        </div>

        {/* Cover photo */}
        <Placeholder height={160} label="Photo de couverture" style={{ margin: '0 16px 12px', borderRadius: 12 }} />

        {/* Event info */}
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
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
            <Tag label="👥 Social" bg="#EBF4FF" color="#2B6CB0" />
            <Tag label="🌿 Nature" bg="#F0FFF4" color="#276749" />
            <Tag label="✨ Autre" bg="#FAF5FF" color="#6B46C1" />
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ margin: '4px 16px 12px', display: 'flex', gap: 8 }}>
          <Button
            variant={isJoined ? 'green' : 'primary'}
            onClick={() => setIsJoined(!isJoined)}
            style={{ flex: 1, padding: '12px 0' }}
          >
            {isJoined ? '✓ Je participe' : "J'y serai"}
          </Button>
          <Button
            variant="accent-outline"
            onClick={() => navigate('intentions')}
            style={{ flex: 1, padding: '12px 0' }}
          >
            + Intention
          </Button>
        </div>

        {/* Invite button */}
        {isJoined && (
          <div style={{ margin: '0 16px 12px' }}>
            <Button onClick={() => navigate('invite')} style={{ width: '100%' }}>
              Inviter des amis
            </Button>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '2px solid #f0f0f0', margin: '0 16px' }}>
          {['présences', 'rencontres', 'intentions'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`app-tab ${tab === t ? 'active' : ''}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ padding: 16 }}>
          {tab === 'présences' && (
            <div>
              <div style={{ fontSize: 12, color: '#999', fontWeight: 600, marginBottom: 12 }}>MES CONNEXIONS ({PEOPLE.length})</div>
              {PEOPLE.map((p, i) => (
                <div
                  key={i}
                  onClick={() => navigate('user-profile')}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f5f5f5', cursor: 'pointer' }}
                >
                  <Avatar name={p.name} color={p.color} size={38} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{p.name}</div>
                    <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                      {p.intentions.map((intent, j) => (
                        <Tag key={j} label={intent} bg="#f0f0f0" color="#666" />
                      ))}
                    </div>
                  </div>
                  <button style={{ background: 'none', border: '1.5px solid #ddd', borderRadius: 8, padding: '6px 10px', fontSize: 18, cursor: 'pointer', color: '#999' }}>💬</button>
                </div>
              ))}
              <div style={{ marginTop: 16, padding: 14, background: '#f9f9f9', borderRadius: 12, textAlign: 'center' }}>
                <div
                  style={{ fontSize: 12, color: '#999', cursor: 'pointer' }}
                  onClick={() => navigate('participants-list')}
                >
                  + 19 autres participants (profils publics)
                </div>
              </div>
            </div>
          )}

          {tab === 'rencontres' && (
            <div>
              {meetingPoints.map((c, i) => (
                <div key={i} style={{ padding: 14, border: '1.5px solid #eee', borderRadius: 14, marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', flex: 1 }}>{c.title}</div>
                    <RelevanceIcon level={c.relevance} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <Avatar name={c.host.name} color={c.host.color} size={20} />
                    <span style={{ fontSize: 12, color: '#888' }}>{c.host.name} · {c.time}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
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
              <button
                onClick={() => navigate('meeting-points')}
                style={{ width: '100%', padding: 14, border: '2px dashed #ddd', borderRadius: 14, background: 'none', fontSize: 14, fontWeight: 600, color: '#999', cursor: 'pointer', marginTop: 4, fontFamily: 'var(--font-app)' }}
              >
                + Proposer un point de rencontre
              </button>
            </div>
          )}

          {tab === 'intentions' && (
            <div>
              <div style={{ fontSize: 12, color: '#999', fontWeight: 600, marginBottom: 8 }}>SUJETS RECHERCHÉS PAR LES PARTICIPANTS</div>
              {intentionTopics.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <RelevanceIcon level={item.relevance} />
                    <span style={{ fontSize: 14, fontWeight: item.relevance ? 600 : 400, color: item.relevance ? '#1a1a1a' : '#666' }}>{item.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: '#bbb' }}>{item.count} pers.</span>
                    <button style={{ background: 'none', border: '1px solid #ddd', borderRadius: 6, padding: '4px 8px', fontSize: 11, cursor: 'pointer', color: '#666', fontFamily: 'var(--font-app)' }}>voir</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
