import React, { useState } from 'react';
import { Header, Text, Input, Button, Placeholder } from '../../../shared/components/sketchy';
import { useFestipodData } from '../../../shared/context/FestipodDataContext';
import type { ScreenProps } from '../../../screens';

export function UpdateEventScreen({ navigate }: ScreenProps) {
  const { selectedEvent, updateEvent, selectedEventId } = useFestipodData();
  const event = selectedEvent;

  const [title, setTitle] = useState(event?.title ?? '');
  const [startDate, setStartDate] = useState(event?.startDate ?? '');
  const [endDate, setEndDate] = useState(event?.endDate ?? '');
  const [startTime, setStartTime] = useState(event?.startTime ?? '');
  const [endTime, setEndTime] = useState(event?.endTime ?? '');
  const [location, setLocation] = useState(event?.location ?? '');
  const [description, setDescription] = useState(event?.description ?? '');
  const [themes, setThemes] = useState<string[]>(event?.themes ?? ['Social']);

  const toggleTheme = (themeId: string) => {
    setThemes(prev =>
      prev.includes(themeId)
        ? prev.filter(t => t !== themeId)
        : [...prev, themeId]
    );
  };

  const handleSave = () => {
    const dateLabel = startDate
      ? (endDate ? `${startDate} - ${endDate}` : startDate)
      : event?.date ?? '';

    updateEvent(selectedEventId, {
      title,
      date: dateLabel,
      startDate,
      endDate,
      startTime,
      endTime,
      location,
      description,
      themes,
    });
    navigate('event-detail');
  };

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
            <Input value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <Text style={{ marginBottom: 6, fontSize: 14 }}>Date de début *</Text>
              <Input type="date" value={startDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <Text style={{ marginBottom: 6, fontSize: 14 }}>Date de fin</Text>
              <Input type="date" value={endDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <Text style={{ marginBottom: 6, fontSize: 14 }}>Heure de début *</Text>
              <Input type="time" value={startTime} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartTime(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <Text style={{ marginBottom: 6, fontSize: 14 }}>Heure de fin</Text>
              <Input type="time" value={endTime} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndTime(e.target.value)} />
            </div>
          </div>

          <div>
            <Text style={{ marginBottom: 6, fontSize: 14 }}>Lieu *</Text>
            <Input value={location} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)} />
          </div>

          <div>
            <Text style={{ marginBottom: 6, fontSize: 14 }}>Description</Text>
            <textarea
              className="sketchy-input"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              rows={4}
              style={{ resize: 'none' }}
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
                  variant={themes.includes(theme.id) ? 'primary' : 'default'}
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
        <Button
          variant="primary"
          style={{ width: '100%' }}
          onClick={handleSave}
        >
          Enregistrer les modifications
        </Button>
      </div>
    </div>
  );
}
