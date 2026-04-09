import React from 'react';

interface HeaderProps {
  title?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}

export function Header({ title, left, right, className = '' }: HeaderProps) {
  return (
    <div className={`app-header ${className}`}>
      <div style={{ width: 40 }}>{left}</div>
      <div className="app-subtitle" style={{ margin: 0 }}>{title}</div>
      <div style={{ width: 40, textAlign: 'right' }}>{right}</div>
    </div>
  );
}
