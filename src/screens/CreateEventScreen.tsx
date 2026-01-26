import React from 'react';
import { Header, Text, Input, Button, Placeholder } from '../components/sketchy';
import type { ScreenProps } from './index';

export function CreateEventScreen({ navigate }: ScreenProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Créer un événement"
        left={<span onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>✕</span>}
      />

      {/* Content */}
      <div style={{ flex: 1, padding: 16, overflow: 'auto' }}>
        {/* Cover image upload */}
        <Placeholder
          height={140}
          label="+ Ajouter une photo"
          style={{ marginBottom: 20, cursor: 'pointer' }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <Text style={{ marginBottom: 6, fontSize: 14 }}>Nom de l'événement *</Text>
            <Input placeholder="Donnez un nom à votre événement" />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <Text style={{ marginBottom: 6, fontSize: 14 }}>Date de début *</Text>
              <Input type="date" placeholder="Début" />
            </div>
            <div style={{ flex: 1 }}>
              <Text style={{ marginBottom: 6, fontSize: 14 }}>Date de fin</Text>
              <Input type="date" placeholder="Fin" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <Text style={{ marginBottom: 6, fontSize: 14 }}>Heure de début *</Text>
              <Input type="time" placeholder="Début" />
            </div>
            <div style={{ flex: 1 }}>
              <Text style={{ marginBottom: 6, fontSize: 14 }}>Heure de fin</Text>
              <Input type="time" placeholder="Fin" />
            </div>
          </div>

          <div>
            <Text style={{ marginBottom: 6, fontSize: 14 }}>Lieu *</Text>
            <Input placeholder="Ajouter un lieu" />
          </div>

          <div>
            <Text style={{ marginBottom: 6, fontSize: 14 }}>Description</Text>
            <textarea
              className="sketchy-input"
              placeholder="Décrivez votre événement..."
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
          Créer l'événement
        </Button>
      </div>
    </div>
  );
}
