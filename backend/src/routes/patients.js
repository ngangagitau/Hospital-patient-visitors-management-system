import express from 'express';
import Patient from '../models/Patient.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { logAudit } = require('../models/AuditTrail');
const { requireRole } = require('../middleware/roleAuth');

const router = express.Router();

// Get all patients
router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find({ status: 'active' });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new patient
router.post('/', requireRole('admin'), async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    logAudit({
      action: 'Create Patient',
      user: req.body.createdBy || 'unknown',
      details: patient
    });
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get patient by ID
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findOne({ patientId: req.params.id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update patient
router.put('/:id', requireRole('admin'), async (req, res) => {
  try {
    const patient = await Patient.findOneAndUpdate(
      { patientId: req.params.id },
      req.body,
      { new: true }
    );
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    logAudit({
      action: 'Update Patient',
      user: req.body.updatedBy || 'unknown',
      details: patient
    });
    res.json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Discharge (delete) patient by _id
router.delete('/:id', requireRole('admin'), async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    logAudit({
      action: 'Discharge Patient',
      user: req.body.deletedBy || 'unknown',
      details: patient
    });
    res.json({ message: 'Patient discharged successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;