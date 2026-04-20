import React, { useState, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Header, Text, Input, Button, Placeholder, showToast } from '../components/sketchy';
import type { ScreenProps } from './index';

const existingEvents = [
  { name: 'Résidence Reconnexion', relayedBy: 'Thomas Martin', date: '16-20 Fév.', location: 'Le Revel, Rogues (30)' },
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

type Step = 1 | 2 | 3;

export function CreateEventScreen({ navigate }: ScreenProps) {
  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [importedFrom, setImportedFrom] = useState<string | null>(null);

  // Matching existing events triggers step 2 (duplicate warning)
  const similarExisting = useMemo(() => {
    if (name.trim().length < 3) return [];
    const lower = name.toLowerCase();
    return existingEvents.filter(e => e.name.toLowerCase().includes(lower.slice(0, 3)));
  }, [name]);

  // Importable matches show as a dismissable top banner
  const importCandidate = useMemo(() => {
    if (importedFrom) return null;
    if (name.trim().length < 3) return null;
    const lower = name.toLowerCase();
    return importableEvents.find(e => e.name.toLowerCase().includes(lower.slice(0, 3))) ?? null;
  }, [name, importedFrom]);

  const applyImport = (candidate: typeof importableEvents[number]) => {
    setName(candidate.name);
    setStartDate(candidate.date);
    setLocation(candidate.location);
    setDescription(candidate.description);
    setImportedFrom(candidate.source);
    showToast(`Données importées depuis ${candidate.source}`, 'info');
  };

  const goNext = () => {
    if (step === 1) {
      if (similarExisting.length > 0) setStep(2);
      else setStep(3);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const goBack = () => {
    if (step === 1) return navigate('home');
    if (step === 3 && similarExisting.length === 0) return setStep(1);
    setStep((step - 1) as Step);
  };

  const submit = () => {
    showToast('Événement relayé', 'success');
    navigate('event-detail');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Relayer un événement"
        left={
          step === 1 ? (
            <span onClick={goBack} style={{ cursor: 'pointer', fontSize: 18 }}>✕</span>
          ) : (
            <ArrowLeft size={20} onClick={goBack} style={{ cursor: 'pointer' }} />
          )
        }
      />

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 6, padding: '10px 16px 0' }}>
        {[1, 2, 3].map(s => (
          <div
            key={s}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background: s <= step ? '#E8590C' : '#eee',
            }}
          />
        ))}
      </div>

      <div style={{ flex: 1, padding: 16, overflow: 'auto' }}>
        {importCandidate && step === 1 && (
          <div
            style={{
              background: '#EFF6FF',
              border: '1.5px solid #93C5FD',
              borderRadius: 12,
              padding: 12,
              marginBottom: 16,
            }}
          >
            <Text style={{ margin: 0, fontWeight: 'bold', fontSize: 14, marginBottom: 4 }}>
              Données trouvées sur {importCandidate.source}
            </Text>
            <Text style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}>
              « {importCandidate.name} » — {importCandidate.location}
            </Text>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <Button variant="primary" style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => applyImport(importCandidate)}>
                Importer
              </Button>
              <Button style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => setImportedFrom('dismissed')}>
                Ignorer
              </Button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Text style={{ fontSize: 13, color: '#888', margin: 0 }}>
              Commençons par l'essentiel : le nom et les dates.
            </Text>

            <div>
              <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Nom de l'événement *</Text>
              <Input
                placeholder="Donnez un nom à votre événement"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setName(e.target.value);
                  if (importedFrom === 'dismissed') setImportedFrom(null);
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Date de début *</Text>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Date de fin</Text>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              style={{
                background: '#FEF3C7',
                border: '1.5px solid #F59E0B',
                borderRadius: 12,
                padding: 12,
              }}
            >
              <Text style={{ margin: 0, fontWeight: 'bold', fontSize: 14, marginBottom: 4 }}>
                Événement similaire détecté
              </Text>
              <Text style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}>
                Un événement similaire a déjà été relayé. Peut-être s'agit-il du même ?
              </Text>
            </div>

            {similarExisting.map((ev, i) => (
              <div
                key={i}
                style={{
                  padding: 14,
                  border: '1.5px solid #eee',
                  borderRadius: 14,
                }}
              >
                <Text style={{ margin: 0, fontWeight: 'bold', fontSize: 15 }}>{ev.name}</Text>
                <Text style={{ margin: '4px 0', fontSize: 13, color: '#888' }}>
                  {ev.date} · {ev.location}
                </Text>
                <Text style={{ margin: '0 0 10px 0', fontSize: 12, color: '#888' }}>
                  Relayé par {ev.relayedBy}
                </Text>
                <Button
                  variant="primary"
                  style={{ width: '100%', padding: 10, fontSize: 13 }}
                  onClick={() => navigate('event-detail')}
                >
                  Voir cet événement
                </Button>
              </div>
            ))}

            <Text style={{ fontSize: 12, color: '#888', margin: '8px 0 0 0', textAlign: 'center' }}>
              Aucun de ces événements ne correspond ? Continuez pour en créer un nouveau.
            </Text>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Placeholder
              height={140}
              label="+ Ajouter une photo"
              style={{ cursor: 'pointer' }}
            />

            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <Text style={{ marginBottom: 6, fontSize: 13, color: '#888' }}>Heure de début</Text>
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
          </div>
        )}
      </div>

      <div style={{ padding: 16, borderTop: '1px solid #f0f0f0' }}>
        {step < 3 ? (
          <Button
            variant="primary"
            style={{ width: '100%' }}
            onClick={goNext}
            disabled={step === 1 && (!name.trim() || !startDate)}
          >
            Suivant
          </Button>
        ) : (
          <Button
            variant="primary"
            style={{ width: '100%' }}
            onClick={submit}
          >
            Relayer l'événement
          </Button>
        )}
      </div>
    </div>
  );
}
