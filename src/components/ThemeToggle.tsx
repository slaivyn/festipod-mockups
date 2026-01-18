import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={18} />;
      case 'dark':
        return <Moon size={18} />;
      case 'system':
        return <Monitor size={18} />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Clair';
      case 'dark':
        return 'Sombre';
      case 'system':
        return 'Auto';
    }
  };

  return (
    <button
      onClick={cycleTheme}
      title={`Mode: ${getLabel()} (cliquez pour changer)`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: 'none',
        border: '2px solid var(--tool-border)',
        borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
        padding: '6px 12px',
        fontFamily: 'var(--font-sketch)',
        fontSize: 14,
        cursor: 'pointer',
        color: 'var(--tool-text)',
        transition: 'all 0.2s ease',
      }}
    >
      {getIcon()}
      <span>{getLabel()}</span>
    </button>
  );
}
