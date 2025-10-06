import Patient from './Patient.mongo.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PATIENTS_FILE = path.join(__dirname, '../../../data/patients.json');

function ensurePatientsFile() {
  const dir = path.dirname(PATIENTS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(PATIENTS_FILE)) {
    fs.writeFileSync(PATIENTS_FILE, '[]');
  }
}

export async function savePatientToBoth(patientDoc) {
  // Save to MongoDB (already done in route)
  // Save to file
  ensurePatientsFile();
  let patients = [];
  try {
    if (fs.existsSync(PATIENTS_FILE)) {
      patients = JSON.parse(fs.readFileSync(PATIENTS_FILE, 'utf-8'));
    }
  } catch (e) {
    patients = [];
  }
  // Remove if exists, then add (upsert)
  patients = patients.filter(p => p.patientId !== patientDoc.patientId);
  patients.push(patientDoc);
  fs.writeFileSync(PATIENTS_FILE, JSON.stringify(patients, null, 2));
}

export async function deletePatientFromFile(patientId) {
  ensurePatientsFile();
  let patients = [];
  try {
    if (fs.existsSync(PATIENTS_FILE)) {
      patients = JSON.parse(fs.readFileSync(PATIENTS_FILE, 'utf-8'));
    }
  } catch (e) {
    patients = [];
  }
  patients = patients.filter(p => p.patientId !== patientId);
  fs.writeFileSync(PATIENTS_FILE, JSON.stringify(patients, null, 2));
}
