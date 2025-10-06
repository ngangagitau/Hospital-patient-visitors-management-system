import express from 'express';
import { getUsers, addUser, saveUsers, findUser } from '../models/User.js';
import { logAudit } from '../models/AuditTrail.js';
import { requireRole } from '../middleware/roleAuth.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', requireRole('admin'), (req, res) => {
  res.json(getUsers().map(u => ({
    username: u.username,
    firstName: u.firstName || '',
    lastName: u.lastName || '',
    phone: u.phone || '',
    role: u.role
  })));
});

// Add a new user (admin only)
router.post('/', requireRole('admin'), (req, res) => {
  const { username, password, role, createdBy, firstName, lastName, phone } = req.body;
  if (!username || !password || !role || !firstName || !lastName || !phone) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  if (findUser(username)) {
    return res.status(409).json({ message: 'User already exists.' });
  }
  addUser({ username, password, role, firstName, lastName, phone });
  logAudit({ action: 'Add User', user: createdBy || 'unknown', details: { username, role, firstName, lastName, phone } });
  res.status(201).json({ message: 'User added successfully.' });
});

// Delete a user (admin only, cannot delete self)
router.delete('/:username', requireRole('admin'), (req, res) => {
  const { deletedBy } = req.body;
  const username = req.params.username;
  if (username === deletedBy) {
    return res.status(400).json({ message: 'You cannot delete your own account.' });
  }
  const users = getUsers().filter(u => u.username !== username);
  if (users.length === getUsers().length) {
    return res.status(404).json({ message: 'User not found.' });
  }
  saveUsers(users);
  logAudit({ action: 'Delete User', user: deletedBy || 'unknown', details: { username } });
  res.json({ message: 'User deleted successfully.' });
});

// Add user update (edit) endpoint (admin only)
router.put('/:username', requireRole('admin'), (req, res) => {
  const { password, role, updatedBy } = req.body;
  const username = req.params.username;
  const users = getUsers();
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  if (role) user.role = role;
  if (password) user.password = password;
  saveUsers(users);
  logAudit({ action: 'Edit User', user: updatedBy || 'unknown', details: { username, role: user.role } });
  res.json({ message: 'User updated successfully.' });
});

export default router;
