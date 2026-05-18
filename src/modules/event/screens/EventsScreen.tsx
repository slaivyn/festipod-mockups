import { ArrowLeft } from 'lucide-react';
import { Header, Input, Card, Badge, BottomNav, AvatarStack, getEventPhotoUrl, Text } from '../../../shared/components/sketchy';
import { useFestipodData } from '../../../shared/context/FestipodDataContext';
import { useNavigate } from '../../../app/router';

const PEOPLE = [
  { name: 'Marie Leroy', color: '#E8590C' },
  { name: 'Jean Morel', color: '#2B6CB0' },
  { name: 'Alice Duval', color: '#9C4DC7' },
  { name: 'Thomas Bazin', color: '#38A169' },
  { name: 'Camille Noir', color: '#D69E2E' },
];

const EVENT_COLORS = ['#E8590C', '#2B6CB0', '#9C4DC7', '#38A169', '#D69E2E'];

function EventCard({
  event,
  onClick,
}: {
  event: { id: string; title: string; date: string; location: string; distance?: number; participantCount: number };
  onClick: () => void;
}) {
  const color = EVENT_COLORS[Number(event.id.replace(/\D/g, '') || 0) % EVENT_COLORS.length] ?? '#E8590C';
  const people = PEOPLE.slice(0, Math.min(5, Math.max(1, event.participantCount)));
  return (
    <Card onClick={onClick} style={{ marginBottom: 12, padding: 0, overflow: 'hidden' }} accentColor={color}>
      <div
        style={{
          height: 100,
          backgroundImage: `url(${getEventPhotoUrl(event.id)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div style={{ padding: 14 }}>
        <div className="user-content" style={{ fontSize: 15.5, fontWeight: 700, lineHeight: 1.3, marginBottom: 6 }}>{event.title}</div>
        <div style={{ fontSize: 12.5, color: '#888', marginBottom: 10 }}>
          {event.date} · {event.location}{event.distance != null && ` · ${event.distance} km`}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <AvatarStack people={people} size={26} />
            <span style={{ fontSize: 12, color: '#666' }}>{event.participantCount} inscrits</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function EventsScreen() {
  const navigate = useNavigate();
  const { events } = useFestipodData();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Découvrir"
        left={<ArrowLeft size={20} onClick={() => navigate('/home')} style={{ cursor: 'pointer' }} />}
      />

      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <Input placeholder="Rechercher un événement..." />
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <Badge style={{ background: '#1a1a1a', color: '#fff' }}>Tous</Badge>
        <Badge>Cette semaine</Badge>
        <Badge>Proches</Badge>
        <Badge>Amis</Badge>
      </div>

      <div style={{ flex: 1, padding: 16, overflow: 'auto' }}>
        {events.length === 0 && (
          <Text style={{ textAlign: 'center', color: '#888', marginTop: 32 }}>
            Aucun événement à afficher
          </Text>
        )}
        {events.map(event => (
          <EventCard key={event.id} event={event} onClick={() => navigate(`/events/${event.id}`)} />
        ))}
      </div>

      <BottomNav active="discover" />
    </div>
  );
}
