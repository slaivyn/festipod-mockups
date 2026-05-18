import { ArrowLeft } from 'lucide-react';
import { Header, Avatar, Text, Input } from '../../../shared/components/sketchy';
import { useFestipodData } from '../../../shared/context/FestipodDataContext';
import { useNavigate, useParams } from '../../../app/router';

const COLORS = ['#E8590C', '#2B6CB0', '#9C4DC7', '#38A169', '#D69E2E', '#E53E3E'];

export function ParticipantsListScreen() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { getEvent, getEventParticipants } = useFestipodData();
  const event = eventId ? getEvent(eventId) : undefined;
  const participants = eventId ? getEventParticipants(eventId) : [];

  const totalCount = event?.participantCount ?? participants.length;
  const unknownCount = Math.max(0, totalCount - participants.length);

  const rows = [
    ...participants.map((p, i) => ({
      key: p.id,
      initials: p.initials,
      name: p.name,
      username: p.username,
      color: COLORS[i % COLORS.length] ?? '#888',
      known: true,
    })),
    ...Array.from({ length: unknownCount }, (_, i) => ({
      key: `unknown-${i}`,
      initials: '?',
      name: '',
      username: '',
      color: '#ccc',
      known: false,
    })),
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title={`Participants (${totalCount})`}
        left={<ArrowLeft size={20} onClick={() => navigate(`/events/${eventId}`)} style={{ cursor: 'pointer' }} />}
      />

      <div style={{ padding: 16, borderBottom: '1px solid #f0f0f0' }}>
        <Input placeholder="Rechercher un participant..." />
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {rows.map((p) => (
          <div
            key={p.key}
            onClick={p.known ? () => navigate(`/users/${p.key}`) : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              cursor: p.known ? 'pointer' : 'default',
              borderBottom: '1px solid #f5f5f5',
            }}
          >
            <Avatar initials={p.initials} color={p.color} size="sm" />
            <div style={{ flex: 1 }}>
              {p.known ? (
                <>
                  <Text style={{ margin: 0, fontWeight: 'bold' }}>{p.name}</Text>
                  {p.username && (
                    <Text style={{ margin: 0, fontSize: 13, color: '#888' }}>{p.username}</Text>
                  )}
                </>
              ) : (
                <Text style={{ margin: 0, color: '#999' }}>Participant inconnu</Text>
              )}
            </div>
            {p.known && <Text style={{ margin: 0, fontSize: 20, color: '#ccc' }}>›</Text>}
          </div>
        ))}
      </div>
    </div>
  );
}
