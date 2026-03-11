import React from 'react';

interface NavItem {
  icon: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
}

export function NavBar({ items, className = '' }: NavBarProps) {
  return (
    <div className={`sketchy-navbar ${className}`}>
      {items.map((item, index) => (
        <div
          key={index}
          className={`nav-item ${item.active ? 'active' : ''}`}
          onClick={item.onClick}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            cursor: 'pointer',
            opacity: item.active ? 1 : 0.6,
          }}
        >
          <span style={{ fontSize: 20 }}>{item.icon}</span>
          <span style={{ fontSize: 12 }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
