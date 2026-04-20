import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Header, Avatar, Text, Button, showToast } from '../components/sketchy';
import type { ScreenProps } from './index';

type Mode = 'choice' | 'show' | 'scan';

export function ConnectScreen({ navigate, params }: ScreenProps) {
  const backTo = params?.from ?? 'friends-list';
  const [mode, setMode] = useState<Mode>('choice');
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (mode !== 'scan') return;
    setScanProgress(0);
    const start = Date.now();
    const id = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / 2800);
      setScanProgress(p);
      if (p >= 1) {
        clearInterval(id);
        showToast('Connexion établie avec Léa Bernard', 'success');
        navigate('friends-list');
      }
    }, 80);
    return () => clearInterval(id);
  }, [mode, navigate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Se connecter"
        left={
          <ArrowLeft
            size={20}
            onClick={() => (mode === 'choice' ? navigate(backTo) : setMode('choice'))}
            style={{ cursor: 'pointer' }}
          />
        }
      />

      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        {mode === 'choice' && (
          <>
            <Text style={{ fontSize: 13, color: '#888', marginBottom: 16, lineHeight: 1.5 }}>
              Pour vous connecter, scannez le QR code de l'autre personne ou affichez le vôtre pour qu'elle le scanne.
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Button variant="primary" style={{ padding: 16, fontSize: 15 }} onClick={() => setMode('show')}>
                Afficher mon QR code
              </Button>
              <Button style={{ padding: 16, fontSize: 15 }} onClick={() => setMode('scan')}>
                Scanner un QR code
              </Button>
            </div>
          </>
        )}

        {mode === 'show' && (
          <div style={{ textAlign: 'center', paddingTop: 8 }}>
            <div
              style={{
                width: 220,
                height: 220,
                margin: '0 auto 16px',
                border: '2px solid #e0e0e0',
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fff',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: 190,
                  height: 190,
                  background: `
                    linear-gradient(90deg, #1a1a1a 10%, transparent 10%, transparent 20%, #1a1a1a 20%, #1a1a1a 30%, transparent 30%, transparent 40%, #1a1a1a 40%, #1a1a1a 50%, transparent 50%, transparent 60%, #1a1a1a 60%, #1a1a1a 70%, transparent 70%, transparent 80%, #1a1a1a 80%, #1a1a1a 90%, transparent 90%),
                    linear-gradient(#1a1a1a 10%, transparent 10%, transparent 20%, #1a1a1a 20%, #1a1a1a 30%, transparent 30%, transparent 40%, #1a1a1a 40%, #1a1a1a 50%, transparent 50%, transparent 60%, #1a1a1a 60%, #1a1a1a 70%, transparent 70%, transparent 80%, #1a1a1a 80%, #1a1a1a 90%, transparent 90%)
                  `,
                  backgroundSize: '17px 17px',
                  opacity: 0.85,
                  borderRadius: 8,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  background: '#fff',
                  padding: 4,
                  borderRadius: '50%',
                }}
              >
                <Avatar name="Marie Dupont" color="#E8590C" size="sm" />
              </div>
            </div>
            <Text style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>Marie Dupont</Text>
            <Text style={{ color: '#888', margin: 0, fontSize: 13 }}>
              Montrez ce QR code pour permettre à l'autre personne de vous connecter.
            </Text>
          </div>
        )}

        {mode === 'scan' && (
          <div style={{ textAlign: 'center', paddingTop: 8 }}>
            <div
              style={{
                width: 240,
                height: 240,
                margin: '0 auto 16px',
                background: '#111',
                borderRadius: 16,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 24,
                  border: '2px solid rgba(255,255,255,0.8)',
                  borderRadius: 10,
                }}
              />
              {(['tl', 'tr', 'bl', 'br'] as const).map(corner => {
                const base: React.CSSProperties = {
                  position: 'absolute',
                  width: 22,
                  height: 22,
                  border: '3px solid #E8590C',
                };
                const pos: React.CSSProperties =
                  corner === 'tl' ? { top: 18, left: 18, borderRight: 'none', borderBottom: 'none' }
                  : corner === 'tr' ? { top: 18, right: 18, borderLeft: 'none', borderBottom: 'none' }
                  : corner === 'bl' ? { bottom: 18, left: 18, borderRight: 'none', borderTop: 'none' }
                  : { bottom: 18, right: 18, borderLeft: 'none', borderTop: 'none' };
                return <div key={corner} style={{ ...base, ...pos }} />;
              })}
              <div
                style={{
                  position: 'absolute',
                  left: 24,
                  right: 24,
                  top: `calc(24px + (100% - 48px) * ${(Math.sin(scanProgress * Math.PI * 2) + 1) / 2})`,
                  height: 2,
                  background: 'linear-gradient(90deg, transparent, #E8590C, transparent)',
                  boxShadow: '0 0 12px #E8590C',
                }}
              />
            </div>
            <Text style={{ fontSize: 13, color: '#888', margin: 0 }}>
              Alignez le QR code dans le cadre…
            </Text>
            <div
              style={{
                marginTop: 16,
                height: 4,
                background: '#f0f0f0',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${scanProgress * 100}%`,
                  height: '100%',
                  background: '#E8590C',
                  transition: 'width 0.08s linear',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
