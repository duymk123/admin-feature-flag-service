import React, { useState, useEffect } from 'react';
import { Flag, Building2, SlidersHorizontal, History, Plus, ArrowRight, CheckCircle, ShieldAlert } from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { featureApi } from '../api/featureApi';
import { tenantApi } from '../api/tenantApi';
import { auditApi } from '../api/auditApi';

export function DashboardPage({ setActiveTab }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalFeatures: 0,
    activeFeatures: 0,
    totalTenants: 0,
    activeTenants: 0,
    totalGrants: 0,
  });
  const [recentAudits, setRecentAudits] = useState([]);
  const [features, setFeatures] = useState([]);
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [featList, tenantList, auditList] = await Promise.all([
        featureApi.getAll().catch(() => []),
        tenantApi.getAll().catch(() => []),
        auditApi.getAllLogs(10).catch(() => []),
      ]);

      const activeFeats = featList.filter((f) => f.isActive).length;
      const activeTens = tenantList.filter((t) => t.status === 'ACTIVE').length;
      const grantsCount = tenantList.reduce((sum, t) => sum + (t.grantedFeatureCount || 0), 0);

      setFeatures(featList);
      setTenants(tenantList);
      setRecentAudits(auditList);
      setStats({
        totalFeatures: featList.length,
        activeFeatures: activeFeats,
        totalTenants: tenantList.length,
        activeTenants: activeTens,
        totalGrants: grantsCount,
      });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton rows={6} height={60} />;
  }

  return (
    <div className="animate-fade-in">
      {/* KPI Stats Grid */}
      <div className="stats-grid">
        <StatCard
          label="Master Features"
          value={stats.totalFeatures}
          description={`${stats.activeFeatures} cờ đang BẬT toàn cục`}
          icon={Flag}
          color="indigo"
        />
        <StatCard
          label="Tenants Đăng Ký"
          value={stats.totalTenants}
          description={`${stats.activeTenants} Dedicated instances hoạt động`}
          icon={Building2}
          color="cyan"
        />
        <StatCard
          label="Tổng Quyền Được Cấp"
          value={stats.totalGrants}
          description="Feature Flags được kích hoạt cho các Tenant"
          icon={SlidersHorizontal}
          color="emerald"
        />
        <StatCard
          label="Mô Hình Kiến Trúc"
          value="Dedicated"
          description="Mỗi Tenant 1 Container + DB riêng biệt"
          icon={CheckCircle}
          color="amber"
        />
      </div>

      {/* Quick Action Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
          borderColor: 'rgba(99, 102, 241, 0.3)',
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>
            Phân Quyền & Quản Trị Tính Năng Dedicated Multi-Tenant
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Super Admin có toàn quyền cấp phép (Grant) hoặc thu hồi (Revoke) cờ tính năng cho từng đối tác.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('tenants')}>
            <Building2 size={15} />
            <span>Quản Lý & Phân Quyền Tenants</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Tenants Status Overview */}
        <div className="table-card">
          <div
            style={{
              padding: '1.15rem 1.25rem',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={18} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1.05rem' }}>Danh Sách Tenants Đang Chạy</h3>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('tenants')}>
              <span>Xem tất cả</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Mã Tenant</th>
                <th>Tên Công Ty</th>
                <th>Service URL (Docker)</th>
                <th>Cờ Cấp Phép</th>
                <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {tenants.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    Chưa có Tenant nào được đăng ký
                  </td>
                </tr>
              ) : (
                tenants.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <code style={{ color: '#818cf8', fontWeight: 600 }}>{t.tenantCode}</code>
                    </td>
                    <td>{t.name}</td>
                    <td>
                      <code style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>{t.serviceUrl || 'N/A'}</code>
                    </td>
                    <td>
                      <span className="badge badge-granted">{t.grantedFeatureCount || 0} cờ</span>
                    </td>
                    <td>
                      <StatusBadge status={t.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Recent Audit Logs */}
        <div className="table-card">
          <div
            style={{
              padding: '1.15rem 1.25rem',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <History size={18} color="#818cf8" />
              <h3 style={{ fontSize: '1.05rem' }}>Recent Audit Logs</h3>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('audit')}>
              <span>Xem tất cả</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Thời Gian</th>
                <th>Hành Động</th>
                <th>Tenant</th>
                <th>Feature Key</th>
                <th>Người Thực Hiện</th>
              </tr>
            </thead>
            <tbody>
              {recentAudits.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    Chưa có bản ghi kiểm toán nào
                  </td>
                </tr>
              ) : (
                recentAudits.map((a) => (
                  <tr key={a.id}>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {a.timestamp ? new Date(a.timestamp).toLocaleString('vi-VN') : 'N/A'}
                    </td>
                    <td>
                      <StatusBadge status={a.action} label={a.action} />
                    </td>
                    <td>
                      <code>{a.tenantCode}</code>
                    </td>
                    <td>
                      <code style={{ color: '#818cf8' }}>{a.featureKey}</code>
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>{a.performedBy || 'admin'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
