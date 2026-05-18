import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  accentColor?: string;
}

export function Card({ children, className = '', onClick, style, accentColor }: CardProps) {
  return (
    <div
      className={`app-card ${className}`}
      onClick={onClick}
      style={{
        ...(onClick ? { cursor: 'pointer' } : {}),
        ...(accentColor ? { overflow: 'hidden' } : {}),
        ...style,
      }}
    >
      {accentColor && (
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: accentColor,
          borderRadius: '16px 0 0 16px',
        }} />
      )}
      {accentColor ? (
        <div style={{ paddingLeft: 8 }}>
          {children}
        </div>
      ) : children}
    </div>
  );
}
