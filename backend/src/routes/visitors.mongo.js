import express from 'express';
import Visitor from '../models/Visitor.mongo.js';
import Patient from '../models/Patient.mongo.js';
import { logAudit } from '../utils/auditLogger.js';

const router = express.Router();

// Get all active visitors
router.get('/active', async (req, res) => {
  try {
    const visitors = await Visitor.find({ status: 'active' }).sort({ checkInTime: -1 });
    res.json(visitors);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch active visitors' });
  }
});

// Get visitor history (last 100)
router.get('/history', async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ checkInTime: -1 }).limit(100);
    res.json(visitors);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch visitor history' });
  }
});

// Get visitors by patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const visitors = await Visitor.find({ patientId: req.params.patientId }).sort({ checkInTime: -1 });
    res.json(visitors);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch patient visitors' });
  }
});

// Visitor search for autocomplete
router.get('/search', async (req, res) => {
  try {
    const { name = '', contactNumber = '' } = req.query;
    const query = [];
    if (name) query.push({ name: { $regex: name, $options: 'i' } });
    if (contactNumber) query.push({ contactNumber: { $regex: contactNumber, $options: 'i' } });
    const visitors = await Visitor.find(query.length ? { $or: query } : {});
    // Unique by name/contact
    const unique = [];
    const seen = new Set();
    for (const v of visitors) {
      const key = v.name + '|' + v.contactNumber;
      if (!seen.has(key)) {
        unique.push({
          visitorId: v.visitorId,
          name: v.name,
          contactNumber: v.contactNumber,
          relationship: v.relationship
        });
        seen.add(key);
      }
    }
    res.json(unique);
  } catch (err) {
    res.status(500).json({ message: 'Failed to search visitors' });
  }
});

// Check in visitor
router.post('/checkin', async (req, res) => {
  try {
    const { visitorId, name, patientId, visitType, contactNumber, relationship } = req.body;
    const patient = await Patient.findOne({ patientId, status: 'active' });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    const activeVisitors = await Visitor.countDocuments({ patientId, status: 'active' });
    if (activeVisitors >= 2) return res.status(400).json({ message: 'Maximum 2 visitors allowed per patient at a time' });
    const existingVisitor = await Visitor.findOne({ visitorId, status: 'active' });
    if (existingVisitor) return res.status(400).json({ message: 'Visitor is already checked in' });
    const visitor = new Visitor({
      visitorId,
      name,
      patientId,
      patientName: patient.name,
      visitType,
      contactNumber: contactNumber || 'Not provided',
      relationship,
      checkInTime: new Date(),
      status: 'active'
    });
    await visitor.save();
    patient.currentVisitors += 1;
    patient.updatedAt = new Date();
    await patient.save();
    await logAudit({
      action: 'Visitor Check-In',
      user: name || 'unknown',
      details: { visitorId, patientId, patientName: patient.name }
    });
    res.status(201).json(visitor);
  } catch (err) {
    res.status(500).json({ message: 'Failed to check in visitor' });
  }
});

// Check out visitor
router.post('/checkout/:visitorId', async (req, res) => {
  try {
    const visitor = await Visitor.findOne({ visitorId: req.params.visitorId, status: 'active' });
    if (!visitor) return res.status(404).json({ message: 'Active visitor not found' });
    visitor.checkOutTime = new Date();
    visitor.status = 'checked-out';
    await visitor.save();
    const patient = await Patient.findOne({ patientId: visitor.patientId });
    if (patient) {
      patient.currentVisitors = Math.max(0, patient.currentVisitors - 1);
      patient.updatedAt = new Date();
      await patient.save();
    }
    await deleteVisitorFromFile(visitor.visitorId);
    await logAudit({
      action: 'Visitor Check-Out',
      user: visitor.name || 'unknown',
      details: { visitorId: visitor.visitorId, patientId: visitor.patientId, patientName: visitor.patientName }
    });
    res.json(visitor);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update visitor data' });
  }
});

export default router;
