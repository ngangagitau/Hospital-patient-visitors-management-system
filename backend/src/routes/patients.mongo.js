import express from 'express';
import Patient from '../models/Patient.mongo.js';
import { logAudit } from '../utils/auditLogger.js';
import { savePatientToBoth, deletePatientFromFile } from '../models/Patient.dual.js';

const router = express.Router();

// Get all active patients
router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find({ status: 'active' });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch patients' });
  }
});

// Create new patient
router.post('/', async (req, res) => {
  try {
    const existing = await Patient.findOne({ patientId: req.body.patientId });
    if (existing) {
      return res.status(400).json({ message: 'Patient ID already exists' });
    }
    const patient = new Patient({
      patientId: req.body.patientId,
      name: req.body.name,
      ward: req.body.ward,
      room: req.body.room,
      currentVisitors: 0,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await patient.save();
    await savePatientToBoth(patient.toObject());
    await logAudit({
      action: 'Create Patient',
      user: req.body.createdBy || 'unknown',
      details: { patientId: patient.patientId, name: patient.name }
    });
    res.status(201).json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Failed to save patient data' });
  }
});

// Discharge (delete) patient by _id
router.delete('/:id', async (req, res) => {
  try {
    const result = await Patient.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    await deletePatientFromFile(req.params.id);
    await logAudit({
      action: 'Discharge Patient',
      user: req.body.deletedBy || 'unknown',
      details: { patientId: req.params.id }
    });
    res.json({ message: 'Patient discharged successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update patient data' });
  }
});

export default router;
