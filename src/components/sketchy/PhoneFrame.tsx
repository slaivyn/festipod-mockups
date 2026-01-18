import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
  scale?: number;
  className?: string;
}

export function PhoneFrame({ children, scale = 1, className = '' }: PhoneFrameProps) {
  // iPhone-like dimensions (375 x 812 logical pixels)
  const width = 375;
  const height = 812;

  return (
    <div
      className={className}
      style={{
        width: width * scale,
        height: height * scale,
        position: 'relative',
        background: 'var(--sketch-white)',
        borderRadius: 40 * scale,
        border: `${3 * scale}px solid var(--sketch-black)`,
        boxShadow: `${4 * scale}px ${4 * scale}px 0 var(--sketch-black)`,
        overflow: 'hidden',
        // Sketchy irregular border effect
        borderTopLeftRadius: `${42 * scale}px`,
        borderTopRightRadius: `${38 * scale}px`,
        borderBottomLeftRadius: `${39 * scale}px`,
        borderBottomRightRadius: `${41 * scale}px`,
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
          background: 'var(--sketch-black)',
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
        {/* Status bar area */}
        <div
          style={{
            height: 44 * scale,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `0 ${20 * scale}px`,
            fontSize: 12 * scale,
            fontFamily: 'var(--font-sketch)',
            flexShrink: 0,
          }}
        >
          <span>9:41</span>
          <span style={{ display: 'flex', gap: 4 * scale }}>
            <span>~</span>
            <span>|</span>
            <span>|</span>
          </span>
        </div>

        {/* Main content area */}
        <div
          className="phone-screen"
          style={{
            flex: 1,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
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
              background: 'var(--sketch-black)',
              borderRadius: 3 * scale,
            }}
          />
        </div>
      </div>
    </div>
  );
}
