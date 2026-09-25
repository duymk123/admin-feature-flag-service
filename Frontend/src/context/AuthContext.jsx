import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleUnauthorized = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await authApi.login(username, password);
      const data = response?.data;
      if (data?.token) {
        setToken(data.token);
        const userInfo = {
          username: data.username || username,
          role: data.role || 'SUPER_ADMIN',
        };
        setUser(userInfo);
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify(userInfo));
        return { success: true };
      }
      throw new Error(response?.message || 'Đăng nhập không thành công');
    } catch (error) {
      return { success: false, error: error.message || 'Lỗi kết nối máy chủ' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  };

  const value = {
    isAuthenticated: !!token,
    token,
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
