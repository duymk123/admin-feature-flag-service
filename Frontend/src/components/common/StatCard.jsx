import React from 'react';

export function StatCard({ label, value, description, icon: Icon, color = 'indigo' }) {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {description && <div className="stat-desc">{description}</div>}
      </div>
      {Icon && (
        <div className={`stat-icon-wrapper stat-icon-${color}`}>
          <Icon size={22} />
        </div>
      )}
    </div>
  );
}
