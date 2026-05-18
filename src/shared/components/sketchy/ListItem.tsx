import React from 'react';

interface ListItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ListItem({ children, onClick, className = '' }: ListItemProps) {
  return (
    <div
      className={`app-list-item ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
