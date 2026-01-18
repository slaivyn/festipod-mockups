import React from 'react';

interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export function Toggle({ checked = false, onChange, className = '' }: ToggleProps) {
  return (
    <div
      className={`sketchy-toggle ${checked ? 'on' : ''} ${className}`}
      onClick={() => onChange?.(!checked)}
    />
  );
}
