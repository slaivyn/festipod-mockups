import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Badge({ children, className = '', style }: BadgeProps) {
  return (
    <span className={`app-badge ${className}`} style={style}>
      {children}
    </span>
  );
}

interface TagProps {
  label: string;
  color?: string;
  bg?: string;
  className?: string;
}

export function Tag({ label, color, bg, className = '' }: TagProps) {
  return (
    <span
      className={`app-tag ${className}`}
      style={{
        ...(color ? { color } : {}),
        ...(bg ? { background: bg } : {}),
      }}
    >
      {label}
    </span>
  );
}

interface RelevanceIconProps {
  level?: number;
}

export function RelevanceIcon({ level }: RelevanceIconProps) {
  if (!level) return null;
  const icons: Record<number, string> = { 1: '+', 2: '++', 3: '+++' };
  const colors: Record<number, string> = { 1: '#D69E2E', 2: '#E8590C', 3: '#C53030' };
  const bgs: Record<number, string> = { 1: '#FFFBEB', 2: '#FFF7ED', 3: '#FFF5F5' };
  return (
    <div style={{
      background: bgs[level],
      borderRadius: 8,
      padding: '3px 10px',
      fontSize: 13,
      fontWeight: 800,
      color: colors[level],
      whiteSpace: 'nowrap',
      letterSpacing: -0.5,
      fontFamily: 'monospace',
    }}>
      {icons[level]}
    </div>
  );
}
