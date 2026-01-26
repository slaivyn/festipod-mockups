import React from 'react';
import { Header, Text, Input, Button, Avatar } from '../components/sketchy';
import type { ScreenProps } from './index';

export function UpdateProfileScreen({ navigate }: ScreenProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Modifier le profil"
        left={<span onClick={() => navigate('profile')} style={{ cursor: 'pointer' }}>✕</span>}
      />

      {/* Content */}
      <div style={{ flex: 1, padding: 16, overflow: 'auto' }}>
        {/* Photo */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Avatar initials="MD" size="lg" />
          <Button style={{ marginTop: 12 }}>
            Changer la photo
          </Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <Text style={{ marginBottom: 6, fontSize: 14 }}>Prénom *</Text>
            <Input defaultValue="Marie" />
          </div>

          <div>
            <Text style={{ marginBottom: 6, fontSize: 14 }}>Nom *</Text>
            <Input defaultValue="Dupont" />
          </div>

          <div>
            <Text style={{ marginBottom: 6, fontSize: 14 }}>Pseudo</Text>
            <Input defaultValue="@mariedupont" />
          </div>

          <div>
            <Text style={{ marginBottom: 6, fontSize: 14 }}>Localisation</Text>
            <Input defaultValue="Lyon, France" placeholder="Ville, Pays" />
          </div>

          <div>
            <Text style={{ marginBottom: 6, fontSize: 14 }}>Bio</Text>
            <textarea
              className="sketchy-input"
              defaultValue="Passionnée de transition écologique et de rencontres humaines."
              rows={3}
              style={{ resize: 'none' }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: 16, borderTop: '2px solid var(--sketch-black)' }}>
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
