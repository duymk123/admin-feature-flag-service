import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Building2,
  Globe,
  Network,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { ToggleSwitch } from '../common/ToggleSwitch';
import { StatusBadge } from '../common/StatusBadge';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { grantApi } from '../../api/grantApi';
import { useToast } from '../../context/ToastContext';

export function TenantGrantModal({ isOpen, onClose, tenant, onUpdated }) {
  const { addToast } = useToast();
  const [grants, setGrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [batchUpdating, setBatchUpdating] = useState(false);

  useEffect(() => {
    if (isOpen && tenant?.tenantCode) {
      loadGrants();
    }
  }, [isOpen, tenant]);

  const loadGrants = async () => {
    setLoading(true);
    try {
      const data = await grantApi.getTenantGrants(tenant.tenantCode);
      setGrants(data);
    } catch (err) {
      addToast(err.message || `Không thể tải quyền cho Tenant ${tenant.tenantCode}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSingle = async (grant) => {
    const nextState = !grant.isGranted;
    // Optimistic UI update
    setGrants((prev) =>
      prev.map((g) => (g.featureKey === grant.featureKey ? { ...g, isGranted: nextState } : g))
    );

    try {
      await grantApi.toggleGrant(tenant.tenantCode, grant.featureKey, nextState, 'admin');
      addToast(
        `Đã ${nextState ? 'CẤP' : 'THU HỒI'} cờ ${grant.featureKey} cho ${tenant.tenantCode}`,
        'success'
      );
      if (onUpdated) onUpdated();
    } catch (err) {
      // Revert on error
      setGrants((prev) =>
        prev.map((g) => (g.featureKey === grant.featureKey ? { ...g, isGranted: !nextState } : g))
      );
      addToast(err.message || 'Cập nhật quyền thất bại', 'error');
    }
  };

  const handleBatchToggle = async (grantAll) => {
    setBatchUpdating(true);
    const targetKeys = grantAll ? grants.map((g) => g.featureKey) : [];
    try {
      const updated = await grantApi.batchUpdateGrants(tenant.tenantCode, targetKeys, 'admin');
      setGrants(updated);
      addToast(
        grantAll
          ? `Đã CẤP TẤT CẢ cờ cho ${tenant.tenantCode}`
          : `Đã THU HỒI TẤT CẢ cờ của ${tenant.tenantCode}`,
        'success'
      );
      if (onUpdated) onUpdated();
    } catch (err) {
      addToast(err.message || 'Cập nhật hàng loạt thất bại', 'error');
    } finally {
      setBatchUpdating(false);
    }
  };

  const handleApplySnapshot = async () => {
    if (!tenant?.tenantCode) return;
    setApplying(true);
    try {
      addToast(`Đang Apply snapshot cho ${tenant.tenantCode}...`, 'info');
      const res = await grantApi.applyForTenant(tenant.tenantCode);
      if (res?.status === 'FAILED') {
        addToast(`Apply thất bại: ${res?.error || 'Instance không phản hồi'}`, 'error');
      } else {
        addToast(`⚡ Đã Apply snapshot cấu hình sang container của ${tenant.tenantCode}!`, 'success');
      }
    } catch (err) {
      addToast(err.message || 'Apply thất bại', 'error');
    } finally {
      setApplying(false);
    }
  };

  const grantedCount = grants.filter((g) => g.isGranted).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Phân Quyền Tính Năng — ${tenant?.tenantCode || ''}`}
      maxWidth={640}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{grantedCount}</span> / {grants.length} cờ đang kích hoạt
          </div>
          <button className="btn btn-secondary" onClick={onClose}>
            Đóng
          </button>
        </div>
      }
    >
      {/* Tenant summary banner */}
      <div
        className="glass-panel"
        style={{
          padding: '0.85rem 1.15rem',
          marginBottom: '1rem',
          borderColor: 'rgba(99, 102, 241, 0.3)',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(6, 182, 212, 0.05) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <Building2 size={16} color="var(--accent-cyan)" />
            <span style={{ fontWeight: 700, fontSize: '0.98rem' }}>{tenant?.name}</span>
            <StatusBadge status={tenant?.status || 'ACTIVE'} />
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>IP: <code>{tenant?.ipAddress || '127.0.0.1'}</code></span>
            <span>URL: <code style={{ color: 'var(--accent-cyan)' }}>{tenant?.serviceUrl || 'N/A'}</code></span>
          </div>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={handleApplySnapshot}
          disabled={applying}
          style={{ gap: '0.4rem', whiteSpace: 'nowrap', padding: '0.45rem 0.9rem' }}
          title={`Đẩy cấu hình snapshot cờ sang instance của ${tenant?.tenantCode}`}
        >
          <Zap size={14} />
          <span>{applying ? 'Đang Apply...' : `Apply Cho ${tenant?.tenantCode || ''}`}</span>
        </button>
      </div>

      {/* Quick Action Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.85rem',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Danh sách cờ Master có thể cấp phép:
        </span>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => handleBatchToggle(true)}
            disabled={batchUpdating || loading}
            style={{ color: 'var(--success)', fontSize: '0.8rem', gap: '0.3rem', padding: '0.25rem 0.5rem' }}
          >
            <CheckCircle2 size={14} />
            <span>Cấp Tất Cả</span>
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => handleBatchToggle(false)}
            disabled={batchUpdating || loading}
            style={{ color: 'var(--danger)', fontSize: '0.8rem', gap: '0.3rem', padding: '0.25rem 0.5rem' }}
          >
            <XCircle size={14} />
            <span>Thu Hồi Tất Cả</span>
          </button>
        </div>
      </div>

      {/* Grants List */}
      {loading ? (
        <LoadingSkeleton rows={3} height={70} />
      ) : grants.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
          Chưa có Master Feature nào được tạo trong hệ thống.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {grants.map((grant) => {
            const isMasterActive = grant.masterActive;

            return (
              <div
                key={grant.grantId || grant.featureKey}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: grant.isGranted ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-glass)',
                  border: grant.isGranted
                    ? '1px solid rgba(99, 102, 241, 0.4)'
                    : '1px solid var(--border-subtle)',
                  transition: 'all 0.2s ease',
                  gap: '1rem',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{grant.featureName}</span>
                    <code style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 600 }}>{grant.featureKey}</code>
                    <StatusBadge
                      status={grant.isGranted ? 'GRANTED' : 'REVOKED'}
                      label={grant.isGranted ? 'Đã Cấp' : 'Chưa Cấp'}
                    />
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.35 }}>
                    {grant.featureDescription || 'Không có mô tả chi tiết'}
                  </p>
                  {!isMasterActive && (
                    <div
                      style={{
                        marginTop: '0.4rem',
                        fontSize: '0.72rem',
                        color: '#fbbf24',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      <ShieldAlert size={12} />
                      <span>Cờ này đang tắt toàn cục (Master Inactive)</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: grant.isGranted ? 'var(--success)' : 'var(--text-muted)' }}>
                    {grant.isGranted ? 'BẬT' : 'TẮT'}
                  </span>
                  <ToggleSwitch
                    checked={grant.isGranted}
                    onChange={() => handleToggleSingle(grant)}
                    ariaLabel={`Cấp quyền ${grant.featureKey}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
