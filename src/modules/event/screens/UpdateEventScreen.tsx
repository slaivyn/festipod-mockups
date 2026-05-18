import React, { useState } from 'react';
import { Header, Text, Input, Button, Placeholder, showToast } from '../../../shared/components/sketchy';
import { useFestipodData } from '../../../shared/context/FestipodDataContext';
import { useNavigate, useParams } from '../../../app/router';

export function UpdateEventScreen() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { getEvent, updateEvent } = useFestipodData();
  const event = eventId ? getEvent(eventId) : undefined;

  const [title, setTitle] = useState(event?.title ?? '');
  const [startDate, setStartDate] = useState(event?.startDate ?? '');
  const [endDate, setEndDate] = useState(event?.endDate ?? '');
  const [startTime, setStartTime] = useState(event?.startTime ?? '');
  const [endTime, setEndTime] = useState(event?.endTime ?? '');
  const [location, setLocation] = useState(event?.location ?? '');
  const [description, setDescription] = useState(event?.description ?? '');

  const save = () => {
    if (!eventId) return;
    const dateLabel = startDate
      ? (endDate ? `${startDate} - ${endDate}` : startDate)
      : event?.date ?? '';
    updateEvent(eventId, {
      title,
      date: dateLabel,
      startDate,
      endDate,
      startTime,
      endTime,
      location,
      description,
    });
    showToast('Événement mis à jour', 'success');
    navigate(`/events/${eventId}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Modifier l'événement"
        left={<span onClick={() => navigate(`/events/${eventId}`)} style={{ cursor: 'pointer', fontSize: 18 }}>✕</span>}
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
            <Input value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Date de début *</Text>
              <Input type="date" value={startDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Date de fin</Text>
              <Input type="date" value={endDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Heure de début *</Text>
              <Input type="time" value={startTime} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartTime(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Heure de fin</Text>
              <Input type="time" value={endTime} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndTime(e.target.value)} />
            </div>
          </div>

          <div>
            <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Lieu *</Text>
            <Input value={location} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)} />
          </div>

          <div>
            <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Description</Text>
            <textarea
              className="app-input"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
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
