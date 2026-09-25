import React from 'react';

export function StatusBadge({ status, label }) {
  const normalized = typeof status === 'string' ? status.toUpperCase() : String(status ?? '').toUpperCase();

  if (normalized === 'ACTIVE' || normalized === 'TRUE' || status === true) {
    return (
      <span className="badge badge-active">
        <span className="badge-dot"></span>
        {label || 'ACTIVE'}
      </span>
    );
  }

  if (normalized === 'GRANTED') {
    return (
      <span className="badge badge-granted">
        <span className="badge-dot" style={{ background: '#818cf8' }}></span>
        {label || 'GRANTED'}
      </span>
    );
  }

  if (normalized === 'REVOKED') {
    return (
      <span className="badge badge-revoked">
        <span className="badge-dot" style={{ background: '#f87171' }}></span>
        {label || 'REVOKED'}
      </span>
    );
  }

  return (
    <span className="badge badge-inactive">
      <span className="badge-dot"></span>
      {label || 'INACTIVE'}
    </span>
  );
}
