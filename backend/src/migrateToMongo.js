import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import User from './models/User.mongo.js';
import Patient from './models/Patient.mongo.js';
import Visitor from './models/Visitor.mongo.js';
import AuditTrail from './models/AuditTrail.mongo.js';

dotenv.config();

const dataDir = path.resolve(__dirname, '../../data');

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  // USERS
  const usersPath = path.join(dataDir, 'users.json');
  if (fs.existsSync(usersPath)) {
    const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
    await User.deleteMany({});
    await User.insertMany(users);
    console.log(`Imported ${users.length} users.`);
  }

  // PATIENTS
  const patientsPath = path.join(dataDir, 'patients.json');
  if (fs.existsSync(patientsPath)) {
    const patients = JSON.parse(fs.readFileSync(patientsPath, 'utf-8'));
    await Patient.deleteMany({});
    await Patient.insertMany(patients);
    console.log(`Imported ${patients.length} patients.`);
  }

  // VISITORS
  const visitorsPath = path.join(dataDir, 'visitors.json');
  if (fs.existsSync(visitorsPath)) {
    const visitors = JSON.parse(fs.readFileSync(visitorsPath, 'utf-8'));
    await Visitor.deleteMany({});
    await Visitor.insertMany(visitors);
    console.log(`Imported ${visitors.length} visitors.`);
  }

  // AUDIT TRAIL
  const auditPath = path.join(dataDir, 'audit_trail.json');
  if (fs.existsSync(auditPath)) {
    const audit = JSON.parse(fs.readFileSync(auditPath, 'utf-8'));
    await AuditTrail.deleteMany({});
    await AuditTrail.insertMany(audit);
    console.log(`Imported ${audit.length} audit trail records.`);
  }

  await mongoose.disconnect();
  console.log('Migration complete.');
}

migrate().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
