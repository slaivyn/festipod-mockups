import React from 'react';
import { ToastContainer } from './Toast';

interface PhoneFrameProps {
  children: React.ReactNode;
  scale?: number;
  className?: string;
}

export function PhoneFrame({ children, scale = 1, className = '' }: PhoneFrameProps) {
  const width = 375;
  const height = 812;

  return (
    <div
      className={`phone-frame-wrapper ${className}`}
      style={{
        width: width * scale,
        height: height * scale,
        position: 'relative',
        background: '#fff',
        borderRadius: 40 * scale,
        border: `1px solid #e0e0e0`,
        boxShadow: '0 25px 80px rgba(0,0,0,0.12), 0 4px 20px rgba(0,0,0,0.06)',
        overflow: 'hidden',
      }}
    >
      {/* Notch */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 150 * scale,
          height: 28 * scale,
          background: '#1a1a1a',
          borderBottomLeftRadius: 14 * scale,
          borderBottomRightRadius: 16 * scale,
          zIndex: 10,
        }}
      />

      {/* Screen content */}
      <div
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Status bar */}
        <div
          style={{
            height: 44 * scale,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `0 ${20 * scale}px`,
            fontSize: 12 * scale,
            fontFamily: 'var(--font-app)',
            fontWeight: 600,
            flexShrink: 0,
            color: '#1a1a1a',
          }}
        >
          <span>9:41</span>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <svg width="16" height="12" viewBox="0 0 16 12"><rect x="0" y="4" width="3" height="8" rx="1" fill="#1a1a1a"/><rect x="4.5" y="2.5" width="3" height="9.5" rx="1" fill="#1a1a1a"/><rect x="9" y="0.5" width="3" height="11.5" rx="1" fill="#1a1a1a"/><rect x="13.5" y="0" width="2.5" height="12" rx="0.8" fill="#1a1a1a"/></svg>
            <svg width="24" height="12" viewBox="0 0 24 12"><rect x="0" y="0" width="22" height="12" rx="3" stroke="#1a1a1a" strokeWidth="1.2" fill="none"/><rect x="22.5" y="3.5" width="1.5" height="5" rx="0.5" fill="#1a1a1a"/><rect x="1.5" y="1.5" width="16" height="9" rx="2" fill="#34C759"/></svg>
          </div>
        </div>

        {/* Main content area */}
        <div
          className="phone-screen"
          style={{
            flex: 1,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {children}
          <ToastContainer />
        </div>

        {/* Home indicator */}
        <div
          style={{
            height: 34 * scale,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 134 * scale,
              height: 5 * scale,
              background: '#1a1a1a',
              borderRadius: 3 * scale,
            }}
          />
        </div>
      </div>
    </div>
  );
}
