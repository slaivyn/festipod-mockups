import React, { useState, useEffect } from 'react';
import { PhoneFrame, BrokerBanner } from '../../shared/components/sketchy';
import { screenGroups, type Screen } from '../../screens';
import { ThemeToggle } from './ThemeToggle';
import { useNextGraph } from '../../shared/context/NextGraphContext';
import { useFestipodData } from '../../shared/context/FestipodDataContext';

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);
  return isMobile;
}

interface GalleryProps {
  onSelectScreen: (screenId: string) => void;
  onShowSpecs: () => void;
}

const MIN_SCALE = 0.32;
const MAX_SCALE = 0.75;
const DEFAULT_SCALE = 0.5;

export function Gallery({ onSelectScreen, onShowSpecs }: GalleryProps) {
  const [scale, setScale] = useState(DEFAULT_SCALE);
  const isMobile = useIsMobile();
  const { status, connect } = useNextGraph();
  const { loadTestData } = useFestipodData();
  const [loading, setLoading] = useState(false);
  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting';

  return (
    <div>
      <div style={{
        padding: isMobile ? '16px' : '24px 32px',
        borderBottom: '2px solid var(--tool-border)',
        background: 'var(--tool-surface)',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'stretch' : 'flex-start',
          gap: isMobile ? 16 : 0,
        }}>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-sketch)',
              fontSize: isMobile ? 24 : 28,
              margin: 0,
              color: 'var(--tool-text)',
            }}>
              Festipod
            </h1>
            <p style={{
              fontFamily: 'var(--font-sketch)',
              fontSize: 14,
              color: 'var(--tool-text-muted)',
              margin: '8px 0 0 0',
            }}>
              Cliquez sur un écran pour le prévisualiser
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? 8 : 24,
            flexWrap: 'wrap',
          }}>
            {/* Specs BDD button */}
            <button
              onClick={onShowSpecs}
              style={{
                background: 'var(--tool-text)',
                color: 'var(--tool-bg)',
                border: '2px solid var(--tool-border)',
                borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
                padding: isMobile ? '6px 12px' : '8px 16px',
                fontFamily: 'var(--font-sketch)',
                fontSize: isMobile ? 12 : 14,
                cursor: 'pointer',
              }}
            >
              Specs BDD
            </button>

            {/* NextGraph: login or load test data */}
            {!isConnected && (
              <button
                onClick={connect}
                disabled={isConnecting}
                style={{
                  background: isConnecting ? 'var(--tool-text-muted)' : '#4CAF50',
                  color: 'white',
                  border: '2px solid var(--tool-border)',
                  borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
                  padding: isMobile ? '6px 12px' : '8px 16px',
                  fontFamily: 'var(--font-sketch)',
                  fontSize: isMobile ? 12 : 14,
                  cursor: isConnecting ? 'wait' : 'pointer',
                  opacity: isConnecting ? 0.7 : 1,
                }}
              >
                {isConnecting ? 'Connexion...' : 'Se connecter'}
              </button>
            )}
            {isConnected && (
              <button
                onClick={async () => {
                  setLoading(true);
                  try { await loadTestData(); } finally { setLoading(false); }
                }}
                disabled={loading}
                style={{
                  background: loading ? 'var(--tool-text-muted)' : '#FF9800',
                  color: 'white',
                  border: '2px solid var(--tool-border)',
                  borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
                  padding: isMobile ? '6px 12px' : '8px 16px',
                  fontFamily: 'var(--font-sketch)',
                  fontSize: isMobile ? 12 : 14,
                  cursor: loading ? 'wait' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Chargement...' : 'Charger données de test'}
              </button>
            )}

            {/* Zoom control - hide on mobile */}
            {!isMobile && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontFamily: 'var(--font-sketch)',
              }}>
                <span style={{ fontSize: 14, color: 'var(--tool-text-muted)' }}>Zoom</span>
                <input
                  type="range"
                  min={MIN_SCALE * 100}
                  max={MAX_SCALE * 100}
                  value={scale * 100}
                  onChange={(e) => setScale(Number(e.target.value) / 100)}
                  style={{
                    width: 100,
                    accentColor: 'var(--tool-text)',
                  }}
                />
                <span style={{ fontSize: 14, width: 40 }}>{Math.round(scale * 100)}%</span>
              </div>
            )}

            {/* Theme toggle */}
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div style={{ padding: isMobile ? '16px 0' : '24px 0' }}>
        {screenGroups.map((group) => (
          <div key={group.id} style={{ marginBottom: isMobile ? 24 : 32 }}>
            {/* Group header */}
            <h2 style={{
              fontFamily: 'var(--font-sketch)',
              fontSize: isMobile ? 16 : 18,
              margin: isMobile ? '0 0 12px 16px' : '0 0 16px 32px',
              color: 'var(--tool-text)',
            }}>
              {group.name}
            </h2>

            {/* Horizontal scrolling row */}
            <div style={{
              display: 'flex',
              gap: isMobile ? 12 : 24,
              paddingLeft: isMobile ? 16 : 32,
              paddingRight: isMobile ? 16 : 32,
              overflowX: 'auto',
              paddingBottom: 8,
            }}>
              {group.screens.map((screen) => (
                <GalleryItem
                  key={screen.id}
                  screen={screen}
                  scale={isMobile ? 0.35 : scale}
                  onClick={() => onSelectScreen(screen.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface GalleryItemProps {
  screen: Screen;
  scale: number;
  onClick: () => void;
}

const NON_CONNECTED_SCREENS = ['welcome', 'login'];

function GalleryItem({ screen, scale, onClick }: GalleryItemProps) {
  const ScreenComponent = screen.component;
  const phoneWidth = 375;
  const phoneHeight = 812;
  const isConnected = !NON_CONNECTED_SCREENS.includes(screen.id);

  return (
    <div className="gallery-item" onClick={onClick} style={{ flexShrink: 0 }}>
      <div style={{
        width: phoneWidth * scale,
        height: phoneHeight * scale,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}>
        <div style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: phoneWidth,
          height: phoneHeight,
        }}>
          <PhoneFrame>
            {isConnected && <BrokerBanner />}
            <ScreenComponent navigate={() => {}} />
          </PhoneFrame>
        </div>
      </div>
      <p style={{
        fontFamily: 'var(--font-sketch)',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
        color: 'var(--tool-text)',
      }}>
        {screen.name}
      </p>
    </div>
  );
}
