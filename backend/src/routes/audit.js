// backend/src/routes/audit.js
import express from 'express';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { getAuditTrail } = require('../models/AuditTrail');
const { requireRole } = require('../middleware/roleAuth');

const router = express.Router();

// GET /api/audit - get audit trail
router.get('/', requireRole('admin'), (req, res) => {
  const audit = getAuditTrail();
  res.json(audit);
});

export default router;
