import React from 'react';

interface AvatarProps {
  initials?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 32,
  md: 40,
  lg: 56,
};

export function Avatar({ initials = '?', size = 'md', className = '' }: AvatarProps) {
  const pixelSize = sizeMap[size];

  return (
    <div
      className={`sketchy-avatar ${className}`}
      style={{
        width: pixelSize,
        height: pixelSize,
        fontSize: pixelSize * 0.45,
      }}
    >
      {initials}
    </div>
  );
}
