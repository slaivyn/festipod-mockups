import React, { useState } from 'react';
import { Button, Input } from '../components/sketchy';
import type { ScreenProps } from './index';

const subjects = ['gouvernance coopérative', 'communs numériques', 'habitat participatif', 'financement', 'low-tech'];

export function IntentionScreen({ navigate }: ScreenProps) {
  const [selectedSubject, setSelectedSubject] = useState('gouvernance coopérative');
  const [precision, setPrecision] = useState('');
  const [visibility, setVisibility] = useState(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('event-detail')} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#333', padding: 0 }}>‹</button>
          <span style={{ fontSize: 17, fontWeight: 700 }}>Déclarer une intention</span>
        </div>
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 16, lineHeight: 1.5 }}>
            Qu'aimeriez-vous avancer pendant cet événement ? Vos connexions et les profils publics pourront le voir.
          </div>

          <label style={{ fontSize: 12, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: 0.8 }}>Sujet</label>
          <div style={{ marginTop: 6, marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {subjects.map(s => (
              <button key={s} onClick={() => setSelectedSubject(s)} style={{
                padding: '8px 14px',
                borderRadius: 20,
                border: selectedSubject === s ? '2px solid #E8590C' : '1.5px solid #ddd',
                background: selectedSubject === s ? '#FFF7ED' : '#fff',
                fontSize: 13,
                cursor: 'pointer',
                color: selectedSubject === s ? '#E8590C' : '#666',
                fontWeight: selectedSubject === s ? 600 : 400,
                fontFamily: 'var(--font-app)',
              }}>
                {s}
              </button>
            ))}
            <button style={{ padding: '8px 14px', borderRadius: 20, border: '1.5px dashed #ccc', background: '#fff', fontSize: 13, cursor: 'pointer', color: '#999', fontFamily: 'var(--font-app)' }}>+ autre</button>
          </div>

          <label style={{ fontSize: 12, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: 0.8 }}>Précision (optionnel)</label>
          <Input
            value={precision}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrecision(e.target.value)}
            placeholder={'Ex : "Cherche retours d\'expérience SCIC"'}
            style={{ marginTop: 6, marginBottom: 20 }}
          />

          <label style={{ fontSize: 12, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: 0.8 }}>Visibilité</label>
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Mes connexions uniquement', idx: 0 },
              { label: 'Connexions + profils publics', idx: 1 },
            ].map((v) => (
              <div key={v.idx} onClick={() => setVisibility(v.idx)} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                border: visibility === v.idx ? '2px solid #E8590C' : '1.5px solid #e0e0e0',
                borderRadius: 12,
                background: visibility === v.idx ? '#FFF7ED' : '#fff',
                cursor: 'pointer',
              }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: visibility === v.idx ? '5px solid #E8590C' : '2px solid #ccc', boxSizing: 'border-box' }} />
                <span style={{ fontSize: 13.5, fontWeight: visibility === v.idx ? 600 : 400, color: visibility === v.idx ? '#1a1a1a' : '#666' }}>{v.label}</span>
              </div>
            ))}
          </div>

          <Button
            variant="primary"
            style={{ width: '100%', marginTop: 24, padding: 14, fontSize: 15 }}
            onClick={() => navigate('event-detail')}
          >
            Publier l'intention
          </Button>
        </div>
      </div>
    </div>
  );
}
