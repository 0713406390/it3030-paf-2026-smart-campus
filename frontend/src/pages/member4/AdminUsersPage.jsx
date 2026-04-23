/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react';
import {
  Container, Row, Col, Form, Button, Alert, Spinner, Modal, Table,
} from 'react-bootstrap';
import Navbar from '../../components/member4/Navbar';
import {
  getAllUsers, createUser, updateUser, deleteUser,
} from '../../services/member4/userService';

/* ── helpers ──────────────────────────────────────── */
const ROLES = ['USER', 'TECHNICIAN', 'ADMIN'];

function avatarClass(role) {
  if (role === 'ADMIN') return 'av-admin';
  if (role === 'TECHNICIAN') return 'av-tech';
  return 'av-user';
}
function roleBadgeClass(role) {
  if (role === 'ADMIN') return 'rb-admin';
  if (role === 'TECHNICIAN') return 'rb-technician';
  return 'rb-user';
}
function ini(name) {
  return (name || 'U').split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

const EMPTY_FORM = {
  name: '', email: '', password: '', role: 'USER',
  phone: '', department: '', bio: '', enabled: true,
};

/* ── CSV export ──────────────────────────────────── */
function exportCSV(users) {
  const headers = ['ID', 'Name', 'Email', 'Role', 'Status', 'Department', 'Phone', 'Joined'];
  const escape  = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows    = users.map((u) => [
    u.id, escape(u.name), u.email, u.role,
    u.enabled ? 'Active' : 'Disabled',
    escape(u.department), escape(u.phone),
    u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '',
  ].join(','));
  const csv  = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `smart_campus_users_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ── Print report ────────────────────────────────── */
function printReport(users) {
  const s = {
    total:       users.length,
    active:      users.filter((u) => u.enabled).length,
    disabled:    users.filter((u) => !u.enabled).length,
    admins:      users.filter((u) => u.role === 'ADMIN').length,
    technicians: users.filter((u) => u.role === 'TECHNICIAN').length,
    regular:     users.filter((u) => u.role === 'USER').length,
  };
  const rows = users.map((u) => `
    <tr>
      <td>${u.id}</td><td>${u.name}</td><td>${u.email}</td>
      <td>${u.role}</td><td>${u.enabled ? 'Active' : 'Disabled'}</td>
      <td>${u.department ?? '—'}</td><td>${u.phone ?? '—'}</td>
      <td>${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
    </tr>`).join('');
  const win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html><html><head>
    <title>Smart Campus – User Report</title>
    <style>
      body{font-family:Arial,sans-serif;padding:24px;color:#111;background:#fff}
      h1{color:#1e40af;border-bottom:2px solid #1e40af;padding-bottom:10px;font-size:22px}
      .meta{color:#6b7280;font-size:13px;margin-bottom:20px}
      .stats{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:24px}
      .stat{background:#f3f4f6;border-radius:10px;padding:14px 20px;min-width:110px}
      .stat .n{font-size:26px;font-weight:800;color:#1e40af;line-height:1}
      .stat .l{font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:#6b7280;margin-top:3px;font-weight:600}
      table{width:100%;border-collapse:collapse;font-size:13px}
      thead th{background:#1e40af;color:#fff;padding:10px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.4px}
      tbody td{padding:9px 12px;border-bottom:1px solid #e5e7eb}
      tbody tr:hover td{background:#f9fafb}
      .footer{margin-top:20px;font-size:11px;color:#9ca3af}
      .print-btn{margin-top:20px;padding:9px 20px;background:#1e40af;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px}
      @media print{.print-btn{display:none}}
    </style>
  </head><body>
    <h1>Smart Campus – User Management Report</h1>
    <div class="meta">Generated ${new Date().toLocaleString()} &nbsp;|&nbsp; ${users.length} users</div>
    <div class="stats">
      <div class="stat"><div class="n">${s.total}</div><div class="l">Total</div></div>
      <div class="stat"><div class="n">${s.active}</div><div class="l">Active</div></div>
      <div class="stat"><div class="n">${s.disabled}</div><div class="l">Disabled</div></div>
      <div class="stat"><div class="n">${s.admins}</div><div class="l">Admins</div></div>
      <div class="stat"><div class="n">${s.technicians}</div><div class="l">Technicians</div></div>
      <div class="stat"><div class="n">${s.regular}</div><div class="l">Users</div></div>
    </div>
    <table>
      <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Department</th><th>Phone</th><th>Joined</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="footer">Smart Campus &mdash; Confidential &mdash; Do not distribute</div>
    <button class="print-btn" onclick="window.print()">🖨 Print / Save as PDF</button>
  </body></html>`);
  win.document.close();
}

/* ── User form modal (create & edit) ─────────────── */
function UserFormModal({ show, onHide, onSave, editUser, saving, error }) {
  const isEdit = Boolean(editUser);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    if (show) {
      setForm(
        isEdit
          ? {
              name:       editUser.name       ?? '',
              email:      editUser.email      ?? '',
              password:   '',
              role:       editUser.role       ?? 'USER',
              phone:      editUser.phone      ?? '',
              department: editUser.department ?? '',
              bio:        editUser.bio        ?? '',
              enabled:    editUser.enabled    ?? true,
            }
          : EMPTY_FORM
      );
      setShowPwd(false);
    }
  }, [show, editUser, isEdit]);

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: val }));
  };

  const handleSave = () => {
    const payload = { ...form };
    if (isEdit && !payload.password) delete payload.password;
    onSave(payload);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" className="sc-modal" centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: 18, fontWeight: 700 }}>
          <i className={`bi ${isEdit ? 'bi-pencil-square' : 'bi-person-plus'} me-2 text-primary`} />
          {isEdit ? `Edit — ${editUser?.name}` : 'Create New User'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" className="py-2 mb-3" style={{ fontSize: 14 }}>
            <i className="bi bi-exclamation-circle me-2" />{error}
          </Alert>
        )}
        <Row className="g-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-semibold" style={{ fontSize: 13 }}>
                Full Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                value={form.name} onChange={set('name')}
                placeholder="Jane Doe" maxLength={120}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-semibold" style={{ fontSize: 13 }}>
                Email Address <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="email" value={form.email} onChange={set('email')}
                placeholder="jane@example.com"
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-semibold" style={{ fontSize: 13 }}>
                Password{' '}
                {isEdit
                  ? <span className="text-muted fw-normal">(leave blank to keep)</span>
                  : <span className="text-danger">*</span>}
              </Form.Label>
              <div className="input-group">
                <Form.Control
                  type={showPwd ? 'text' : 'password'}
                  value={form.password} onChange={set('password')}
                  placeholder={isEdit ? '••••••••' : 'Min. 6 characters'}
                />
                <button
                  type="button" className="input-group-text bg-white"
                  onClick={() => setShowPwd((v) => !v)}
                >
                  <i className={`bi ${showPwd ? 'bi-eye-slash' : 'bi-eye'} text-muted`} />
                </button>
              </div>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-semibold" style={{ fontSize: 13 }}>Role</Form.Label>
              <Form.Select value={form.role} onChange={set('role')}>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-semibold" style={{ fontSize: 13 }}>Phone</Form.Label>
              <Form.Control
                value={form.phone} onChange={set('phone')}
                placeholder="Optional" maxLength={30}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-semibold" style={{ fontSize: 13 }}>Department</Form.Label>
              <Form.Control
                value={form.department} onChange={set('department')}
                placeholder="Optional" maxLength={120}
              />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group>
              <Form.Label className="fw-semibold" style={{ fontSize: 13 }}>Bio</Form.Label>
              <Form.Control
                as="textarea" rows={3}
                value={form.bio} onChange={set('bio')}
                placeholder="Short description (optional)" maxLength={500}
              />
              <Form.Text className="text-muted">{form.bio.length}/500</Form.Text>
            </Form.Group>
          </Col>

          {isEdit && (
            <Col md={12}>
              <Form.Check
                type="switch" id="user-enabled-switch"
                label={<span style={{ fontSize: 14, fontWeight: 500 }}>Account enabled</span>}
                checked={form.enabled}
                onChange={set('enabled')}
              />
            </Col>
          )}
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={onHide} style={{ borderRadius: 8 }}>Cancel</Button>
        <Button
          variant="primary" onClick={handleSave} disabled={saving}
          style={{ borderRadius: 8, minWidth: 130 }}
        >
          {saving
            ? <><Spinner animation="border" size="sm" className="me-2" />Saving…</>
            : <><i className={`bi ${isEdit ? 'bi-check-lg' : 'bi-person-plus'} me-2`} />{isEdit ? 'Save Changes' : 'Create User'}</>}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

