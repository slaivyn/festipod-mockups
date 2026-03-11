import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary';
  children: React.ReactNode;
}

export function Button({ variant = 'default', children, className = '', ...props }: ButtonProps) {
  const variantClass = variant === 'primary' ? 'sketchy-btn-primary' : '';

  return (
    <button
      className={`sketchy-btn ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
