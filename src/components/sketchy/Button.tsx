import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'green' | 'accent-outline';
  children: React.ReactNode;
}

export function Button({ variant = 'default', children, className = '', ...props }: ButtonProps) {
  const variantClass = variant === 'primary' ? 'app-btn-primary'
    : variant === 'green' ? 'app-btn-green'
    : '';

  if (variant === 'accent-outline') {
    return (
      <button
        className={`app-btn ${className}`}
        style={{
          background: 'var(--app-accent-light)',
          borderColor: 'var(--app-accent-border)',
          color: 'var(--app-accent-dark)',
          ...props.style,
        }}
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      className={`app-btn ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
