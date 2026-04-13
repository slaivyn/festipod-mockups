import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Text, Button, Avatar, Input } from '../components/sketchy';
import type { ScreenProps } from './index';

const PEOPLE = [
  { name: 'Marie Leroy', color: '#E8590C' },
  { name: 'Jean Morel', color: '#2B6CB0' },
  { name: 'Alice Duval', color: '#9C4DC7' },
];

export function MeetingPointsScreen({ navigate }: ScreenProps) {
  const [type, setType] = useState<'intentionnel' | 'informel'>('intentionnel');
  const [title, setTitle] = useState('');
  const [when, setWhen] = useState('');
  const [duration, setDuration] = useState('~30 min');
  const [lieu, setLieu] = useState('');
  const [invited, setInvited] = useState<number[]>([0, 1, 2]);

  const removeInvited = (idx: number) => {
    setInvited(invited.filter(i => i !== idx));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate('event-detail')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#333', padding: 0, display: 'flex', alignItems: 'center' }}><ArrowLeft size={20} /></button>
        <span style={{ fontSize: 17, fontWeight: 700 }}>Point de rencontre</span>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 20, lineHeight: 1.5 }}>
          Un moment de rencontre autour de l'événement. Avec ou sans intention précise.
        </div>

        {/* Type selector */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <div
            onClick={() => setType('intentionnel')}
            style={{
              flex: 1, padding: 14, borderRadius: 14, textAlign: 'center', cursor: 'pointer',
              border: type === 'intentionnel' ? '2px solid #E8590C' : '1.5px solid #e0e0e0',
              background: type === 'intentionnel' ? '#FFF7ED' : '#fff',
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 4 }}>🎯</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: type === 'intentionnel' ? '#C05621' : '#666' }}>Intentionnel</div>
            <div style={{ fontSize: 11, color: type === 'intentionnel' ? '#C05621' : '#999', marginTop: 2 }}>Un sujet précis</div>
          </div>
          <div
            onClick={() => setType('informel')}
            style={{
              flex: 1, padding: 14, borderRadius: 14, textAlign: 'center', cursor: 'pointer',
              border: type === 'informel' ? '2px solid #E8590C' : '1.5px solid #e0e0e0',
              background: type === 'informel' ? '#FFF7ED' : '#fff',
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 4 }}>☕</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: type === 'informel' ? '#C05621' : '#666' }}>Informel</div>
            <div style={{ fontSize: 11, color: type === 'informel' ? '#C05621' : '#999', marginTop: 2 }}>Café, apéro...</div>
          </div>
        </div>

        <label style={{ fontSize: 12, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 6 }}>Titre</label>
        <Input
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          placeholder={type === 'intentionnel' ? 'Ex : Gouvernance coopérative : retours SCIC' : 'Ex : Café d\'accueil'}
          style={{ marginBottom: 16 }}
        />

        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 6 }}>Quand</label>
            <Input
              value={when}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWhen(e.target.value)}
              placeholder="Ven. 22 · 9h00"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 6 }}>Durée</label>
            <Input
              value={duration}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDuration(e.target.value)}
              placeholder="~30 min"
            />
          </div>
        </div>

        <label style={{ fontSize: 12, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 6 }}>Lieu</label>
        <Input
          value={lieu}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLieu(e.target.value)}
          placeholder="Café en face du tiers-lieu"
          style={{ marginBottom: 16 }}
        />

        <label style={{ fontSize: 12, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 8 }}>Inviter</label>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
          {invited.map((idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px 6px 6px', borderRadius: 20, background: '#f5f5f5' }}>
              <Avatar name={PEOPLE[idx].name} color={PEOPLE[idx].color} size={22} />
              <span style={{ fontSize: 12, fontWeight: 500 }}>{PEOPLE[idx].name.split(' ')[0]}</span>
              <span onClick={() => removeInvited(idx)} style={{ fontSize: 14, color: '#bbb', cursor: 'pointer' }}>×</span>
            </div>
          ))}
          <button style={{ padding: '6px 14px', borderRadius: 20, border: '1.5px dashed #ccc', background: 'none', fontSize: 12, cursor: 'pointer', color: '#999', fontFamily: 'var(--font-app)' }}>+ ajouter</button>
        </div>

        <Button
          variant="primary"
          style={{ width: '100%', padding: 14, fontSize: 15 }}
          onClick={() => navigate('event-detail')}
        >
          Créer le point de rencontre
        </Button>
      </div>
    </div>
  );
}
