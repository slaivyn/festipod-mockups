import React, { useState } from 'react';
import { PhoneFrame } from './sketchy';
import { screenGroups, type Screen } from '../screens';

interface GalleryProps {
  onSelectScreen: (screenId: string) => void;
  onShowStories: () => void;
  onShowSpecs?: () => void;
}

const MIN_SCALE = 0.32;
const MAX_SCALE = 0.75;
const DEFAULT_SCALE = 0.5;

export function Gallery({ onSelectScreen, onShowStories, onShowSpecs }: GalleryProps) {
  const [scale, setScale] = useState(DEFAULT_SCALE);

  return (
    <div>
      <div style={{
        padding: '24px 32px',
        borderBottom: '2px solid var(--sketch-black)',
        background: 'var(--sketch-white)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-sketch)',
              fontSize: 28,
              margin: 0,
            }}>
              Festipod
            </h1>
            <p style={{
              fontFamily: 'var(--font-sketch)',
              fontSize: 16,
              color: 'var(--sketch-gray)',
              margin: '8px 0 0 0',
            }}>
              Cliquez sur un écran pour le prévisualiser
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
          }}>
            {/* User Stories button */}
            <button
              onClick={onShowStories}
              style={{
                background: 'none',
                border: '2px solid var(--sketch-black)',
                borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
                padding: '8px 16px',
                fontFamily: 'var(--font-sketch)',
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              User Stories
            </button>

            {/* Specs BDD button */}
            {onShowSpecs && (
              <button
                onClick={onShowSpecs}
                style={{
                  background: 'var(--sketch-black)',
                  color: 'var(--sketch-white)',
                  border: '2px solid var(--sketch-black)',
                  borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
                  padding: '8px 16px',
                  fontFamily: 'var(--font-sketch)',
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                Specs BDD
              </button>
            )}

            {/* Zoom control */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontFamily: 'var(--font-sketch)',
            }}>
              <span style={{ fontSize: 14, color: 'var(--sketch-gray)' }}>Zoom</span>
            <input
              type="range"
              min={MIN_SCALE * 100}
              max={MAX_SCALE * 100}
              value={scale * 100}
              onChange={(e) => setScale(Number(e.target.value) / 100)}
              style={{
                width: 100,
                accentColor: 'var(--sketch-black)',
              }}
            />
            <span style={{ fontSize: 14, width: 40 }}>{Math.round(scale * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px 0' }}>
        {screenGroups.map((group) => (
          <div key={group.id} style={{ marginBottom: 32 }}>
            {/* Group header */}
            <h2 style={{
              fontFamily: 'var(--font-sketch)',
              fontSize: 18,
              margin: '0 0 16px 32px',
              color: 'var(--sketch-black)',
            }}>
              {group.name}
            </h2>

            {/* Horizontal scrolling row */}
            <div style={{
              display: 'flex',
              gap: 24,
              paddingLeft: 32,
              paddingRight: 32,
              overflowX: 'auto',
              paddingBottom: 8,
            }}>
              {group.screens.map((screen) => (
                <GalleryItem
                  key={screen.id}
                  screen={screen}
                  scale={scale}
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

function GalleryItem({ screen, scale, onClick }: GalleryItemProps) {
  const ScreenComponent = screen.component;
  const phoneWidth = 375;
  const phoneHeight = 812;

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
            <ScreenComponent navigate={() => {}} />
          </PhoneFrame>
        </div>
      </div>
      <p style={{
        fontFamily: 'var(--font-sketch)',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
        color: 'var(--sketch-black)',
      }}>
        {screen.name}
      </p>
    </div>
  );
}
