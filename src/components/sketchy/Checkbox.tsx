import React from 'react';

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export function Checkbox({ checked = false, onChange, className = '' }: CheckboxProps) {
  return (
    <div
      className={`sketchy-checkbox ${checked ? 'checked' : ''} ${className}`}
      onClick={() => onChange?.(!checked)}
    />
  );
}
