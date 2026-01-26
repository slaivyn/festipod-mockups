import React, { useState } from 'react';
import { Header, Text, Button, Card, Avatar, Input, Divider } from '../components/sketchy';
import type { ScreenProps } from './index';

export function MeetingPointsScreen({ navigate }: ScreenProps) {
  const [showForm, setShowForm] = useState(false);
  const meetingPoints = [
    {
      id: '1',
      location: 'Café de la Place',
      time: '30 min avant l\'événement',
      host: { initials: 'MD', name: 'Marie' },
    },
    {
      id: '2',
      location: 'Station de métro Bellecour',
      time: '15h30',
      host: { initials: 'JD', name: 'Jean' },
    },
  ];

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
              <Avatar initials={mp.host.initials} size="sm" />
              <div style={{ flex: 1 }}>
                <Text className="user-content" style={{ margin: 0, fontWeight: 'bold' }}>{mp.location}</Text>
                <Text style={{ margin: '4px 0', fontSize: 14, color: 'var(--sketch-gray)' }}>
                  <span className="user-content">{mp.time}</span> · Proposé par <span className="user-content">{mp.host.name}</span>
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
                <Input placeholder="Ex: Café de la Gare, Entrée du parc..." />
              </div>

              <div>
                <Text style={{ marginBottom: 6, fontSize: 14 }}>Heure</Text>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button style={{ flex: 1 }}>30 min avant</Button>
                  <Button variant="primary" style={{ flex: 1 }}>1h avant</Button>
                  <Button style={{ flex: 1 }}>Personnalisé</Button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <Button style={{ flex: 1 }} onClick={() => setShowForm(false)}>Annuler</Button>
                <Button variant="primary" style={{ flex: 1 }}>
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
