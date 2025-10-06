import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  visitorId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  patientId: {
    type: String,
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  visitType: {
    type: String,
    enum: ['lunch', 'evening'],
    required: true
  },
  checkInTime: {
    type: Date,
    default: Date.now
  },
  checkOutTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'checked-out'],
    default: 'active'
  },
  contactNumber: {
    type: String
  },
  relationship: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Visitor', visitorSchema);