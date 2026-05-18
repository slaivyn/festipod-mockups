import React from 'react';
import { useNextGraph } from '../../context/NextGraphContext';

export function NgStatus() {
  const { status } = useNextGraph();

  if (status === 'disconnected' || status === 'error') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 11,
          color: '#888',
          fontFamily: 'var(--font-app)',
        }}
        title="Mode démonstration — NextGraph non connecté"
      >
        <span style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#ccc',
          display: 'inline-block',
        }} />
        démo
      </div>
    );
  }

  if (status === 'connecting') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 11,
          color: '#888',
          fontFamily: 'var(--font-app)',
        }}
      >
        <span style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#ff9800',
          display: 'inline-block',
        }} />
        connexion...
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11,
        color: '#4caf50',
        fontFamily: 'var(--font-app)',
      }}
      title="Connecté à NextGraph"
    >
      <span style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: '#4caf50',
        display: 'inline-block',
      }} />
      NextGraph
    </div>
  );
}
