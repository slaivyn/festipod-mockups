import React from 'react';
import { useNextGraph } from '../../context/NextGraphContext';

export function BrokerBanner() {
  const { status, connect } = useNextGraph();

  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting';

  const bgColor = isConnected ? '#4CAF50' : isConnecting ? '#FFB74D' : '#A5D6A7';
  const textColor = isConnected ? 'white' : isConnecting ? 'white' : '#2E7D32';

  return (
    <div
      style={{
        background: bgColor,
        color: textColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 12px',
        fontFamily: 'var(--font-sketch)',
        fontSize: 13,
        fontWeight: 'bold',
        flexShrink: 0,
        cursor: !isConnected && !isConnecting ? 'pointer' : 'default',
      }}
      onClick={!isConnected && !isConnecting ? connect : undefined}
      title={isConnected ? 'Connecté à NextGraph' : isConnecting ? 'Connexion en cours...' : 'Cliquer pour se connecter à NextGraph'}
    >
      <span>
        {isConnected ? 'NextGraph' : isConnecting ? 'Connexion...' : 'Se connecter'}
      </span>
      {isConnected && (
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px 4px',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
          }}
          title="Recharger"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 2v6h-6" />
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
            <path d="M3 22v-6h6" />
            <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
          </svg>
        </button>
      )}
    </div>
  );
}
