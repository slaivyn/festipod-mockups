import React, { useState } from 'react';
import { Header, Text, Input, Button, Placeholder } from '../../../shared/components/sketchy';
import { useFestipodData } from '../../../shared/context/FestipodDataContext';
import type { ScreenProps } from '../../../screens';

// Demo data for suggestions
const importableEvents = [
  {
    name: 'Festival des Utopies Concrètes',
    source: 'Mobilizon',
    date: '2026-03-15',
    location: 'Paris, Parc de la Villette',
    description: 'Festival annuel présentant des alternatives concrètes pour un monde durable.',
  },
  {
    name: 'Rencontres de l\'Écologie',
    source: 'Transiscope',
    date: '2026-04-20',
    location: 'Lyon, Halle Tony Garnier',
    description: 'Deux jours de conférences et ateliers sur la transition écologique.',
  },
];

export function CreateEventScreen({ navigate }: ScreenProps) {
  const { events, createEvent, setSelectedEventId } = useFestipodData();

  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [selectedThemes, setSelectedThemes] = useState<string[]>(['Social']);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [importedFrom, setImportedFrom] = useState<string | null>(null);

  // Check for existing events with similar names
  const existingMatches = events.filter(e =>
    name.length > 3 && e.title.toLowerCase().includes(name.toLowerCase())
  );

  // Show warning only when key fields are filled AND not imported from external source
  const showDuplicateWarning = existingMatches.length > 0 && startDate && location.length > 3 && !importedFrom;

  const handleCreate = () => {
    const dateLabel = startDate
      ? (endDate ? `${startDate} - ${endDate}` : startDate)
      : 'Date à définir';

    const newEvent = createEvent({
      title: name || 'Nouvel événement',
      date: dateLabel,
      startDate,
      endDate,
      startTime,
      endTime,
      location: location || 'Lieu à définir',
      description,
      participantCount: 1,
      themes: selectedThemes,
      hostName: 'Moi',
      hostInitials: 'MD',
    });
    setSelectedEventId(newEvent.id);
    navigate('event-detail');
  };

  const toggleTheme = (themeId: string) => {
    setSelectedThemes(prev =>
      prev.includes(themeId)
        ? prev.filter(t => t !== themeId)
        : [...prev, themeId]
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Relayer un événement"
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

        {/* Duplicate warning - shown when key fields are filled */}
        {showDuplicateWarning && (
          <div style={{
            background: '#FEF3C7',
            border: '2px solid #F59E0B',
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
          }}>
            <Text style={{ margin: 0, fontWeight: 'bold', fontSize: 14, marginBottom: 4 }}>
              Événement similaire détecté
            </Text>
            <Text style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}>
              Un événement similaire « {existingMatches[0].title} » existe déjà.
              Vous pouvez continuer si vous pensez qu'il s'agit d'un événement différent.
            </Text>
            <Text
              style={{ margin: '8px 0 0 0', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => {
                setSelectedEventId(existingMatches[0].id);
                navigate('event-detail');
              }}
            >
              Voir l'événement existant →
            </Text>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ position: 'relative' }}>
            <Text style={{ marginBottom: 6, fontSize: 14 }}>Nom de l'événement *</Text>
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

            {/* Suggestions dropdown */}
            {showSuggestions && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'white',
                border: '2px solid var(--sketch-black)',
                borderRadius: 8,
                marginTop: 4,
                zIndex: 10,
                maxHeight: 250,
                overflow: 'auto',
              }}>
                {/* Existing events - not selectable */}
                {existingMatches.length > 0 && (
                  <>
                    <div style={{ padding: '8px 12px', background: 'var(--sketch-light-gray)', fontSize: 12, fontWeight: 'bold' }}>
                      Déjà relayé sur Festipod
                    </div>
                    {existingMatches.map((event) => (
                      <div
                        key={event.id}
                        style={{
                          padding: '10px 12px',
                          borderBottom: '1px solid var(--sketch-light-gray)',
                          opacity: 0.6,
                          cursor: 'not-allowed',
                        }}
                      >
                        <Text style={{ margin: 0, fontSize: 14 }}>{event.title}</Text>
                        <Text style={{ margin: '2px 0 0 0', fontSize: 12, color: 'var(--sketch-gray)' }}>
                          {event.hostName ? `Relayé par ${event.hostName}` : 'Relayé'}
                        </Text>
                      </div>
                    ))}
                  </>
                )}

                {/* Importable events */}
                {importableEvents.length > 0 && (
                  <>
                    <div style={{ padding: '8px 12px', background: 'var(--sketch-light-gray)', fontSize: 12, fontWeight: 'bold' }}>
                      Importer depuis une source externe
                    </div>
                    {importableEvents.map((event, i) => (
                      <div
                        key={`import-${i}`}
                        style={{
                          padding: '10px 12px',
                          borderBottom: '1px solid var(--sketch-light-gray)',
                          cursor: 'pointer',
                        }}
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
                        <Text style={{ margin: '2px 0 0 0', fontSize: 12, color: 'var(--sketch-gray)' }}>
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
              <Text style={{ marginBottom: 6, fontSize: 14 }}>Date de début *</Text>
              <Input
                type="date"
                placeholder="Début"
                value={startDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Text style={{ marginBottom: 6, fontSize: 14 }}>Date de fin</Text>
              <Input
                type="date"
                placeholder="Fin"
                value={endDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <Text style={{ marginBottom: 6, fontSize: 14 }}>Heure de début *</Text>
              <Input
                type="time"
                placeholder="Début"
                value={startTime}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartTime(e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Text style={{ marginBottom: 6, fontSize: 14 }}>Heure de fin</Text>
              <Input
                type="time"
                placeholder="Fin"
                value={endTime}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Text style={{ marginBottom: 6, fontSize: 14 }}>Lieu *</Text>
            <Input
              placeholder="Ajouter un lieu"
              value={location}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
            />
          </div>

          <div>
            <Text style={{ marginBottom: 6, fontSize: 14 }}>Description</Text>
            <textarea
              className="sketchy-input"
              placeholder="Décrivez votre événement..."
              rows={4}
              style={{ resize: 'none' }}
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <Text style={{ marginBottom: 6, fontSize: 14 }}>Thématique *</Text>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[
                { id: 'Culture', label: 'Culture', emoji: '🎭' },
                { id: 'Sport', label: 'Sport', emoji: '⚽' },
                { id: 'Nature', label: 'Nature', emoji: '🌿' },
                { id: 'Social', label: 'Social', emoji: '👥' },
                { id: 'Gastronomie', label: 'Gastronomie', emoji: '🍽️' },
                { id: 'Musique', label: 'Musique', emoji: '🎵' },
                { id: 'Tech', label: 'Tech', emoji: '💻' },
                { id: 'Autre', label: 'Autre', emoji: '✨' },
              ].map((theme) => (
                <Button
                  key={theme.id}
                  variant={selectedThemes.includes(theme.id) ? 'primary' : 'default'}
                  style={{ fontSize: 13 }}
                  onClick={() => toggleTheme(theme.id)}
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
        {showDuplicateWarning && (
          <div style={{
            background: '#FEF3C7',
            border: '2px solid #F59E0B',
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
          }}>
            <Text style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}>
              Un événement similaire « {existingMatches[0].title} » existe déjà.{' '}
              <span
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => {
                  setSelectedEventId(existingMatches[0].id);
                  navigate('event-detail');
                }}
              >
                Voir →
              </span>
            </Text>
          </div>
        )}
        <Button
          variant="primary"
          style={{ width: '100%' }}
          onClick={handleCreate}
        >
          Relayer l'événement
        </Button>
      </div>
    </div>
  );
}
