import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { TenantsPage } from './pages/TenantsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';

export function App() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const pageMeta = {
    dashboard: {
      title: 'Bảng Điều Khiển Tổng Quan',
      subtitle: 'Giám sát chỉ số và trạng thái phân phối Feature Flags toàn hệ thống',
    },
    tenants: {
      title: 'Quản Lý Dedicated Tenants',
      subtitle: 'Danh sách các công ty/khách hàng và cấu hình instance chuyên biệt',
    },
    audit: {
      title: 'Audit Log',
      subtitle: 'Lịch sử chi tiết mọi thao tác cấp và thu hồi quyền cờ',
    },
  };

  const currentMeta = pageMeta[activeTab] || pageMeta.dashboard;

  return (
    <AppLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      title={currentMeta.title}
      subtitle={currentMeta.subtitle}
    >
      {activeTab === 'dashboard' && <DashboardPage setActiveTab={setActiveTab} />}
      {activeTab === 'tenants' && <TenantsPage />}
      {activeTab === 'audit' && <AuditLogsPage />}
    </AppLayout>
  );
}
