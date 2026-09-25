import React, { useState } from 'react';
import { ShieldCheck, Lock, User, ArrowRight, Zap, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';

export function LoginPage() {
  const { login, loading } = useAuth();
  const { addToast } = useToast();
  const { isDark, toggleTheme } = useTheme();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('1');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu');
      return;
    }

    const res = await login(username.trim(), password.trim());
    if (res.success) {
      addToast('Đăng nhập Super Admin thành công!', 'success');
    } else {
      setErrorMsg(res.error || 'Tài khoản hoặc mật khẩu không chính xác');
    }
  };

  const handleQuickFill = () => {
    setUsername('admin');
    setPassword('1');
    setErrorMsg('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `
          radial-gradient(circle at 15% 20%, rgba(99, 102, 241, 0.12) 0%, transparent 45%),
          radial-gradient(circle at 85% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 45%),
          var(--bg-app)
        `,
        padding: '1.5rem',
        position: 'relative',
      }}
    >
      {/* Theme Switcher in top right */}
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
        <button
          className="btn btn-outline btn-icon"
          onClick={toggleTheme}
          title={isDark ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} color="#4f46e5" />}
        </button>
      </div>

      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-xl)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-card)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, var(--primary) 0%, #a855f7 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: 'var(--shadow-glow)',
              marginBottom: '1rem',
            }}
          >
            <ShieldCheck size={32} />
          </div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.35rem' }}>Super Admin Portal</h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Hệ Thống Phân Quyền & Quản Trị Feature Flag Tập Trung
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              background: 'var(--danger-light)',
              border: '1px solid var(--danger-border)',
              color: 'var(--danger)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-username">Tên đăng nhập</label>
            <div style={{ position: 'relative' }}>
              <User
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                id="login-username"
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" htmlFor="login-password">Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                id="login-password"
                type="password"
                className="form-control"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.8rem', fontSize: '0.95rem' }}
            disabled={loading}
          >
            <span>{loading ? 'Đang xác thực...' : 'Đăng Nhập Quản Trị'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div
          style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Mặc định: <code>admin / 1</code>
          </span>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={handleQuickFill}
            style={{ color: 'var(--accent-cyan)', gap: '0.35rem' }}
          >
            <Zap size={14} />
            <span>Điền nhanh</span>
          </button>
        </div>
      </div>
    </div>
  );
}
