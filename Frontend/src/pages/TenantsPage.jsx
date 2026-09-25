import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Building2, SlidersHorizontal, AlertTriangle, Network, Globe } from 'lucide-react';
import { SearchFilterBar } from '../components/common/SearchFilterBar';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { TenantGrantModal } from '../components/tenant/TenantGrantModal';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { useToast } from '../context/ToastContext';
import { tenantApi } from '../api/tenantApi';
import { grantApi } from '../api/grantApi';

export function TenantsPage({ setActiveTab, setSelectedTenantCode }) {
  const { addToast } = useToast();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [deletingTenant, setDeletingTenant] = useState(null);
  const [grantTenant, setGrantTenant] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    tenantCode: '',
    name: '',
    ipAddress: '',
    serviceUrl: '',
    status: 'ACTIVE',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    setLoading(true);
    try {
      const data = await tenantApi.getAll();
      setTenants(data);
    } catch (err) {
      addToast(err.message || 'Không thể tải danh sách Tenants', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingTenant(null);
    setFormData({
      tenantCode: '',
      name: '',
      ipAddress: '127.0.0.1',
      serviceUrl: 'http://tracking-order-a:8080',
      status: 'ACTIVE',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (t) => {
    setEditingTenant(t);
    setFormData({
      tenantCode: t.tenantCode,
      name: t.name,
      ipAddress: t.ipAddress || '',
      serviceUrl: t.serviceUrl || '',
      status: t.status || 'ACTIVE',
    });
    setIsFormOpen(true);
  };

  const handleOpenDelete = (t) => {
    setDeletingTenant(t);
    setIsDeleteOpen(true);
  };

  const handleConfigureGrants = (tenant) => {
    setGrantTenant(tenant);
    setIsGrantModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.tenantCode.trim() || !formData.name.trim()) {
      addToast('Vui lòng điền đầy đủ Mã Tenant và Tên doanh nghiệp', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (editingTenant) {
        await tenantApi.update(editingTenant.id, {
          tenantCode: formData.tenantCode.trim().toUpperCase(),
          name: formData.name.trim(),
          ipAddress: formData.ipAddress.trim(),
          serviceUrl: formData.serviceUrl.trim(),
          status: formData.status,
        });
        addToast('Cập nhật thông tin Tenant thành công', 'success');
      } else {
        await tenantApi.create({
          tenantCode: formData.tenantCode.trim().toUpperCase(),
          name: formData.name.trim(),
          ipAddress: formData.ipAddress.trim(),
          serviceUrl: formData.serviceUrl.trim(),
          status: formData.status,
        });
        addToast('Đăng ký Tenant mới thành công', 'success');
      }
      setIsFormOpen(false);
      loadTenants();
    } catch (err) {
      addToast(err.message || 'Lưu thất bại', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingTenant) return;
    setSubmitting(true);
    try {
      await tenantApi.delete(deletingTenant.id);
      addToast(`Đã xóa Tenant ${deletingTenant.tenantCode}`, 'success');
      setIsDeleteOpen(false);
      loadTenants();
    } catch (err) {
      addToast(err.message || 'Xóa thất bại', 'error');
    } finally {
      setSubmitting(false);
    }
  };



  const filteredTenants = tenants.filter((t) => {
    const matchQuery =
      t.tenantCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.serviceUrl && t.serviceUrl.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.ipAddress && t.ipAddress.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchQuery) return false;
    if (statusFilter === 'ACTIVE') return t.status === 'ACTIVE';
    if (statusFilter === 'INACTIVE') return t.status === 'INACTIVE';
    return true;
  });

  return (
    <div className="animate-fade-in">
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Tìm theo Mã Tenant, Tên, IP hoặc Service URL..."
        filterOptions={[
          { label: 'Tất cả', value: 'ALL' },
          { label: 'Đang Hoạt Động', value: 'ACTIVE' },
          { label: 'Tạm Ngưng', value: 'INACTIVE' },
        ]}
        currentFilter={statusFilter}
        onFilterChange={setStatusFilter}
        actionButton={
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <Plus size={16} />
            <span>Đăng Ký Tenant Mới</span>
          </button>
        }
      />

      {loading ? (
        <LoadingSkeleton rows={5} height={52} />
      ) : (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã Tenant</th>
                <th>Tên Khách Hàng / Instance</th>
                <th>IP Address</th>
                <th>Service URL (Docker Network)</th>
                <th>Cờ Cấp Phép</th>
                <th>Trạng Thái</th>
                <th style={{ textAlign: 'right' }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    Không tìm thấy Tenant nào phù hợp
                  </td>
                </tr>
              ) : (
                filteredTenants.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <Building2 size={16} color="var(--accent-cyan)" />
                        <code style={{ color: '#818cf8', fontWeight: 700 }}>{t.tenantCode}</code>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{t.name}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Globe size={13} color="var(--text-muted)" />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {t.ipAddress || '127.0.0.1'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Network size={13} color="var(--accent-cyan)" />
                        <code style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)' }}>
                          {t.serviceUrl || 'N/A'}
                        </code>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-granted">
                        {t.grantedFeatureCount || 0} cờ được cấp
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={t.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleConfigureGrants(t)}
                          title="Cấu hình quyền cờ trực tiếp"
                          style={{ gap: '0.35rem', padding: '0.3rem 0.65rem' }}
                        >
                          <SlidersHorizontal size={14} />
                          <span>Phân Quyền</span>
                        </button>
                        <button
                          className="btn btn-ghost btn-icon btn-sm"
                          onClick={() => handleOpenEdit(t)}
                          title="Chỉnh sửa Tenant"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          className="btn btn-ghost btn-icon btn-sm"
                          onClick={() => handleOpenDelete(t)}
                          style={{ color: 'var(--danger)' }}
                          title="Xóa Tenant"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form Thêm / Sửa */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingTenant ? 'Chỉnh Sửa Thông Tin Tenant' : 'Đăng Ký Dedicated Tenant Mới'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
              Hủy
            </button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Đang lưu...' : editingTenant ? 'Lưu Thay Đổi' : 'Đăng Ký Tenant'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="tenant-code">Mã Tenant (Duy Nhất)</label>
            <input
              id="tenant-code"
              type="text"
              className="form-control"
              placeholder="VD: COMPANY_C, VIETTEL_PAY"
              value={formData.tenantCode}
              onChange={(e) => setFormData({ ...formData, tenantCode: e.target.value.toUpperCase() })}
              required
            />
            <div className="form-hint">Mã viết hoa, không dấu (ví dụ: COMPANY_A, COMPANY_B).</div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="tenant-name">Tên Doanh Nghiệp / Đối Tác</label>
            <input
              id="tenant-name"
              type="text"
              className="form-control"
              placeholder="VD: Viettel Digital Services"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="tenant-service-url">
              Service URL (Docker Container Network)
            </label>
            <input
              id="tenant-service-url"
              type="text"
              className="form-control"
              placeholder="VD: http://tracking-order-a:8080"
              value={formData.serviceUrl}
              onChange={(e) => setFormData({ ...formData, serviceUrl: e.target.value })}
            />
            <div className="form-hint">URL nội bộ Docker dùng để sync cấu hình cờ qua mạng.</div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="tenant-ip">IP Address (Máy Chủ / Whitelist)</label>
            <input
              id="tenant-ip"
              type="text"
              className="form-control"
              placeholder="VD: 127.0.0.1 hoặc 10.0.0.1"
              value={formData.ipAddress}
              onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="tenant-status">Trạng Thái Hoạt Động</label>
            <select
              id="tenant-status"
              className="form-control"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="ACTIVE">ACTIVE (Đang hoạt động)</option>
              <option value="INACTIVE">INACTIVE (Tạm ngưng)</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Modal Xác Nhận Xóa */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Xác Nhận Xóa Tenant"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsDeleteOpen(false)}>
              Hủy
            </button>
            <button className="btn btn-danger" onClick={handleDelete} disabled={submitting}>
              {submitting ? 'Đang xóa...' : 'Xóa Tenant'}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--danger-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={22} color="var(--danger)" />
          </div>
          <div>
            <h4 style={{ marginBottom: '0.35rem' }}>Bạn có chắc muốn xóa Tenant này?</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Tenant <code style={{ color: '#818cf8', fontWeight: 700 }}>{deletingTenant?.tenantCode}</code> ({deletingTenant?.name})
              và toàn bộ phân quyền cờ liên kết sẽ bị xóa vĩnh viễn.
            </p>
          </div>
        </div>
      </Modal>

      {/* Modal Phân Quyền Tại Chỗ */}
      <TenantGrantModal
        isOpen={isGrantModalOpen}
        onClose={() => setIsGrantModalOpen(false)}
        tenant={grantTenant}
        onUpdated={loadTenants}
      />
    </div>
  );
}
