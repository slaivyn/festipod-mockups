import React from 'react';
import { Header, Text, Input, Button, Avatar } from '../components/sketchy';
import type { ScreenProps } from './index';

export function UpdateProfileScreen({ navigate }: ScreenProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Modifier le profil"
        left={<span onClick={() => navigate('profile')} style={{ cursor: 'pointer', fontSize: 18 }}>✕</span>}
      />

      <div style={{ flex: 1, padding: 16, overflow: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Avatar name="Marie Dupont" color="#E8590C" size="lg" />
          <Button style={{ marginTop: 12 }}>
            Changer la photo
          </Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Prénom *</Text>
            <Input defaultValue="Marie" />
          </div>

          <div>
            <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Nom *</Text>
            <Input defaultValue="Dupont" />
          </div>

          <div>
            <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Pseudo</Text>
            <Input defaultValue="@mariedupont" />
          </div>

          <div>
            <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Localisation</Text>
            <Input defaultValue="Lyon, France" placeholder="Ville, Pays" />
          </div>

          <div>
            <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Bio</Text>
            <textarea
              className="app-input"
              defaultValue="Passionnée de transition écologique et de rencontres humaines."
              rows={3}
              style={{ resize: 'none' }}
            />
          </div>
        </div>
      </div>

      <div style={{ padding: 16, borderTop: '1px solid #f0f0f0' }}>
        <Button
          variant="primary"
          style={{ width: '100%' }}
          onClick={() => navigate('profile')}
        >
          Enregistrer
        </Button>
      </div>
    </div>
  );
}
