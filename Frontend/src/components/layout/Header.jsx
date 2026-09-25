import React from 'react';
import { ExternalLink, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function Header({ title, subtitle }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="top-header">
      <div className="header-title-wrap">
        <div>
          <h1>{title}</h1>
          {subtitle && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="header-actions">
        <div className="backend-status-pill">
          <span className="dot"></span>
          <span>Cluster: Healthy</span>
        </div>

        {/* Light / Dark Mode Switcher */}
        <button
          className="btn btn-outline btn-sm btn-icon"
          onClick={toggleTheme}
          title={isDark ? 'Chuyển sang Giao diện Sáng (Light Mode)' : 'Chuyển sang Giao diện Tối (Dark Mode)'}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} color="#6366f1" />}
        </button>

        <a
          href="http://localhost:8084/docs.html"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm btn-outline"
        >
          <span>OpenAPI Docs</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </header>
  );
}
