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
          <Title className="user-content" style={{ marginBottom: 8 }}>Barbecue d'été</Title>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            <Text style={{ margin: 0, fontSize: 15 }}>
              📅 <span className="user-content">Samedi 25 janvier 2025</span>
            </Text>
            <Text style={{ margin: 0, fontSize: 15 }}>
              🕓 <span className="user-content">16h00 - 21h00</span>
            </Text>
            <Text style={{ margin: 0, fontSize: 15 }}>
              📍 <span className="user-content">Parc Central, Pelouse Ouest</span>
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
            <Avatar initials="MD" />
            <div>
              <Text className="user-content" style={{ margin: 0, fontWeight: 'bold' }}>Marie Dupont</Text>
              <Text style={{ margin: 0, fontSize: 14, color: 'var(--sketch-gray)' }}>Organisateur</Text>
            </div>
          </div>

          <Divider />

          {/* Description */}
          <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>À propos</Text>
          <Text className="user-content" style={{ lineHeight: 1.6 }}>
            Rejoignez-nous pour un super barbecue d'été ! Au menu : burgers, saucisses, options végé
            et plein de boissons. Apportez votre plat préféré à partager. Jeux et musique assurés !
          </Text>

          <Divider />

          {/* Attendees */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontWeight: 'bold', margin: 0 }}>Participants (12)</Text>
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
                +8
              </div>
              <Text style={{ margin: '4px 0 0 0', fontSize: 12 }}>autres</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
