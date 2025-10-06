// backend/src/models/User.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERS_FILE = path.join(__dirname, '../../../data/users.json');

export function getUsers() {
  try {
    console.log('[DEBUG] USERS_FILE path:', USERS_FILE);
    if (fs.existsSync(USERS_FILE)) {
      const fileContent = fs.readFileSync(USERS_FILE, 'utf-8');
      console.log('[DEBUG] users.json content:', fileContent);
      return JSON.parse(fileContent);
    } else {
      console.log('[DEBUG] users.json file does not exist');
    }
    return [];
  } catch (e) {
    console.log('[DEBUG] Error reading users.json:', e);
    return [];
  }
}

export function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export function findUser(username) {
  return getUsers().find(u => u.username === username);
}

export function addUser(user) {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}
