import React from 'react';
import { Header, Title, Text, Button, Avatar, Placeholder, Divider } from '../../../shared/components/sketchy';
import { useFestipodData } from '../../../shared/context/FestipodDataContext';
import type { ScreenProps } from '../../../screens';

export function EventDetailScreen({ navigate }: ScreenProps) {
  const {
    selectedEvent,
    selectedEventId,
    currentUserId,
    isParticipating,
    joinEvent,
    leaveEvent,
    getEventParticipants,
    setSelectedUserId,
  } = useFestipodData();

  const event = selectedEvent;
  const joined = isParticipating(selectedEventId);
  const participants = getEventParticipants(selectedEventId);

  // In a real app, this would come from comparing current user with event creator
  const isOwner = true;

  const knownParticipants = participants.filter(p => p.id !== currentUserId);
  const unknownCount = Math.max(0, (event?.participantCount ?? 0) - participants.length);

  const handleToggleJoin = () => {
    if (joined) {
      leaveEvent(selectedEventId);
    } else {
      joinEvent(selectedEventId);
    }
  };

  if (!event) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Header
          title="Événement"
          left={<span onClick={() => navigate('events')} style={{ cursor: 'pointer' }}>←</span>}
        />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Text>Événement non trouvé</Text>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Événement"
        left={<span onClick={() => navigate('events')} style={{ cursor: 'pointer' }}>←</span>}
        right={isOwner && <span onClick={() => navigate('update-event')} style={{ cursor: 'pointer' }}>✎</span>}
      />

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Cover image */}
        <Placeholder height={180} label="Photo de couverture" />

        <div style={{ padding: 16 }}>
          <Title className="user-content" style={{ marginBottom: 8 }}>{event.title}</Title>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            <Text style={{ margin: 0, fontSize: 15 }}>
              📅 <span className="user-content">{event.date}</span>
            </Text>
            {event.startTime && (
              <Text style={{ margin: 0, fontSize: 15 }}>
                🕓 <span className="user-content">{event.startTime}{event.endTime ? ` - ${event.endTime}` : ''}</span>
              </Text>
            )}
            <Text style={{ margin: 0, fontSize: 15 }}>
              📍 <span className="user-content">{event.location}</span>
              {event.distance != null && (
                <span style={{ color: 'var(--sketch-gray)' }}> · {event.distance} km</span>
              )}
            </Text>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <Button
              variant={joined ? 'default' : 'primary'}
              onClick={handleToggleJoin}
              style={{ flex: 1 }}
            >
              {joined ? '✓ Inscrit' : 'Participer'}
            </Button>
            <Button onClick={() => navigate('invite')}>Inviter</Button>
          </div>

          {joined && (
            <Button
              onClick={() => navigate('meeting-points')}
              style={{ width: '100%', marginBottom: 16 }}
            >
              📍 Points de rencontre
            </Button>
          )}

          <Divider />

          {/* Host */}
          {event.hostName && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <Avatar initials={event.hostInitials || event.hostName.substring(0, 2).toUpperCase()} />
                <div>
                  <Text className="user-content" style={{ margin: 0, fontWeight: 'bold' }}>{event.hostName}</Text>
                  <Text style={{ margin: 0, fontSize: 14, color: 'var(--sketch-gray)' }}>Relayé par</Text>
                </div>
              </div>
              <Divider />
            </>
          )}

          {/* Description */}
          <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>À propos</Text>
          <Text className="user-content" style={{ lineHeight: 1.6 }}>
            {event.description}
          </Text>

          <Divider />

          {/* Attendees */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontWeight: 'bold', margin: 0 }}>Participants ({event.participantCount})</Text>
            <Text
              style={{ margin: 0, fontSize: 14, cursor: 'pointer' }}
              onClick={() => navigate('participants-list')}
            >
              Voir tout →
            </Text>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            {knownParticipants.slice(0, 3).map((p) => (
              <div
                key={p.id}
                style={{ textAlign: 'center', cursor: 'pointer' }}
                onClick={() => { setSelectedUserId(p.id); navigate('user-profile'); }}
              >
                <Avatar initials={p.initials} size="sm" />
                <Text className="user-content" style={{ margin: '4px 0 0 0', fontSize: 12 }}>{p.name.split(' ')[0]}</Text>
              </div>
            ))}
            {unknownCount > 0 && (
              <div
                style={{ textAlign: 'center', cursor: 'pointer' }}
                onClick={() => navigate('participants-list')}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'var(--sketch-light-gray)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                }}>
                  +{unknownCount}
                </div>
                <Text style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--sketch-gray)' }}>inconnus</Text>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
