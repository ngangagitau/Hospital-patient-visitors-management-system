import User from './User.mongo.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE = path.join(__dirname, '../../../data/users.json');

function ensureUsersFile() {
  const dir = path.dirname(USERS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, '[]');
  }
}

export async function saveUserToBoth(userDoc) {
  // Save to MongoDB (already done in route)
  // Save to file
  ensureUsersFile();
  let users = [];
  try {
    if (fs.existsSync(USERS_FILE)) {
      users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
    }
  } catch (e) {
    users = [];
  }
  // Remove if exists, then add (upsert)
  users = users.filter(u => u.username !== userDoc.username);
  users.push(userDoc);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export async function deleteUserFromFile(username) {
  ensureUsersFile();
  let users = [];
  try {
    if (fs.existsSync(USERS_FILE)) {
      users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
    }
  } catch (e) {
    users = [];
  }
  users = users.filter(u => u.username !== username);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}
