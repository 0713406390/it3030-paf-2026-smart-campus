/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { Container, Table, Form, Button, Alert, Badge, Spinner, Modal } from 'react-bootstrap';
import Navbar from '../../components/member4/Navbar';
import { getAllUsers, updateUserRole, updateUserStatus, deleteUser } from '../../services/member4/userService';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [targetUser, setTargetUser] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (id, role) => {
    try {
      await updateUserRole(id, role);
      setSuccess('Role updated successfully');
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleStatusToggle = async (id, enabled) => {
    try {
      await updateUserStatus(id, !enabled);
      setSuccess(`User ${!enabled ? 'enabled' : 'disabled'} successfully`);
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const confirmDelete = (user) => {
    setTargetUser(user);
    setShowDelete(true);
  };

  const handleDelete = async () => {
    try {
      await deleteUser(targetUser.id);
      setSuccess('User deleted');
      setShowDelete(false);
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
      setShowDelete(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container>
        <h1 className="mb-4"><i className="bi bi-people-fill me-2" />User Management</h1>

        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

        {loading ? (
          <div className="text-center py-5"><Spinner animation="border" /></div>
        ) : (
          <Table striped hover responsive className="bg-white shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <Form.Select
                      size="sm"
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    >
                      <option value="USER">USER</option>
                      <option value="TECHNICIAN">TECHNICIAN</option>
                      <option value="ADMIN">ADMIN</option>
                    </Form.Select>
                  </td>
                  <td>
                    <Badge bg={u.enabled ? 'success' : 'secondary'}>
                      {u.enabled ? 'Active' : 'Disabled'}
                    </Badge>
                  </td>
                  <td><small>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</small></td>
                  <td>
                    <Button
                      size="sm"
                      variant={u.enabled ? 'outline-warning' : 'outline-success'}
                      className="me-2"
                      onClick={() => handleStatusToggle(u.id, u.enabled)}
                    >
                      {u.enabled ? 'Disable' : 'Enable'}
                    </Button>
                    <Button size="sm" variant="outline-danger" onClick={() => confirmDelete(u)}>
                      <i className="bi bi-trash" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        <Modal show={showDelete} onHide={() => setShowDelete(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete <strong>{targetUser?.name}</strong>? This action cannot be undone.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}
