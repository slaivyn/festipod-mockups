import React, { useState } from 'react';
import { Header, Text, Button, Card, Avatar, Input, Divider } from '../../../shared/components/sketchy';
import { useFestipodData } from '../../../shared/context/FestipodDataContext';
import type { ScreenProps } from '../../../screens';

export function MeetingPointsScreen({ navigate }: ScreenProps) {
  const { selectedEventId, getEventMeetingPoints, addMeetingPoint, currentUser } = useFestipodData();
  const meetingPoints = getEventMeetingPoints(selectedEventId);

  const [showForm, setShowForm] = useState(false);
  const [mpLocation, setMpLocation] = useState('');
  const [mpTime, setMpTime] = useState('1h avant');

  const handleCreate = () => {
    if (!mpLocation.trim()) return;
    addMeetingPoint({
      eventId: selectedEventId,
      location: mpLocation,
      time: mpTime,
      hostName: currentUser?.name?.split(' ')[0] ?? 'Moi',
      hostInitials: currentUser?.initials ?? '?',
    });
    setMpLocation('');
    setMpTime('1h avant');
    setShowForm(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Points de rencontre"
        left={<span onClick={() => navigate('event-detail')} style={{ cursor: 'pointer' }}>←</span>}
      />

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        <Text style={{ color: 'var(--sketch-gray)', marginBottom: 16 }}>
          Proposez un lieu de rendez-vous pour y aller ensemble !
        </Text>

        {/* Existing meeting points */}
        {meetingPoints.map((mp) => (
          <Card key={mp.id} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <Avatar initials={mp.hostInitials} size="sm" />
              <div style={{ flex: 1 }}>
                <Text className="user-content" style={{ margin: 0, fontWeight: 'bold' }}>{mp.location}</Text>
                <Text style={{ margin: '4px 0', fontSize: 14, color: 'var(--sketch-gray)' }}>
                  <span className="user-content">{mp.time}</span> · Proposé par <span className="user-content">{mp.hostName}</span>
                </Text>
              </div>
            </div>
          </Card>
        ))}

        <Divider />

        {/* Create new meeting point */}
        {!showForm ? (
          <Button variant="primary" style={{ width: '100%' }} onClick={() => setShowForm(true)}>
            + Proposer un point de rencontre
          </Button>
        ) : (
          <>
            <Text style={{ fontWeight: 'bold', marginBottom: 12 }}>Proposer un point de rencontre</Text>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <Text style={{ marginBottom: 6, fontSize: 14 }}>Lieu</Text>
                <Input
                  placeholder="Ex: Café de la Gare, Entrée du parc..."
                  value={mpLocation}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMpLocation(e.target.value)}
                />
              </div>

              <div>
                <Text style={{ marginBottom: 6, fontSize: 14 }}>Heure</Text>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button
                    style={{ flex: 1 }}
                    variant={mpTime === '30 min avant' ? 'primary' : 'default'}
                    onClick={() => setMpTime('30 min avant')}
                  >
                    30 min avant
                  </Button>
                  <Button
                    variant={mpTime === '1h avant' ? 'primary' : 'default'}
                    style={{ flex: 1 }}
                    onClick={() => setMpTime('1h avant')}
                  >
                    1h avant
                  </Button>
                  <Button
                    style={{ flex: 1 }}
                    variant={mpTime !== '30 min avant' && mpTime !== '1h avant' ? 'primary' : 'default'}
                    onClick={() => setMpTime('Personnalisé')}
                  >
                    Personnalisé
                  </Button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <Button style={{ flex: 1 }} onClick={() => setShowForm(false)}>Annuler</Button>
                <Button variant="primary" style={{ flex: 1 }} onClick={handleCreate}>
                  Créer le point de rencontre
                </Button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
