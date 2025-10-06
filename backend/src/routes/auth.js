// This is a simple Express route for login. Add this to your backend (e.g., backend/src/routes/auth.js)
import express from 'express';
import { logAudit } from '../utils/auditLogger.js';
import { findUser } from '../models/User.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = findUser(username);
  console.log('Login attempt:', { username, user }); // DEBUG LINE
  if (user && user.password === password) {
    await logAudit({
      action: 'User Login',
      user: username,
      details: 'User logged in successfully.'
    });
    // In a real app, return a JWT or session
    return res.json({ success: true, username, role: user.role });
  }
  await logAudit({
    action: 'Failed Login',
    user: username,
    details: 'Invalid credentials.'
  });
  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

export default router;
