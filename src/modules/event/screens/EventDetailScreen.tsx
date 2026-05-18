import { ArrowLeft } from 'lucide-react';
import { Button, Avatar, EventCover, EventMeetingPoints, showToast, Text, type MeetingPointData } from '../../../shared/components/sketchy';
import { useFestipodData } from '../../../shared/context/FestipodDataContext';
import { useNavigate, useParams } from '../../../app/router';

export function EventDetailScreen() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const {
    getEvent,
    currentUserId,
    isParticipating,
    joinEvent,
    leaveEvent,
    getEventParticipants,
    getEventMeetingPoints,
  } = useFestipodData();

  const event = eventId ? getEvent(eventId) : undefined;
  const joined = eventId ? isParticipating(eventId) : false;
  const participants = eventId ? getEventParticipants(eventId) : [];
  const meetingPointsRaw = eventId ? getEventMeetingPoints(eventId) : [];

  const meetingPoints: MeetingPointData[] = meetingPointsRaw.map(mp => ({
    id: mp.id,
    title: mp.location,
    when: mp.time,
    duration: '~60 min',
    lieu: mp.location,
  }));

  const isOwner = true;
  const knownParticipants = participants.filter(p => p.id !== currentUserId);

  const handleToggleJoin = () => {
    if (!eventId) return;
    if (joined) {
      leaveEvent(eventId);
      showToast('Participation annulée', 'info');
    } else {
      joinEvent(eventId);
      showToast('Tu participes à cet événement', 'success');
    }
  };

  if (!event) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('/events')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}><ArrowLeft size={20} /></button>
          <span style={{ fontSize: 18, fontWeight: 700 }}>Événement</span>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Text>Événement non trouvé</Text>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('/events')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#333', padding: 0, display: 'flex', alignItems: 'center' }}><ArrowLeft size={20} /></button>
          <div style={{ flex: 1 }}>
            <div className="user-content" style={{ fontSize: 18, fontWeight: 700 }}>{event.title}</div>
            {event.distance != null && (
              <div style={{ fontSize: 12, color: '#888' }}>{event.distance} km</div>
            )}
          </div>
          {isOwner && (
            <span onClick={() => navigate(`/events/${eventId}/edit`)} style={{ cursor: 'pointer', fontSize: 18, color: '#888' }}>✎</span>
          )}
        </div>

        <div style={{ padding: '0 16px 12px' }}>
          <EventCover eventId={event.id} height={100} />
        </div>

        <div style={{ margin: '0 16px 12px', padding: 14, background: '#fafafa', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 15 }}>📅</span>
            <div>
              <div className="user-content" style={{ fontSize: 13, fontWeight: 600 }}>{event.date}</div>
              {event.startTime && (
                <div style={{ fontSize: 12, color: '#888' }}>
                  {event.startTime}{event.endTime ? ` – ${event.endTime}` : ''}
                </div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 15 }}>📍</span>
            <span className="user-content" style={{ fontSize: 13 }}>{event.location}</span>
          </div>
          {event.description && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 15 }}>📝</span>
              <span className="user-content" style={{ fontSize: 13, color: '#555', lineHeight: 1.5 }}>
                {event.description}
              </span>
            </div>
          )}
        </div>

        <div style={{ margin: '4px 16px 16px', display: 'flex', gap: 8 }}>
          <Button
            variant={joined ? 'green' : 'primary'}
            onClick={handleToggleJoin}
            style={{ flex: 1, padding: '12px 0' }}
          >
            {joined ? '✓ Je participe' : "J'y serai"}
          </Button>
          {joined && (
            <Button
              onClick={() => navigate(`/events/${eventId}/invite`)}
              style={{ flex: 1, padding: '12px 0' }}
            >
              Inviter
            </Button>
          )}
        </div>

        {meetingPoints.length > 0 && (
          <div style={{ padding: '0 16px 8px' }}>
            <EventMeetingPoints
              points={meetingPoints}
              joinedIds={new Set()}
              onToggle={() => {}}
              expanded
            />
          </div>
        )}

        <div style={{ padding: '0 16px 8px' }}>
          <button
            onClick={() => navigate(`/events/${eventId}/meeting-points`)}
            style={{ width: '100%', padding: 12, border: '2px dashed #ddd', borderRadius: 12, background: 'none', fontSize: 13, fontWeight: 600, color: '#999', cursor: 'pointer', marginTop: 4, fontFamily: 'var(--font-app)' }}
          >
            + Proposer un point de rencontre
          </button>
        </div>

        <div style={{ padding: '16px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            Participants ({event.participantCount})
          </div>
          {knownParticipants.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/users/${p.id}`)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f5f5f5', cursor: 'pointer' }}
            >
              <Avatar initials={p.initials} size={38} color="#2B6CB0" />
              <div style={{ flex: 1 }}>
                <div className="user-content" style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</div>
                {p.username && (
                  <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{p.username}</div>
                )}
              </div>
            </div>
          ))}
          {knownParticipants.length < event.participantCount && (
            <div
              style={{ marginTop: 12, padding: 12, background: '#f9f9f9', borderRadius: 12, textAlign: 'center', cursor: 'pointer' }}
              onClick={() => navigate(`/events/${eventId}/participants`)}
            >
              <span style={{ fontSize: 12, color: '#999' }}>Voir tous les participants →</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
