import React from 'react';

interface AvatarProps {
  initials?: string;
  name?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | number;
  className?: string;
  online?: boolean;
  border?: string;
}

const sizeMap = {
  sm: 32,
  md: 40,
  lg: 56,
};

export function Avatar({ initials, name, color, size = 'md', className = '', online, border }: AvatarProps) {
  const pixelSize = typeof size === 'number' ? size : sizeMap[size];
  const displayInitials = initials || (name ? name.split(' ').map(n => n[0]).join('').slice(0, 2) : '?');
  const bg = color || '#999';

  return (
    <div
      className={`app-avatar ${className}`}
      style={{
        width: pixelSize,
        height: pixelSize,
        fontSize: pixelSize * 0.38,
        background: bg,
        border: border || 'none',
      }}
    >
      {displayInitials}
      {online && <div className="online-dot" />}
    </div>
  );
}

interface AvatarStackProps {
  people: Array<{ name: string; color: string }>;
  size?: number;
}

export function AvatarStack({ people, size = 28 }: AvatarStackProps) {
  return (
    <div style={{ display: 'flex' }}>
      {people.slice(0, 4).map((p, i) => (
        <div key={i} style={{ marginLeft: i > 0 ? -8 : 0, zIndex: people.length - i }}>
          <Avatar name={p.name} color={p.color} size={size} border="2px solid #fff" />
        </div>
      ))}
      {people.length > 4 && (
        <div style={{
          marginLeft: -8,
          width: size,
          height: size,
          borderRadius: '50%',
          background: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 600,
          color: '#666',
          border: '2px solid #fff',
        }}>
          +{people.length - 4}
        </div>
      )}
    </div>
  );
}
