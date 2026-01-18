import React from 'react';

interface TextProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Title({ children, className = '', style }: TextProps) {
  return <h1 className={`sketchy-title ${className}`} style={style}>{children}</h1>;
}

export function Subtitle({ children, className = '', style }: TextProps) {
  return <h2 className={`sketchy-subtitle ${className}`} style={style}>{children}</h2>;
}

export function Text({ children, className = '', style }: TextProps) {
  return <p className={`sketchy-text ${className}`} style={style}>{children}</p>;
}
