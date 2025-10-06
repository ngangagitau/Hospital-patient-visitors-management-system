// backend/src/models/AuditTrail.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Always use the main data directory for audit trail
const AUDIT_FILE = path.join(__dirname, '../../data/audit_trail.json');

function ensureAuditFile() {
  const dir = path.dirname(AUDIT_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(AUDIT_FILE)) {
    fs.writeFileSync(AUDIT_FILE, '[]');
  }
}

export function logAudit({ action, user, details }) {
  ensureAuditFile();
  const entry = {
    timestamp: new Date().toISOString(),
    action,
    user,
    details
  };
  let audit = [];
  try {
    if (fs.existsSync(AUDIT_FILE)) {
      audit = JSON.parse(fs.readFileSync(AUDIT_FILE, 'utf-8'));
    }
  } catch (e) {
    audit = [];
  }
  audit.push(entry);
  fs.writeFileSync(AUDIT_FILE, JSON.stringify(audit, null, 2));
}

export function getAuditTrail() {
  ensureAuditFile();
  try {
    if (fs.existsSync(AUDIT_FILE)) {
      return JSON.parse(fs.readFileSync(AUDIT_FILE, 'utf-8'));
    }
    return [];
  } catch (e) {
    return [];
  }
}
