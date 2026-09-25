import React, { useState, useEffect } from 'react';
import { History, RefreshCw, Filter, ShieldCheck } from 'lucide-react';
import { SearchFilterBar } from '../components/common/SearchFilterBar';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { useToast } from '../context/ToastContext';
import { auditApi } from '../api/auditApi';

export function AuditLogsPage() {
  const { addToast } = useToast();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await auditApi.getAllLogs(100);
      setLogs(data);
    } catch (err) {
      addToast(err.message || 'Không thể tải lịch sử kiểm toán', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchQuery =
      (log.tenantCode && log.tenantCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.featureKey && log.featureKey.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.performedBy && log.performedBy.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchQuery) return false;
    if (actionFilter === 'GRANT') return log.action === 'GRANT';
    if (actionFilter === 'REVOKE') return log.action === 'REVOKE';
    return true;
  });

  return (
    <div className="animate-fade-in">
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Tìm theo Tenant, Feature Key, Người thao tác..."
        filterOptions={[
          { label: 'Tất cả hành động', value: 'ALL' },
          { label: 'Cấp quyền (GRANT)', value: 'GRANT' },
          { label: 'Thu hồi (REVOKE)', value: 'REVOKE' },
        ]}
        currentFilter={actionFilter}
        onFilterChange={setActionFilter}
        actionButton={
          <button className="btn btn-secondary" onClick={loadLogs}>
            <RefreshCw size={15} />
            <span>Làm Mới</span>
          </button>
        }
      />

      {loading ? (
        <LoadingSkeleton rows={6} height={50} />
      ) : (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '180px' }}>Thời Gian</th>
                <th>Hành Động</th>
                <th>Mã Tenant</th>
                <th>Feature Key</th>
                <th>Người Thực Hiện</th>
                <th>Chi Tiết Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    Không tìm thấy bản ghi kiểm toán nào
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {log.timestamp ? new Date(log.timestamp).toLocaleString('vi-VN') : 'N/A'}
                    </td>
                    <td>
                      <StatusBadge
                        status={log.action === 'GRANT' ? 'GRANTED' : 'REVOKED'}
                        label={log.action}
                      />
                    </td>
                    <td>
                      <code style={{ color: '#818cf8', fontWeight: 700 }}>{log.tenantCode}</code>
                    </td>
                    <td>
                      <code style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{log.featureKey}</code>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <ShieldCheck size={14} color="var(--success)" />
                        <span style={{ fontSize: '0.85rem' }}>{log.performedBy || 'admin'}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                      {log.details || 'Cập nhật trạng thái phân quyền'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
