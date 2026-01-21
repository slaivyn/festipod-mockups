import React from 'react';
import { Header, Text, Button, Card, Avatar, Input, Divider } from '../components/sketchy';
import type { ScreenProps } from './index';

export function MeetingPointsScreen({ navigate }: ScreenProps) {
  const meetingPoints = [
    {
      id: '1',
      location: 'Café de la Place',
      time: '30 min avant l\'événement',
      host: { initials: 'MD', name: 'Marie' },
      participants: 3,
    },
    {
      id: '2',
      location: 'Station de métro Bellecour',
      time: '15h30',
      host: { initials: 'JD', name: 'Jean' },
      participants: 5,
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
          Retrouvez d'autres participants avant l'événement pour y aller ensemble !
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
                <Text style={{ margin: 0, fontSize: 13 }}>
                  {mp.participants} participant{mp.participants > 1 ? 's' : ''} inscrit{mp.participants > 1 ? 's' : ''}
                </Text>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <Button variant="primary" style={{ flex: 1 }}>Rejoindre</Button>
              <Button style={{ flex: 1 }}>Voir les participants</Button>
            </div>
          </Card>
        ))}

        <Divider />

        {/* Create new meeting point */}
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

          <Button variant="primary" style={{ marginTop: 8 }}>
            Créer le point de rencontre
          </Button>
        </div>

        <Divider />

        {/* QR Code exchange section */}
        <Text style={{ fontWeight: 'bold', marginBottom: 12 }}>Échanger vos contacts</Text>
        <Text style={{ color: 'var(--sketch-gray)', marginBottom: 12, fontSize: 14 }}>
          Partagez votre QR code avec les autres participants pour rester en contact.
        </Text>

        <Card style={{ textAlign: 'center', padding: 20 }}>
          <div style={{
            width: 120,
            height: 120,
            margin: '0 auto 12px',
            border: '2px solid var(--sketch-black)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--sketch-white)',
          }}>
            <div style={{
              width: 100,
              height: 100,
              background: `
                repeating-linear-gradient(
                  0deg,
                  var(--sketch-black) 0px,
                  var(--sketch-black) 8px,
                  var(--sketch-white) 8px,
                  var(--sketch-white) 16px
                )
              `,
              opacity: 0.3,
            }} />
          </div>
          <Text style={{ margin: 0, fontWeight: 'bold' }}>Mon QR Code</Text>
          <Text style={{ margin: '4px 0 0 0', fontSize: 13, color: 'var(--sketch-gray)' }}>
            Scannez pour m'ajouter
          </Text>
        </Card>

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <Button style={{ flex: 1 }}>Scanner un QR</Button>
          <Button variant="primary" style={{ flex: 1 }}>Partager</Button>
          <Button style={{ flex: 1 }}>Copier le lien</Button>
        </div>
      </div>
    </div>
  );
}
