import React from 'react';
import { Header, Text, Input, Button, Placeholder } from '../components/sketchy';
import type { ScreenProps } from './index';

export function UpdateEventScreen({ navigate }: ScreenProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Modifier l'événement"
        left={<span onClick={() => navigate('event-detail')} style={{ cursor: 'pointer' }}>✕</span>}
      />

      {/* Content */}
      <div style={{ flex: 1, padding: 16, overflow: 'auto' }}>
        {/* Cover image upload */}
        <Placeholder
          height={140}
          label="Photo de couverture"
          style={{ marginBottom: 20, cursor: 'pointer' }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <Text style={{ marginBottom: 6, fontSize: 14 }}>Nom de l'événement *</Text>
            <Input defaultValue="Résidence Reconnexion" />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <Text style={{ marginBottom: 6, fontSize: 14 }}>Date de début *</Text>
              <Input type="date" defaultValue="2026-02-16" />
            </div>
            <div style={{ flex: 1 }}>
              <Text style={{ marginBottom: 6, fontSize: 14 }}>Date de fin</Text>
              <Input type="date" defaultValue="2026-02-20" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <Text style={{ marginBottom: 6, fontSize: 14 }}>Heure de début *</Text>
              <Input type="time" defaultValue="09:00" />
            </div>
            <div style={{ flex: 1 }}>
              <Text style={{ marginBottom: 6, fontSize: 14 }}>Heure de fin</Text>
              <Input type="time" defaultValue="18:00" />
            </div>
          </div>

          <div>
            <Text style={{ marginBottom: 6, fontSize: 14 }}>Lieu *</Text>
            <Input defaultValue="Le Revel, Rogues (30)" />
          </div>

          <div>
            <Text style={{ marginBottom: 6, fontSize: 14 }}>Description</Text>
            <textarea
              className="sketchy-input"
              defaultValue="Une semaine collaborative pour se rencontrer, co-créer et faire avancer le projet de Réseau Social Universel. Au programme : sessions plénières en intelligence collective, ateliers en forum ouvert, et randonnée au Cirque de Navacelles."
              rows={4}
              style={{ resize: 'none' }}
            />
          </div>

          <div>
            <Text style={{ marginBottom: 6, fontSize: 14 }}>Thématique *</Text>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[
                { id: 'culture', label: 'Culture', emoji: '🎭' },
                { id: 'sport', label: 'Sport', emoji: '⚽' },
                { id: 'nature', label: 'Nature', emoji: '🌿' },
                { id: 'social', label: 'Social', emoji: '👥' },
                { id: 'food', label: 'Gastronomie', emoji: '🍽️' },
                { id: 'music', label: 'Musique', emoji: '🎵' },
                { id: 'tech', label: 'Tech', emoji: '💻' },
                { id: 'other', label: 'Autre', emoji: '✨' },
              ].map((theme) => (
                <Button
                  key={theme.id}
                  variant={theme.id === 'social' ? 'primary' : 'default'}
                  style={{ fontSize: 13 }}
                >
                  {theme.emoji} {theme.label}
                </Button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: 16, borderTop: '2px solid var(--sketch-black)' }}>
        <Button
          variant="primary"
          style={{ width: '100%' }}
          onClick={() => navigate('event-detail')}
        >
          Enregistrer les modifications
        </Button>
      </div>
    </div>
  );
}
