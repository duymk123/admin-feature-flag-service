import React from 'react';
import {
  LayoutDashboard,
  Building2,
  History,
  BookOpen,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Sidebar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Tổng quan (Dashboard)', icon: LayoutDashboard },
    { id: 'tenants', label: 'Quản lý Tenants', icon: Building2 },
    { id: 'audit', label: 'Audit Log', icon: History },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-icon">
          <ShieldCheck size={22} />
        </div>
        <div className="brand-text">
          <h2>Admin Portal</h2>
          <span>Feature Flags</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Hệ Thống</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon className="icon" />
              <span>{item.label}</span>
            </button>
          );
        })}

        <div className="nav-section-title" style={{ marginTop: '1rem' }}>Tài Liệu API</div>
        <a
          href="http://localhost:8084/docs.html"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-item"
        >
          <BookOpen className="icon" />
          <span>API Portal (Scalar)</span>
        </a>
        <a
          href="http://localhost:8084/swagger-ui.html"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-item"
        >
          <BookOpen className="icon" />
          <span>Swagger UI</span>
        </a>
      </nav>

      <div className="sidebar-footer">
        <div className="user-badge">
          <div className="user-avatar">
            {user?.username?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="user-info">
            <div className="user-name">{user?.username || 'Super Admin'}</div>
            <div className="user-role">SUPER ADMIN</div>
          </div>
        </div>
        <button
          className="btn-ghost btn-icon btn-sm"
          onClick={logout}
          title="Đăng xuất"
          aria-label="Đăng xuất"
        >
          <LogOut size={16} color="var(--danger)" />
        </button>
      </div>
    </aside>
  );
}
