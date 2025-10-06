import { useEffect, useState } from 'react';
import axios from 'axios';

function UserManagement({ user, showAlert }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ username: '', password: '', role: 'user', firstName: '', lastName: '', phone: '' });
  const [adding, setAdding] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ password: '', role: 'user' });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://192.168.0.178:5000/api/users', {
        headers: { 'x-user-role': user.role }
      });
      setUsers(res.data);
    } catch {
      setUsers([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await axios.post('http://localhost:5000/api/users', {
        ...form,
        createdBy: user.username,
        role: form.role
      }, {
        headers: { 'x-user-role': user.role }
      });
      setForm({ username: '', password: '', role: 'user', firstName: '', lastName: '', phone: '' });
      showAlert('✅ User added successfully!');
      fetchUsers();
    } catch (err) {
      showAlert(err.response?.data?.message || '❌ Error adding user', 'error');
    }
    setAdding(false);
  };

  const handleDelete = async (username) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${username}`, {
        data: { deletedBy: user.username },
        headers: { 'x-user-role': user.role }
      });
      showAlert('✅ User deleted successfully!');
      fetchUsers();
    } catch (err) {
      showAlert(err.response?.data?.message || '❌ Error deleting user', 'error');
    }
  };

  const handleEdit = (u) => {
    setEditUser(u.username);
    setEditForm({ password: '', role: u.role });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/users/${editUser}`, {
        ...editForm,
        updatedBy: user.username
      }, {
        headers: { 'x-user-role': user.role }
      });
      showAlert('✅ User updated successfully!');
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      showAlert(err.response?.data?.message || '❌ Error updating user', 'error');
    }
  };

  return (
    <div className="card">
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="card-title">👤 User Management</h2>
      </div>
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <input type="text" className="form-input" placeholder="Username" required value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
        <input type="text" className="form-input" placeholder="First Name" required value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
        <input type="text" className="form-input" placeholder="Last Name" required value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
        <input type="text" className="form-input" placeholder="Phone Number" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
        <input type="password" className="form-input" placeholder="Password" required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
        <select className="form-select" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button className="btn btn-primary" type="submit" disabled={adding}>Add User</button>
      </form>
      {loading ? (
        <div style={{ textAlign: 'center', color: '#718096', padding: '40px' }}>Loading...</div>
      ) : (
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          <table className="table" style={{ minWidth: 600 }}>
            <thead>
              <tr style={{ background: '#f3f3f3' }}>
                <th style={{ fontWeight: 'bold', textAlign: 'left', padding: '8px' }}>Username</th>
                <th style={{ fontWeight: 'bold', textAlign: 'left', padding: '8px' }}>First Name</th>
                <th style={{ fontWeight: 'bold', textAlign: 'left', padding: '8px' }}>Last Name</th>
                <th style={{ fontWeight: 'bold', textAlign: 'left', padding: '8px' }}>Phone</th>
                <th style={{ fontWeight: 'bold', textAlign: 'left', padding: '8px' }}>Role</th>
                <th style={{ fontWeight: 'bold', textAlign: 'left', padding: '8px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.username}>
                  <td style={{ padding: '8px' }}>{u.username}</td>
                  <td style={{ padding: '8px' }}>{u.firstName || ''}</td>
                  <td style={{ padding: '8px' }}>{u.lastName || ''}</td>
                  <td style={{ padding: '8px' }}>{u.phone || ''}</td>
                  <td style={{ padding: '8px' }}>
                    {editUser === u.username ? (
                      <form onSubmit={handleEditSubmit} style={{ display: 'flex', gap: 8 }}>
                        <select className="form-select" value={editForm.role} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}>
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                        <input type="password" className="form-input" placeholder="New Password (optional)" value={editForm.password} onChange={e => setEditForm(f => ({ ...f, password: e.target.value }))} />
                        <button className="btn btn-success" type="submit">Save</button>
                        <button className="btn btn-secondary" type="button" onClick={() => setEditUser(null)}>Cancel</button>
                      </form>
                    ) : (
                      u.role
                    )}
                  </td>
                  <td style={{ padding: '8px' }}>
                    {u.username !== user.username && (
                      <>
                        <button className="btn btn-info" onClick={() => handleEdit(u)} style={{ marginRight: 8 }}>Edit</button>
                        <button className="btn btn-danger" onClick={() => handleDelete(u.username)}>
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
