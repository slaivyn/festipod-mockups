import React from 'react';

interface DividerProps {
  className?: string;
}

export function Divider({ className = '' }: DividerProps) {
  return <div className={`sketchy-divider ${className}`} />;
}
