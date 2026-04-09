import React, { useState } from 'react';
import { Header, Text, Input, Button, Placeholder } from '../components/sketchy';
import type { ScreenProps } from './index';

const existingEvents = [
  { name: 'Résidence Reconnexion', relayedBy: 'Thomas Martin' },
];

const importableEvents = [
  {
    name: 'Festival des Utopies Concrètes',
    source: 'Mobilizon',
    date: '2026-03-15',
    location: 'Paris, Parc de la Villette',
    description: 'Festival annuel présentant des alternatives concrètes pour un monde durable.',
  },
  {
    name: "Rencontres de l'Écologie",
    source: 'Transiscope',
    date: '2026-04-20',
    location: 'Lyon, Halle Tony Garnier',
    description: 'Deux jours de conférences et ateliers sur la transition écologique.',
  },
];

export function CreateEventScreen({ navigate }: ScreenProps) {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [importedFrom, setImportedFrom] = useState<string | null>(null);

  const showDuplicateWarning = name.length > 3 && startDate && location.length > 3 && !importedFrom;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Relayer un événement"
        left={<span onClick={() => navigate('home')} style={{ cursor: 'pointer', fontSize: 18 }}>✕</span>}
      />

      <div style={{ flex: 1, padding: 16, overflow: 'auto' }}>
        <Placeholder
          height={140}
          label="+ Ajouter une photo"
          style={{ marginBottom: 20, cursor: 'pointer' }}
        />

        {showDuplicateWarning && (
          <div style={{
            background: '#FEF3C7',
            border: '1.5px solid #F59E0B',
            borderRadius: 12,
            padding: 12,
            marginBottom: 16,
          }}>
            <Text style={{ margin: 0, fontWeight: 'bold', fontSize: 14, marginBottom: 4 }}>
              Événement similaire détecté
            </Text>
            <Text style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}>
              Un événement similaire a déjà été relayé par <strong>Thomas Martin</strong>.
            </Text>
            <Text
              style={{ margin: '8px 0 0 0', fontSize: 13, cursor: 'pointer', textDecoration: 'underline', color: '#E8590C' }}
              onClick={() => navigate('event-detail')}
            >
              Voir l'événement existant
            </Text>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ position: 'relative' }}>
            <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Nom de l'événement *</Text>
            <Input
              placeholder="Donnez un nom à votre événement"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setName(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
                setImportedFrom(null);
              }}
              onFocus={() => name.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />

            {showSuggestions && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'white',
                border: '1.5px solid #e0e0e0',
                borderRadius: 12,
                marginTop: 4,
                zIndex: 10,
                maxHeight: 250,
                overflow: 'auto',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}>
                {existingEvents.length > 0 && (
                  <>
                    <div style={{ padding: '8px 12px', background: '#f9f9f9', fontSize: 12, fontWeight: 600, color: '#888' }}>
                      Déjà relayé sur Festipod
                    </div>
                    {existingEvents.map((event, i) => (
                      <div
                        key={`existing-${i}`}
                        style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0', opacity: 0.6, cursor: 'not-allowed' }}
                      >
                        <Text style={{ margin: 0, fontSize: 14 }}>{event.name}</Text>
                        <Text style={{ margin: '2px 0 0 0', fontSize: 12, color: '#888' }}>
                          Relayé par {event.relayedBy}
                        </Text>
                      </div>
                    ))}
                  </>
                )}

                {importableEvents.length > 0 && (
                  <>
                    <div style={{ padding: '8px 12px', background: '#f9f9f9', fontSize: 12, fontWeight: 600, color: '#888' }}>
                      Importer depuis une source externe
                    </div>
                    {importableEvents.map((event, i) => (
                      <div
                        key={`import-${i}`}
                        style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}
                        onClick={() => {
                          setName(event.name);
                          setStartDate(event.date);
                          setLocation(event.location);
                          setDescription(event.description);
                          setImportedFrom(event.source);
                          setShowSuggestions(false);
                        }}
                      >
                        <Text style={{ margin: 0, fontSize: 14 }}>{event.name}</Text>
                        <Text style={{ margin: '2px 0 0 0', fontSize: 12, color: '#888' }}>
                          via {event.source} · {event.location}
                        </Text>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Date de début *</Text>
              <Input
                type="date"
                placeholder="Début"
                value={startDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Date de fin</Text>
              <Input type="date" placeholder="Fin" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Heure de début *</Text>
              <Input type="time" placeholder="Début" />
            </div>
            <div style={{ flex: 1 }}>
              <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Heure de fin</Text>
              <Input type="time" placeholder="Fin" />
            </div>
          </div>

          <div>
            <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Lieu *</Text>
            <Input
              placeholder="Ajouter un lieu"
              value={location}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
            />
          </div>

          <div>
            <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Description</Text>
            <textarea
              className="app-input"
              placeholder="Décrivez votre événement..."
              rows={4}
              style={{ resize: 'none' }}
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Thématique *</Text>
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

      <div style={{ padding: 16, borderTop: '1px solid #f0f0f0' }}>
        <Button
          variant="primary"
          style={{ width: '100%' }}
          onClick={() => navigate('event-detail')}
        >
          Relayer l'événement
        </Button>
      </div>
    </div>
  );
}