/* ── Delete confirmation modal ───────────────────── */
function DeleteModal({ show, onHide, onConfirm, target, saving }) {
  return (
    <Modal show={show} onHide={onHide} className="sc-modal" centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: 17, fontWeight: 700 }}>
          <i className="bi bi-trash3 me-2 text-danger" />Delete User
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-2">
          Are you sure you want to permanently delete{' '}
          <strong>{target?.name}</strong>?
        </p>
        <p className="text-muted mb-0" style={{ fontSize: 13 }}>
          This cannot be undone. All data associated with this account will be removed.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={onHide} style={{ borderRadius: 8 }}>Cancel</Button>
        <Button
          variant="danger" onClick={onConfirm} disabled={saving}
          style={{ borderRadius: 8, minWidth: 110 }}
        >
          {saving
            ? <Spinner animation="border" size="sm" />
            : <><i className="bi bi-trash3 me-2" />Delete</>}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

/* ── Main page ───────────────────────────────────── */
export default function AdminUsersPage() {
  const [users,     setUsers]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState('');
  const [formError, setFormError] = useState('');

  const [showForm,   setShowForm]   = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editUser,   setEditUser]   = useState(null);
  const [targetUser, setTargetUser] = useState(null);

  const [search,       setSearch]       = useState('');
  const [roleFilter,   setRoleFilter]   = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const filtered = useMemo(() => users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = !q
      || u.name.toLowerCase().includes(q)
      || u.email.toLowerCase().includes(q)
      || (u.department ?? '').toLowerCase().includes(q);
    const matchRole   = !roleFilter   || u.role === roleFilter;
    const matchStatus = !statusFilter
      || (statusFilter === 'active' ? u.enabled : !u.enabled);
    return matchSearch && matchRole && matchStatus;
  }), [users, search, roleFilter, statusFilter]);

  const stats = useMemo(() => ({
    total:       users.length,
    active:      users.filter((u) => u.enabled).length,
    admins:      users.filter((u) => u.role === 'ADMIN').length,
    technicians: users.filter((u) => u.role === 'TECHNICIAN').length,
  }), [users]);

  const openCreate = () => { setEditUser(null); setFormError(''); setShowForm(true); };
  const openEdit   = (u)  => { setEditUser(u);  setFormError(''); setShowForm(true); };

  const handleSave = async (payload) => {
    setSaving(true);
    setFormError('');
    try {
      if (editUser) {
        await updateUser(editUser.id, payload);
        setSuccess(`${payload.name} updated successfully.`);
      } else {
        await createUser(payload);
        setSuccess(`${payload.name} created successfully.`);
      }
      setShowForm(false);
      await loadUsers();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save user.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (u) => { setTargetUser(u); setShowDelete(true); };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await deleteUser(targetUser.id);
      setSuccess(`${targetUser.name} deleted.`);
      setShowDelete(false);
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.');
      setShowDelete(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="sc-page">
        <Container fluid="xl">

          {/* Page header */}
          <div className="page-header d-flex align-items-start justify-content-between flex-wrap gap-3">
            <div>
              <h1 className="mb-1">
                <i className="bi bi-people-fill me-2 text-primary" />User Management
              </h1>
              <p className="text-muted mb-0">Create, edit and manage all campus user accounts.</p>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <Button
                variant="outline-secondary"
                style={{ borderRadius: 9, fontWeight: 600, fontSize: 14 }}
                onClick={() => printReport(filtered)}
              >
                <i className="bi bi-printer me-2" />Report
              </Button>
              <Button
                variant="outline-success"
                style={{ borderRadius: 9, fontWeight: 600, fontSize: 14 }}
                onClick={() => exportCSV(filtered)}
              >
                <i className="bi bi-download me-2" />Export CSV
              </Button>
              <Button
                variant="primary"
                style={{ borderRadius: 9, fontWeight: 600, fontSize: 14 }}
                onClick={openCreate}
              >
                <i className="bi bi-person-plus me-2" />New User
              </Button>
            </div>
          </div>

          {error   && <Alert variant="danger"  dismissible onClose={() => setError('')}  className="mb-3">{error}</Alert>}
          {success && <Alert variant="success" dismissible onClose={() => setSuccess('')} className="mb-3">{success}</Alert>}

          {/* Stats */}
          <Row className="g-3 mb-4">
            {[
              { icon: 'bi-people-fill',                     cls: 'si-blue',   n: stats.total,       label: 'Total Users' },
              { icon: 'bi-person-check-fill',               cls: 'si-green',  n: stats.active,      label: 'Active' },
              { icon: 'bi-shield-fill-check',               cls: 'si-purple', n: stats.admins,      label: 'Admins' },
              { icon: 'bi-wrench-adjustable-circle-fill',   cls: 'si-orange', n: stats.technicians, label: 'Technicians' },
            ].map(({ icon, cls, n, label }) => (
              <Col key={label} xs={6} md={3}>
                <div className="stat-card">
                  <div className={`stat-icon ${cls}`}><i className={`bi ${icon}`} /></div>
                  <div><div className="stat-number">{n}</div><div className="stat-label">{label}</div></div>
                </div>
              </Col>
            ))}
          </Row>

          {/* Toolbar */}
          <div className="sc-toolbar">
            <Row className="g-2 align-items-center">
              <Col md={5}>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-search text-muted" style={{ fontSize: 14 }} />
                  </span>
                  <Form.Control
                    className="border-start-0"
                    placeholder="Search name, email or department…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button className="input-group-text bg-white border-0" onClick={() => setSearch('')}>
                      <i className="bi bi-x text-muted" />
                    </button>
                  )}
                </div>
              </Col>
              <Col sm={6} md={3}>
                <Form.Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                  <option value="">All Roles</option>
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </Form.Select>
              </Col>
              <Col sm={6} md={2}>
                <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                </Form.Select>
              </Col>
              <Col md={2} className="text-muted d-none d-md-block" style={{ fontSize: 13 }}>
                {filtered.length} / {users.length} users
              </Col>
            </Row>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-person-x d-block mb-3" style={{ fontSize: 48, opacity: 0.35 }} />
              No users match your criteria.
            </div>
          ) : (
            <div className="admin-table-wrap">
              <Table responsive hover className="mb-0">
                <thead>
                  <tr>
                    <th style={{ width: 50 }}>#</th>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th className="d-none d-lg-table-cell">Department</th>
                    <th className="d-none d-md-table-cell">Joined</th>
                    <th style={{ width: 100 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id}>
                      <td className="text-muted" style={{ fontSize: 13 }}>{u.id}</td>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div className={`table-avatar ${avatarClass(u.role)}`}>{ini(u.name)}</div>
                          <div className="overflow-hidden">
                            <div className="fw-semibold text-truncate" style={{ fontSize: 14, maxWidth: 190 }}>
                              {u.name}
                            </div>
                            <div className="text-muted text-truncate" style={{ fontSize: 12, maxWidth: 190 }}>
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`role-badge ${roleBadgeClass(u.role)}`}>{u.role}</span>
                      </td>
                      <td>
                        <span className={`status-dot ${u.enabled ? 'sd-active' : 'sd-disabled'}`}>
                          {u.enabled ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="d-none d-lg-table-cell text-muted" style={{ fontSize: 13 }}>
                        {u.department ?? '—'}
                      </td>
                      <td className="d-none d-md-table-cell text-muted" style={{ fontSize: 13 }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            size="sm" variant="outline-primary" title="Edit"
                            style={{ borderRadius: 7, padding: '4px 9px' }}
                            onClick={() => openEdit(u)}
                          >
                            <i className="bi bi-pencil" />
                          </Button>
                          <Button
                            size="sm" variant="outline-danger" title="Delete"
                            style={{ borderRadius: 7, padding: '4px 9px' }}
                            onClick={() => confirmDelete(u)}
                          >
                            <i className="bi bi-trash3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Container>
      </div>

      <UserFormModal
        show={showForm} onHide={() => setShowForm(false)}
        onSave={handleSave} editUser={editUser}
        saving={saving} error={formError}
      />
      <DeleteModal
        show={showDelete} onHide={() => setShowDelete(false)}
        onConfirm={handleDelete} target={targetUser} saving={saving}
      />
    </>
  );
}
