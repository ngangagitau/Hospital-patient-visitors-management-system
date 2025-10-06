import Visitor from './Visitor.mongo.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VISITORS_FILE = path.join(__dirname, '../../../data/visitors.json');

function ensureVisitorsFile() {
  const dir = path.dirname(VISITORS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(VISITORS_FILE)) {
    fs.writeFileSync(VISITORS_FILE, '[]');
  }
}

export async function saveVisitorToBoth(visitorDoc) {
  // Save to MongoDB (already done in route)
  // Save to file
  ensureVisitorsFile();
  let visitors = [];
  try {
    if (fs.existsSync(VISITORS_FILE)) {
      visitors = JSON.parse(fs.readFileSync(VISITORS_FILE, 'utf-8'));
    }
  } catch (e) {
    visitors = [];
  }
  // Remove if exists, then add (upsert)
  visitors = visitors.filter(v => v.visitorId !== visitorDoc.visitorId);
  visitors.push(visitorDoc);
  fs.writeFileSync(VISITORS_FILE, JSON.stringify(visitors, null, 2));
}

export async function deleteVisitorFromFile(visitorId) {
  ensureVisitorsFile();
  let visitors = [];
  try {
    if (fs.existsSync(VISITORS_FILE)) {
      visitors = JSON.parse(fs.readFileSync(VISITORS_FILE, 'utf-8'));
    }
  } catch (e) {
    visitors = [];
  }
  visitors = visitors.filter(v => v.visitorId !== visitorId);
  fs.writeFileSync(VISITORS_FILE, JSON.stringify(visitors, null, 2));
}
