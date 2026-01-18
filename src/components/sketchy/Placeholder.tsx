import React from 'react';

interface PlaceholderProps {
  width?: string | number;
  height?: string | number;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Placeholder({
  width = '100%',
  height = 100,
  label = 'Image',
  className = '',
  style
}: PlaceholderProps) {
  return (
    <div
      className={`sketchy-placeholder ${className}`}
      style={{ width, height, ...style }}
    >
      {label}
    </div>
  );
}
