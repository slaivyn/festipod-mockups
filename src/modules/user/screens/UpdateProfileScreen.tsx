import React, { useState } from 'react';
import { Header, Text, Input, Button, Avatar, showToast } from '../../../shared/components/sketchy';
import { useFestipodData } from '../../../shared/context/FestipodDataContext';
import { useNavigate } from '../../../app/router';

export function UpdateProfileScreen() {
  const navigate = useNavigate();
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
    updateProfile({ name: fullName, initials, username, city, bio });
    showToast('Profil mis à jour', 'success');
    navigate('/profile');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Modifier le profil"
        left={<span onClick={() => navigate('/profile')} style={{ cursor: 'pointer', fontSize: 18 }}>✕</span>}
      />

      <div style={{ flex: 1, padding: 16, overflow: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Avatar initials={user?.initials ?? '?'} color="#E8590C" size="lg" />
          <Button style={{ marginTop: 12 }}>
            Changer la photo
          </Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Prénom *</Text>
            <Input value={firstName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)} />
          </div>

          <div>
            <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Nom *</Text>
            <Input value={lastName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)} />
          </div>

          <div>
            <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Pseudo</Text>
            <Input value={username} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} />
          </div>

          <div>
            <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Localisation</Text>
            <Input value={city} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value)} placeholder="Ville, Pays" />
          </div>

          <div>
            <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Bio</Text>
            <textarea
              className="app-input"
              value={bio}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
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
          onClick={handleSave}
        >
          Enregistrer
        </Button>
      </div>
    </div>
  );
}
