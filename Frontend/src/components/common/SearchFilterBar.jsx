import React from 'react';
import { Search } from 'lucide-react';

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  placeholder = 'Tìm kiếm...',
  filterOptions = [],
  currentFilter = 'ALL',
  onFilterChange,
  actionButton,
}) {
  return (
    <div className="toolbar">
      <div className="search-input-wrap">
        <Search className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

      <div className="toolbar-actions">
        {filterOptions.length > 0 && (
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                className={`btn btn-sm ${currentFilter === opt.value ? 'btn-secondary' : 'btn-ghost'}`}
                onClick={() => onFilterChange?.(opt.value)}
                style={{
                  fontWeight: currentFilter === opt.value ? 700 : 500,
                  borderColor: currentFilter === opt.value ? 'var(--primary)' : undefined,
                  color: currentFilter === opt.value ? '#818cf8' : undefined,
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
        {actionButton}
      </div>
    </div>
  );
}
