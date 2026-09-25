import React from 'react';

export function LoadingSkeleton({ rows = 4, height = 48 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem' }}>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          style={{
            height: `${height}px`,
            background: 'linear-gradient(90deg, #1e293b 25%, #273549 50%, #1e293b 75%)',
            backgroundSize: '200% 100%',
            borderRadius: 'var(--radius-md)',
            animation: 'pulseGlow 1.5s infinite ease-in-out',
          }}
        />
      ))}
    </div>
  );
}
