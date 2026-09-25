import React from 'react';

export function ToggleSwitch({ checked, onChange, disabled, id, ariaLabel }) {
  const switchId = id || `toggle-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <label className="toggle-switch" htmlFor={switchId} title={ariaLabel}>
      <input
        type="checkbox"
        id={switchId}
        checked={!!checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        aria-label={ariaLabel}
      />
      <span className="toggle-slider"></span>
    </label>
  );
}
