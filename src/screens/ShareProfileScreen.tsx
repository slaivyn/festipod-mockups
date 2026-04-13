import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Header, Text, Button, Card, Divider, Avatar } from '../components/sketchy';
import type { ScreenProps } from './index';

export function ShareProfileScreen({ navigate }: ScreenProps) {
  const profileLink = 'festipod.app/u/mariedupont';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Partager mon profil"
        left={<ArrowLeft size={20} onClick={() => navigate('profile')} style={{ cursor: 'pointer' }} />}
      />

      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        <Card style={{ textAlign: 'center', padding: 24 }}>
          <div style={{
            width: 180,
            height: 180,
            margin: '0 auto 16px',
            border: '2px solid #e0e0e0',
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fff',
            position: 'relative',
          }}>
            <div style={{
              width: 150,
              height: 150,
              background: `
                linear-gradient(90deg, #1a1a1a 10%, transparent 10%, transparent 20%, #1a1a1a 20%, #1a1a1a 30%, transparent 30%, transparent 40%, #1a1a1a 40%, #1a1a1a 50%, transparent 50%, transparent 60%, #1a1a1a 60%, #1a1a1a 70%, transparent 70%, transparent 80%, #1a1a1a 80%, #1a1a1a 90%, transparent 90%),
                linear-gradient(#1a1a1a 10%, transparent 10%, transparent 20%, #1a1a1a 20%, #1a1a1a 30%, transparent 30%, transparent 40%, #1a1a1a 40%, #1a1a1a 50%, transparent 50%, transparent 60%, #1a1a1a 60%, #1a1a1a 70%, transparent 70%, transparent 80%, #1a1a1a 80%, #1a1a1a 90%, transparent 90%)
              `,
              backgroundSize: '15px 15px',
              opacity: 0.8,
              borderRadius: 8,
            }} />
            <div style={{
              position: 'absolute',
              background: '#fff',
              padding: 4,
              borderRadius: '50%',
            }}>
              <Avatar name="Marie Dupont" color="#E8590C" size="sm" />
            </div>
          </div>

          <Text style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>Marie Dupont</Text>
          <Text style={{ color: '#888', margin: 0, fontSize: 14 }}>
            Scannez pour me retrouver sur Festipod
          </Text>
        </Card>

        <Divider />

        <Text style={{ fontWeight: 'bold', marginBottom: 12 }}>Mon lien de profil</Text>
        <Card style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Text style={{
            margin: 0,
            flex: 1,
            fontSize: 14,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: '#888',
          }}>
            {profileLink}
          </Text>
          <Button style={{ flexShrink: 0, padding: '8px 10px' }} title="Copier le lien">📋</Button>
          <Button variant="primary" style={{ flexShrink: 0, padding: '8px 10px' }} title="Partager">↗</Button>
        </Card>

        <Divider />

        <Text style={{ fontWeight: 'bold', marginBottom: 12 }}>Statistiques de parrainage</Text>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
            <div>
              <Text style={{ fontWeight: 'bold', fontSize: 24, margin: 0, color: '#E8590C' }}>12</Text>
              <Text style={{ fontSize: 12, color: '#888', margin: 0 }}>Personnes parrainées</Text>
            </div>
            <div>
              <Text style={{ fontWeight: 'bold', fontSize: 24, margin: 0, color: '#E8590C' }}>47</Text>
              <Text style={{ fontSize: 12, color: '#888', margin: 0 }}>Scans du QR code</Text>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
