import React from 'react';

interface HeaderProps {
  title?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}

export function Header({ title, left, right, className = '' }: HeaderProps) {
  return (
    <div className={`sketchy-header ${className}`}>
      <div style={{ width: 40 }}>{left}</div>
      <div className="sketchy-subtitle" style={{ margin: 0 }}>{title}</div>
      <div style={{ width: 40, textAlign: 'right' }}>{right}</div>
    </div>
  );
}
