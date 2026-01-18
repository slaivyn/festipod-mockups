import React from 'react';

interface PlaceholderProps {
  width?: string | number;
  height?: string | number;
  label?: string;
  className?: string;
}

export function Placeholder({
  width = '100%',
  height = 100,
  label = 'Image',
  className = ''
}: PlaceholderProps) {
  return (
    <div
      className={`sketchy-placeholder ${className}`}
      style={{ width, height }}
    >
      {label}
    </div>
  );
}
