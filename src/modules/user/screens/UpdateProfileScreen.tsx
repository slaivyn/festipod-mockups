import React, { useState } from 'react';
import { Header, Text, Input, Button, Avatar } from '../../../shared/components/sketchy';
import { useFestipodData } from '../../../shared/context/FestipodDataContext';
import type { ScreenProps } from '../../../screens';

export function UpdateProfileScreen({ navigate }: ScreenProps) {
  const { currentUser, updateProfile } = useFestipodData();
  const user = currentUser;

  const nameParts = (user?.name ?? '').split(' ');
  const [firstName, setFirstName] = useState(nameParts[0] ?? '');
  const [lastName, setLastName] = useState(nameParts.slice(1).join(' '));
  const [username, setUsername] = useState(user?.username ?? '');
  const [city, setCity] = useState(user?.city ?? 'Lyon, France');
  const [bio, setBio] = useState(user?.bio ?? '');

  const handleSave = () => {
    const fullName = `${firstName} ${lastName}`.trim();
    const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
    updateProfile({
      name: fullName,
      initials,
      username,
      city,
      bio,
    });
    navigate('profile');
  };

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
          <Avatar initials={user?.initials ?? '?'} size="lg" />
          <Button style={{ marginTop: 12 }}>
            Changer la photo
          </Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <Text style={{ marginBottom: 6, fontSize: 14 }}>Prénom *</Text>
            <Input value={firstName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)} />
          </div>

          <div>
            <Text style={{ marginBottom: 6, fontSize: 14 }}>Nom *</Text>
            <Input value={lastName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)} />
          </div>

          <div>
            <Text style={{ marginBottom: 6, fontSize: 14 }}>Pseudo</Text>
            <Input value={username} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} />
          </div>

          <div>
            <Text style={{ marginBottom: 6, fontSize: 14 }}>Localisation</Text>
            <Input value={city} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value)} placeholder="Ville, Pays" />
          </div>

          <div>
            <Text style={{ marginBottom: 6, fontSize: 14 }}>Bio</Text>
            <textarea
              className="sketchy-input"
              value={bio}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
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
          onClick={handleSave}
        >
          Enregistrer
        </Button>
      </div>
    </div>
  );
}
