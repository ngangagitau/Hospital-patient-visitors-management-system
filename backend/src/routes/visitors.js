import express from 'express';
import Visitor from '../models/Visitor.js';
import Patient from '../models/Patient.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { logAudit } = require('../models/AuditTrail');

const router = express.Router();

// Check in visitor
router.post('/checkin', async (req, res) => {
  try {
    const { visitorId, name, patientId, visitType, contactNumber, relationship, checkedInBy } = req.body;

    // Check if patient exists
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check current visitor count for patient
    const activeVisitors = await Visitor.countDocuments({ 
      patientId, 
      status: 'active' 
    });

    if (activeVisitors >= 2) {
      return res.status(400).json({ 
        message: 'Maximum 2 visitors allowed per patient at a time' 
      });
    }

    // Check if visitor is already active
    const existingVisitor = await Visitor.findOne({ 
      visitorId, 
      status: 'active' 
    });

    if (existingVisitor) {
      return res.status(400).json({ 
        message: 'Visitor is already checked in' 
      });
    }

    const visitor = new Visitor({
      visitorId,
      name,
      patientId,
      patientName: patient.name,
      visitType,
      contactNumber,
      relationship
    });

    await visitor.save();

    // Update patient's current visitor count
    await Patient.findOneAndUpdate(
      { patientId },
      { $inc: { currentVisitors: 1 } }
    );

    logAudit({
      action: 'Check In Visitor',
      user: checkedInBy || 'unknown',
      details: visitor
    });
    res.status(201).json(visitor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Check out visitor
router.post('/checkout/:visitorId', async (req, res) => {
  try {
    const visitor = await Visitor.findOne({ 
      visitorId: req.params.visitorId,
      status: 'active'
    });

    if (!visitor) {
      return res.status(404).json({ message: 'Active visitor not found' });
    }

    visitor.checkOutTime = new Date();
    visitor.status = 'checked-out';
    await visitor.save();

    // Update patient's current visitor count
    await Patient.findOneAndUpdate(
      { patientId: visitor.patientId },
      { $inc: { currentVisitors: -1 } }
    );

    logAudit({
      action: 'Check Out Visitor',
      user: req.body.checkedOutBy || 'unknown',
      details: visitor
    });
    res.json({ message: 'Visitor checked out successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get active visitors
router.get('/active', async (req, res) => {
  try {
    const visitors = await Visitor.find({ status: 'active' })
      .sort({ checkInTime: -1 });
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get visitor history
router.get('/history', async (req, res) => {
  try {
    const visitors = await Visitor.find()
      .sort({ checkInTime: -1 })
      .limit(100);
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get visitors by patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const visitors = await Visitor.find({ 
      patientId: req.params.patientId 
    }).sort({ checkInTime: -1 });
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;