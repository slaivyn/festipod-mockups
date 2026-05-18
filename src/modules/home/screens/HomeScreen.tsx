import { useState } from 'react';
import { Title, Card, AvatarStack, BottomNav, EventCover, EventMeetingPoints, type MeetingPointData } from '../../../shared/components/sketchy';
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

function EventCardBody({
  event,
  joinedIds,
  onToggle,
  onClick,
  isOngoing = false,
}: {
  event: { id: string; title: string; date: string; location: string; meetingPoints?: MeetingPointData[] };
  joinedIds: Set<string>;
  onToggle: (id: string) => void;
  onClick: () => void;
  isOngoing?: boolean;
}) {
  const color = EVENT_COLORS[Number(event.id.replace(/\D/g, '') || 0) % EVENT_COLORS.length] ?? '#E8590C';
  const borderStyle = isOngoing ? '2px solid #c6f6d5' : undefined;
  const meetingPoints = event.meetingPoints ?? [];
  return (
    <Card
      onClick={onClick}
      style={{ marginBottom: 14, padding: 0, overflow: 'hidden', border: borderStyle }}
      accentColor={color}
    >
      <EventCover eventId={event.id} height={110} borderRadius={0} />
      <div style={{ padding: 14 }}>
        <div className="user-content" style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
          {event.title}
        </div>
        <div style={{ fontSize: 12.5, color: '#888', marginBottom: 10 }}>
          {event.date} · {event.location}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <AvatarStack people={PEOPLE} size={26} />
          <span style={{ fontSize: 12, color: '#666' }}>
            {PEOPLE.length} {isOngoing ? 'connexions présentes' : 'connexions'}
          </span>
        </div>

        {meetingPoints.length > 0 && (
          <EventMeetingPoints
            points={meetingPoints}
            joinedIds={joinedIds}
            onToggle={(id) => onToggle(id)}
          />
        )}
      </div>
    </Card>
  );
}

export function HomeScreen() {
  const navigate = useNavigate();
  const { getUserEvents, currentUserId, getEventMeetingPoints } = useFestipodData();
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());

  const myEvents = getUserEvents(currentUserId);
  const ongoing = myEvents.slice(0, 1);
  const upcoming = myEvents.slice(1, 4);

  const toggle = (id: string) => {
    setJoinedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const withMeetingPoints = (event: { id: string; title: string; date: string; location: string }) => ({
    ...event,
    meetingPoints: getEventMeetingPoints(event.id).map(mp => ({
      id: mp.id,
      title: mp.location,
      when: mp.time,
      duration: '~60 min',
      lieu: mp.location,
    })),
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ padding: '12px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title style={{ margin: 0 }}>Festipod</Title>
          <button
            onClick={() => navigate('/events/new')}
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
          {ongoing.length > 0 && (
            <>
              <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#22543D', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#38A169', display: 'inline-block' }} />
                En cours
              </div>

              {ongoing.map(event => (
                <EventCardBody
                  key={event.id}
                  event={withMeetingPoints(event)}
                  joinedIds={joinedIds}
                  onToggle={toggle}
                  onClick={() => navigate(`/events/${event.id}`)}
                  isOngoing
                />
              ))}
            </>
          )}

          {upcoming.length > 0 && (
            <>
              <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#E8590C', margin: '20px 0 10px' }}>
                À venir
              </div>

              {upcoming.map(event => (
                <EventCardBody
                  key={event.id}
                  event={withMeetingPoints(event)}
                  joinedIds={joinedIds}
                  onToggle={toggle}
                  onClick={() => navigate(`/events/${event.id}`)}
                />
              ))}
            </>
          )}
        </div>
        <div style={{ height: 8 }} />
      </div>

      <BottomNav active="home" />
    </div>
  );
}
