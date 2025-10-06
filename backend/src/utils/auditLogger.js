import AuditTrail from '../models/AuditTrail.mongo.js';
import { logAudit as logAuditFile } from '../models/AuditTrail.js';

export async function logAudit({ action, user, details }) {
  try {
    await AuditTrail.create({ action, user, details });
  } catch (err) {
    console.error('Failed to log audit trail to MongoDB:', err);
  }
  try {
    logAuditFile({ action, user, details });
  } catch (err) {
    console.error('Failed to log audit trail to file:', err);
  }
}
