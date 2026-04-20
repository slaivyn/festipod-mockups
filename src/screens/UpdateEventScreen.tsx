import { Header, Text, Input, Button, Placeholder, showToast } from '../components/sketchy';
import type { ScreenProps } from './index';

export function UpdateEventScreen({ navigate }: ScreenProps) {
  const save = () => {
    showToast('Événement mis à jour', 'success');
    navigate('event-detail');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Modifier l'événement"
        left={<span onClick={() => navigate('event-detail')} style={{ cursor: 'pointer', fontSize: 18 }}>✕</span>}
      />

      <div style={{ flex: 1, padding: 16, overflow: 'auto' }}>
        <Placeholder
          height={140}
          label="Photo de couverture"
          style={{ marginBottom: 20, cursor: 'pointer' }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Nom de l'événement *</Text>
            <Input defaultValue="Résidence Reconnexion" />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Date de début *</Text>
              <Input type="date" defaultValue="2026-02-16" />
            </div>
            <div style={{ flex: 1 }}>
              <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Date de fin</Text>
              <Input type="date" defaultValue="2026-02-20" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Heure de début *</Text>
              <Input type="time" defaultValue="09:00" />
            </div>
            <div style={{ flex: 1 }}>
              <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Heure de fin</Text>
              <Input type="time" defaultValue="18:00" />
            </div>
          </div>

          <div>
            <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Lieu *</Text>
            <Input defaultValue="Le Revel, Rogues (30)" />
          </div>

          <div>
            <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Description</Text>
            <textarea
              className="app-input"
              defaultValue="Une semaine collaborative pour se rencontrer, co-créer et faire avancer le projet de Réseau Social Universel."
              rows={4}
              style={{ resize: 'none' }}
            />
          </div>
        </div>
      </div>

      <div style={{ padding: 16, borderTop: '1px solid #f0f0f0' }}>
        <Button
          variant="primary"
          style={{ width: '100%' }}
          onClick={save}
        >
          Enregistrer les modifications
        </Button>
      </div>
    </div>
  );
}
