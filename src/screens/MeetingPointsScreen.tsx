import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button, Avatar, Input, showToast } from '../components/sketchy';
import type { ScreenProps } from './index';

const PEOPLE = [
  { name: 'Marie Leroy', color: '#E8590C' },
  { name: 'Jean Morel', color: '#2B6CB0' },
  { name: 'Alice Duval', color: '#9C4DC7' },
];

export function MeetingPointsScreen({ navigate }: ScreenProps) {
  const [title, setTitle] = useState('');
  const [when, setWhen] = useState('');
  const [duration, setDuration] = useState('~30 min');
  const [lieu, setLieu] = useState('');
  const [invited, setInvited] = useState<number[]>([0, 1, 2]);

  const removeInvited = (idx: number) => {
    setInvited(invited.filter(i => i !== idx));
  };

  const submit = () => {
    showToast(title ? `Point de rencontre créé : ${title}` : 'Point de rencontre créé', 'success');
    navigate('event-detail');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate('event-detail')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#333', padding: 0, display: 'flex', alignItems: 'center' }}><ArrowLeft size={20} /></button>
        <span style={{ fontSize: 17, fontWeight: 700 }}>Point de rencontre</span>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 20, lineHeight: 1.5 }}>
          Un moment de rencontre autour de l'événement. Un titre peut signaler une intention ; laissez-le vide pour un moment informel.
        </div>

        <label style={{ fontSize: 12, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 6 }}>Titre (optionnel)</label>
        <Input
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          placeholder="Ex : Gouvernance coopérative — retours SCIC"
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
              <Avatar name={PEOPLE[idx]!.name} color={PEOPLE[idx]!.color} size={22} />
              <span style={{ fontSize: 12, fontWeight: 500 }}>{PEOPLE[idx]!.name.split(' ')[0]}</span>
              <span onClick={() => removeInvited(idx)} style={{ fontSize: 14, color: '#bbb', cursor: 'pointer' }}>×</span>
            </div>
          ))}
          <button style={{ padding: '6px 14px', borderRadius: 20, border: '1.5px dashed #ccc', background: 'none', fontSize: 12, cursor: 'pointer', color: '#999', fontFamily: 'var(--font-app)' }}>+ ajouter</button>
        </div>

        <Button
          variant="primary"
          style={{ width: '100%', padding: 14, fontSize: 15 }}
          onClick={submit}
        >
          Créer le point de rencontre
        </Button>
      </div>
    </div>
  );
}
