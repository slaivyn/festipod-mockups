import React from 'react';
import { Header, Text, Button, Card, Divider, Avatar } from '../components/sketchy';
import type { ScreenProps } from './index';

export function ShareProfileScreen({ navigate }: ScreenProps) {
  const profileLink = 'festipod.app/u/mariedupont';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Partager mon profil"
        left={<span onClick={() => navigate('profile')} style={{ cursor: 'pointer' }}>←</span>}
      />

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        {/* QR Code */}
        <Card style={{ textAlign: 'center', padding: 24 }}>
          <div style={{
            width: 180,
            height: 180,
            margin: '0 auto 16px',
            border: '3px solid var(--sketch-black)',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--sketch-white)',
            position: 'relative',
          }}>
            {/* Simulated QR code pattern */}
            <div style={{
              width: 150,
              height: 150,
              background: `
                linear-gradient(90deg, var(--sketch-black) 10%, transparent 10%, transparent 20%, var(--sketch-black) 20%, var(--sketch-black) 30%, transparent 30%, transparent 40%, var(--sketch-black) 40%, var(--sketch-black) 50%, transparent 50%, transparent 60%, var(--sketch-black) 60%, var(--sketch-black) 70%, transparent 70%, transparent 80%, var(--sketch-black) 80%, var(--sketch-black) 90%, transparent 90%),
                linear-gradient(var(--sketch-black) 10%, transparent 10%, transparent 20%, var(--sketch-black) 20%, var(--sketch-black) 30%, transparent 30%, transparent 40%, var(--sketch-black) 40%, var(--sketch-black) 50%, transparent 50%, transparent 60%, var(--sketch-black) 60%, var(--sketch-black) 70%, transparent 70%, transparent 80%, var(--sketch-black) 80%, var(--sketch-black) 90%, transparent 90%)
              `,
              backgroundSize: '15px 15px',
              opacity: 0.8,
            }} />
            {/* Center avatar */}
            <div style={{
              position: 'absolute',
              background: 'var(--sketch-white)',
              padding: 4,
              borderRadius: '50%',
            }}>
              <Avatar initials="MD" size="sm" />
            </div>
          </div>

          <Text className="user-content" style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>Marie Dupont</Text>
          <Text style={{ color: 'var(--sketch-gray)', margin: 0, fontSize: 14 }}>
            Scannez pour me retrouver sur Festipod
          </Text>
        </Card>

        <Divider />

        {/* Link section */}
        <Text style={{ fontWeight: 'bold', marginBottom: 12 }}>Mon lien de profil</Text>
        <Card style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Text style={{
            margin: 0,
            flex: 1,
            fontSize: 14,
            wordBreak: 'break-all',
          }}>
            {profileLink}
          </Text>
          <Button style={{ flexShrink: 0 }}>Copier</Button>
        </Card>

        <Divider />

        {/* Share action */}
        <Button variant="primary" style={{ width: '100%' }}>
          Partager
        </Button>

        <Divider />

        {/* Stats */}
        <Text style={{ fontWeight: 'bold', marginBottom: 12 }}>Statistiques de parrainage</Text>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
            <div>
              <Text style={{ fontWeight: 'bold', fontSize: 24, margin: 0, color: 'var(--sketch-black)' }}>12</Text>
              <Text style={{ fontSize: 12, color: 'var(--sketch-gray)', margin: 0 }}>
                Personnes parrainées
              </Text>
            </div>
            <div>
              <Text style={{ fontWeight: 'bold', fontSize: 24, margin: 0, color: 'var(--sketch-black)' }}>47</Text>
              <Text style={{ fontSize: 12, color: 'var(--sketch-gray)', margin: 0 }}>
                Scans du QR code
              </Text>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
