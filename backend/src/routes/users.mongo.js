import express from 'express';
import User from '../models/User.mongo.js';
import { requireRole } from '../middleware/roleAuth.js';
import { logAudit } from '../utils/auditLogger.js';
import { saveUserToBoth, deleteUserFromFile } from '../models/User.dual.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Add a new user (admin only)
router.post('/', requireRole('admin'), async (req, res) => {
  try {
    const { username, password, role, firstName, lastName, phone, createdBy } = req.body;
    if (!username || !password || !role || !firstName || !lastName || !phone) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const exists = await User.findOne({ username });
    if (exists) return res.status(409).json({ message: 'User already exists.' });
    const user = new User({ username, password, role, firstName, lastName, phone });
  await user.save();
  await saveUserToBoth(user.toObject());
    await logAudit({
      action: 'Add User',
      user: createdBy || 'unknown',
      details: { username, role, firstName, lastName, phone }
    });
  res.status(201).json({ message: 'User added successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add user' });
  }
});

// Delete a user (admin only, cannot delete self)
router.delete('/:username', requireRole('admin'), async (req, res) => {
  try {
    const { deletedBy } = req.body;
    if (req.params.username === deletedBy) {
      return res.status(400).json({ message: 'You cannot delete your own account.' });
    }
  const result = await User.deleteOne({ username: req.params.username });
  await deleteUserFromFile(req.params.username);
    if (result.deletedCount === 0) return res.status(404).json({ message: 'User not found.' });
    await logAudit({
      action: 'Delete User',
      user: deletedBy || 'unknown',
      details: { username: req.params.username }
    });
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// Edit user (admin only)
router.put('/:username', requireRole('admin'), async (req, res) => {
  try {
    const { password, role, updatedBy, firstName, lastName, phone } = req.body;
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (role) user.role = role;
    if (password) user.password = password;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
  await user.save();
  await saveUserToBoth(user.toObject());
    await logAudit({
      action: 'Update User',
      user: updatedBy || 'unknown',
      details: { username: req.params.username, role, firstName, lastName, phone }
    });
    res.json({ message: 'User updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user' });
  }
});

export default router;
