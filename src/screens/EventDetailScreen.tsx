import React, { useState } from 'react';
import { Header, Title, Text, Button, Avatar, Placeholder, Divider } from '../components/sketchy';
import type { ScreenProps } from './index';

export function EventDetailScreen({ navigate }: ScreenProps) {
  const [isJoined, setIsJoined] = useState(false);

  const attendees = [
    { initials: 'MD', name: 'Marie' },
    { initials: 'PD', name: 'Pierre' },
    { initials: 'SL', name: 'Sophie' },
    { initials: 'TM', name: 'Thomas' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Événement"
        left={<span onClick={() => navigate('events')} style={{ cursor: 'pointer' }}>←</span>}
        right={<span style={{ cursor: 'pointer' }}>⋯</span>}
      />

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Cover image */}
        <Placeholder height={180} label="Photo de couverture" />

        <div style={{ padding: 16 }}>
          <Title className="user-content" style={{ marginBottom: 8 }}>Résidence Reconnexion</Title>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            <Text style={{ margin: 0, fontSize: 15 }}>
              📅 <span className="user-content">Lundi 16 - Vendredi 20 février 2026</span>
            </Text>
            <Text style={{ margin: 0, fontSize: 15 }}>
              🕓 <span className="user-content">Semaine complète (arrivée dimanche possible)</span>
            </Text>
            <Text style={{ margin: 0, fontSize: 15 }}>
              📍 <span className="user-content">Le Revel, Rogues (30)</span>
            </Text>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <Button
              variant={isJoined ? 'default' : 'primary'}
              onClick={() => setIsJoined(!isJoined)}
              style={{ flex: 1 }}
            >
              {isJoined ? '✓ Inscrit' : 'Participer'}
            </Button>
            <Button onClick={() => navigate('invite')}>Inviter</Button>
          </div>

          {isJoined && (
            <Button
              onClick={() => navigate('meeting-points')}
              style={{ width: '100%', marginBottom: 16 }}
            >
              📍 Points de rencontre
            </Button>
          )}

          <Divider />

          {/* Host */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Avatar initials="RC" />
            <div>
              <Text className="user-content" style={{ margin: 0, fontWeight: 'bold' }}>Reconnexion</Text>
              <Text style={{ margin: 0, fontSize: 14, color: 'var(--sketch-gray)' }}>Relayé par</Text>
            </div>
          </div>

          <Divider />

          {/* Description */}
          <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>À propos</Text>
          <Text className="user-content" style={{ lineHeight: 1.6 }}>
            Une semaine collaborative pour se rencontrer, co-créer et faire avancer le projet de Réseau Social Universel.
            Au programme : sessions plénières en intelligence collective, ateliers en forum ouvert, et randonnée
            au Cirque de Navacelles. Hébergement sur place au Revel, écolieu à Rogues dans le Gard.
          </Text>

          <Divider />

          {/* Attendees */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontWeight: 'bold', margin: 0 }}>Participants (24)</Text>
            <Text
              style={{ margin: 0, fontSize: 14, cursor: 'pointer' }}
              onClick={() => navigate('participants-list')}
            >
              Voir tout →
            </Text>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            {attendees.map((a, i) => (
              <div
                key={i}
                style={{ textAlign: 'center', cursor: 'pointer' }}
                onClick={() => navigate('user-profile')}
              >
                <Avatar initials={a.initials} size="sm" />
                <Text className="user-content" style={{ margin: '4px 0 0 0', fontSize: 12 }}>{a.name}</Text>
              </div>
            ))}
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
                +20
              </div>
              <Text style={{ margin: '4px 0 0 0', fontSize: 12 }}>autres</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
