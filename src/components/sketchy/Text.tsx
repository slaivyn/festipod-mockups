import React from 'react';

interface TextProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function Title({ children, className = '', style }: TextProps) {
  return <h1 className={`app-title ${className}`} style={style}>{children}</h1>;
}

export function Subtitle({ children, className = '', style }: TextProps) {
  return <h2 className={`app-subtitle ${className}`} style={style}>{children}</h2>;
}

export function Text({ children, className = '', style, onClick }: TextProps) {
  return <p className={`app-text ${className}`} style={style} onClick={onClick}>{children}</p>;
}
