import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  ward: {
    type: String,
    required: true
  },
  room: {
    type: String,
    required: true
  },
  currentVisitors: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'discharged'],
    default: 'active'
  }
}, {
  timestamps: true
});

export default mongoose.model('Patient', patientSchema);