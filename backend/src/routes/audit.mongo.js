import express from 'express';
import AuditTrail from '../models/AuditTrail.mongo.js';
import { requireRole } from '../middleware/roleAuth.js';

const router = express.Router();

// GET /api/audit - get audit trail
router.get('/', requireRole('admin'), async (req, res) => {
  try {
    const audit = await AuditTrail.find().sort({ timestamp: -1 }).limit(200);
    res.json(audit);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch audit trail' });
  }
});

export default router;
