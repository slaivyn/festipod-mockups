import React, { useState, useEffect } from 'react';
import { PhoneFrame } from './sketchy';
import { screens, getScreen } from '../screens';
import { getStoriesForScreen, categoryLabels, categoryColors, priorityColors } from '../data';
import { getStoryUrl } from '../router';
import { ThemeToggle } from './ThemeToggle';

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);
  return isMobile;
}

interface DemoModeProps {
  initialScreenId: string;
  onBack: () => void;
  onNavigateToStory: (storyId: string) => void;
}

export function DemoMode({ initialScreenId, onBack, onNavigateToStory }: DemoModeProps) {
  const [currentScreenId, setCurrentScreenId] = useState(initialScreenId);
  const [history, setHistory] = useState<string[]>([initialScreenId]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const currentScreen = getScreen(currentScreenId);
  const ScreenComponent = currentScreen?.component;
  const linkedStories = getStoriesForScreen(currentScreenId);

  const navigate = (screenId: string) => {
    const newHistory = [...history.slice(0, historyIndex + 1), screenId];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentScreenId(screenId);
  };

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  const goBack = () => {
    if (canGoBack) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const screenId = history[newIndex];
      if (screenId) setCurrentScreenId(screenId);
    }
  };

  const goForward = () => {
    if (canGoForward) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const screenId = history[newIndex];
      if (screenId) setCurrentScreenId(screenId);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      height: '100vh',
      background: 'var(--tool-bg)',
      overflow: 'hidden',
      transition: 'background-color 0.2s ease',
      position: 'relative',
    }}>
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 40,
          }}
        />
      )}

      {/* Left Sidebar */}
      <div style={{
        width: 280,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '2px solid var(--tool-border)',
        background: 'var(--tool-surface)',
        transition: 'transform 0.3s ease, background-color 0.2s ease, border-color 0.2s ease',
        ...(isMobile ? {
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        } : {}),
      }}>
        {/* Back button and theme toggle */}
        <div style={{ padding: 16, borderBottom: '1px solid var(--tool-border-light)', display: 'flex', gap: 8 }}>
          <button
            onClick={onBack}
            style={{
              flex: 1,
              padding: '8px 16px',
              background: 'none',
              border: '2px solid var(--tool-border)',
              borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
              fontFamily: 'var(--font-sketch)',
              cursor: 'pointer',
              color: 'var(--tool-text)',
            }}
          >
            ← Galerie
          </button>
          <ThemeToggle />
        </div>

        {/* Current screen & navigation */}
        <div style={{ padding: 16, borderBottom: '1px solid var(--tool-border-light)' }}>
          <div style={{
            fontFamily: 'var(--font-sketch)',
            fontSize: 12,
            color: 'var(--tool-text-muted)',
            marginBottom: 8,
          }}>
            Écran actuel
          </div>
          <div style={{
            fontFamily: 'var(--font-sketch)',
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 12,
            color: 'var(--tool-text)',
          }}>
            {currentScreen?.name}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={goBack}
              style={{
                padding: '6px 12px',
                opacity: canGoBack ? 1 : 0.4,
                flex: 1,
                background: 'none',
                border: '2px solid var(--tool-border)',
                borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
                fontFamily: 'var(--font-sketch)',
                cursor: canGoBack ? 'pointer' : 'default',
                color: 'var(--tool-text)',
              }}
              disabled={!canGoBack}
            >
              ‹ Retour
            </button>
            <button
              onClick={goForward}
              style={{
                padding: '6px 12px',
                opacity: canGoForward ? 1 : 0.4,
                flex: 1,
                background: 'none',
                border: '2px solid var(--tool-border)',
                borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
                fontFamily: 'var(--font-sketch)',
                cursor: canGoForward ? 'pointer' : 'default',
                color: 'var(--tool-text)',
              }}
              disabled={!canGoForward}
            >
              Suivant ›
            </button>
          </div>
        </div>

        {/* User Stories for this screen */}
        {linkedStories.length > 0 && (
          <div style={{
            borderBottom: '1px solid var(--tool-border-light)',
            maxHeight: '40%',
            overflow: 'auto',
          }}>
            <div style={{
              fontFamily: 'var(--font-sketch)',
              fontSize: 12,
              color: 'var(--tool-text-muted)',
              padding: '12px 16px 8px',
              position: 'sticky',
              top: 0,
              background: 'var(--tool-surface)',
            }}>
              User Stories ({linkedStories.length})
            </div>
            {linkedStories.map((story) => (
              <a
                key={story.id}
                href={getStoryUrl(story.id)}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateToStory(story.id);
                }}
                style={{
                  display: 'block',
                  padding: '8px 16px',
                  borderBottom: '1px solid var(--tool-border-light)',
                  textDecoration: 'none',
                  color: 'var(--tool-text)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '1px 6px',
                    background: priorityColors[story.priority],
                    color: 'white',
                    borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
                    fontSize: 9,
                    fontFamily: 'var(--font-sketch)',
                  }}>
                    P{story.priority}
                  </span>
                  <span style={{
                    display: 'inline-block',
                    padding: '1px 6px',
                    background: categoryColors[story.category],
                    color: 'white',
                    borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
                    fontSize: 9,
                    fontFamily: 'var(--font-sketch)',
                  }}>
                    {categoryLabels[story.category]}
                  </span>
                </div>
                <div style={{
                  fontFamily: 'var(--font-sketch)',
                  fontSize: 12,
                  lineHeight: 1.4,
                }}>
                  {story.title}
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Screen list */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '8px 0',
        }}>
          <div style={{
            fontFamily: 'var(--font-sketch)',
            fontSize: 12,
            color: 'var(--tool-text-muted)',
            padding: '8px 16px',
          }}>
            Tous les écrans
          </div>
          {screens.map((s) => (
            <div
              key={s.id}
              onClick={() => navigate(s.id)}
              style={{
                padding: '10px 16px',
                fontFamily: 'var(--font-sketch)',
                fontSize: 14,
                cursor: 'pointer',
                background: s.id === currentScreenId ? 'var(--tool-border-light)' : 'transparent',
                borderLeft: s.id === currentScreenId ? '3px solid var(--tool-text)' : '3px solid transparent',
                color: 'var(--tool-text)',
              }}
            >
              {s.name}
            </div>
          ))}
        </div>
      </div>

      {/* Phone preview area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Mobile header */}
        {isMobile && (
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--tool-border-light)',
            background: 'var(--tool-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                padding: '8px 12px',
                background: 'none',
                border: '2px solid var(--tool-border)',
                borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
                fontFamily: 'var(--font-sketch)',
                cursor: 'pointer',
                color: 'var(--tool-text)',
                fontSize: 14,
              }}
            >
              ☰ Menu
            </button>
            <span style={{
              fontFamily: 'var(--font-sketch)',
              fontSize: 14,
              fontWeight: 'bold',
              color: 'var(--tool-text)',
              flex: 1,
              textAlign: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {currentScreen?.name}
            </span>
            <button
              onClick={onBack}
              style={{
                padding: '8px 12px',
                background: 'none',
                border: '2px solid var(--tool-border)',
                borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
                fontFamily: 'var(--font-sketch)',
                cursor: 'pointer',
                color: 'var(--tool-text)',
                fontSize: 14,
              }}
            >
              ← Retour
            </button>
          </div>
        )}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? 12 : 24,
          overflow: 'hidden',
        }}>
          <div style={{
            maxHeight: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              transform: 'scale(var(--phone-scale, 1))',
              transformOrigin: 'center center',
            }}>
              <ScaledPhoneFrame isMobile={isMobile}>
                {ScreenComponent && <ScreenComponent navigate={navigate} />}
              </ScaledPhoneFrame>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScaledPhoneFrame({ children, isMobile = false }: { children: React.ReactNode; isMobile?: boolean }) {
  const phoneWidth = 375;
  const phoneHeight = 812;

  // Calculate scale to fit in viewport with some padding
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    const calculateScale = () => {
      const mobileHeaderHeight = isMobile ? 56 : 0;
      const padding = isMobile ? 24 : 48;
      const sidebarWidth = isMobile ? 0 : 280;

      const availableHeight = window.innerHeight - padding - mobileHeaderHeight;
      const availableWidth = window.innerWidth - sidebarWidth - padding;

      const scaleByHeight = availableHeight / phoneHeight;
      const scaleByWidth = availableWidth / phoneWidth;

      const newScale = Math.min(scaleByHeight, scaleByWidth, 1);
      setScale(Math.max(0.4, newScale)); // minimum 40% scale for mobile
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [isMobile]);

  return (
    <div style={{
      width: phoneWidth * scale,
      height: phoneHeight * scale,
      overflow: 'hidden',
    }}>
      <div style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: phoneWidth,
        height: phoneHeight,
      }}>
        <PhoneFrame>
          {children}
        </PhoneFrame>
      </div>
    </div>
  );
}
