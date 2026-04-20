import { useState } from 'react';
import { showToast } from './Toast';

export interface MeetingPointData {
  id: string | number;
  title: string;
  when: string;
  duration: string;
  lieu: string;
}

interface Props {
  points: MeetingPointData[];
  joinedIds: Set<string>;
  onToggle: (id: string, title: string, willJoin: boolean) => void;
  /** Expand all initially (used on the dedicated event detail screen). */
  expanded?: boolean;
}

export function EventMeetingPoints({ points, joinedIds, onToggle, expanded = false }: Props) {
  const [showAll, setShowAll] = useState(expanded);

  if (points.length === 0) return null;

  const joined = points.filter(p => joinedIds.has(String(p.id)));
  const others = points.filter(p => !joinedIds.has(String(p.id)));
  const alwaysVisible = expanded ? points : joined;
  const collapsible = expanded ? [] : others;

  const handleToggle = (p: MeetingPointData) => {
    const willJoin = !joinedIds.has(String(p.id));
    onToggle(String(p.id), p.title, willJoin);
    showToast(
      willJoin ? `Inscription : ${p.title}` : `Désinscription : ${p.title}`,
      willJoin ? 'success' : 'info',
    );
  };

  const renderItem = (p: MeetingPointData) => {
    const isJoined = joinedIds.has(String(p.id));
    return (
      <div
        key={p.id}
        style={{
          padding: 12,
          border: '1.5px solid #eee',
          borderRadius: 12,
          marginBottom: 8,
          background: isJoined ? '#f7fff7' : '#fff',
          borderColor: isJoined ? '#c6f6d5' : '#eee',
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>
          {p.title}
        </div>
        <div style={{ fontSize: 12, color: '#666', marginBottom: 10 }}>
          🕒 {p.when} · {p.duration}
          <br />
          📍 {p.lieu}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={(e) => { e.stopPropagation(); handleToggle(p); }}
            style={{
              background: isJoined ? '#22543D' : '#1a1a1a',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '6px 14px',
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-app)',
            }}
          >
            {isJoined ? '✓ Inscrit' : "S'inscrire"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: '#999',
          textTransform: 'uppercase',
          letterSpacing: 1,
          marginBottom: 8,
        }}
      >
        Points de rencontre ({points.length})
      </div>

      {alwaysVisible.map(renderItem)}

      {collapsible.length > 0 && !showAll && (
        <button
          onClick={(e) => { e.stopPropagation(); setShowAll(true); }}
          style={{
            width: '100%',
            padding: '8px 10px',
            border: '1.5px dashed #ddd',
            borderRadius: 10,
            background: 'none',
            fontSize: 12,
            fontWeight: 600,
            color: '#888',
            cursor: 'pointer',
            fontFamily: 'var(--font-app)',
            marginBottom: 4,
          }}
        >
          + {collapsible.length} autre{collapsible.length > 1 ? 's' : ''} point{collapsible.length > 1 ? 's' : ''} de rencontre
        </button>
      )}

      {collapsible.length > 0 && showAll && (
        <>
          {collapsible.map(renderItem)}
          <button
            onClick={(e) => { e.stopPropagation(); setShowAll(false); }}
            style={{
              width: '100%',
              padding: '6px 10px',
              border: 'none',
              background: 'none',
              fontSize: 12,
              fontWeight: 600,
              color: '#888',
              cursor: 'pointer',
              fontFamily: 'var(--font-app)',
            }}
          >
            Réduire
          </button>
        </>
      )}
    </div>
  );
}
