import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  visitorId: { type: String, required: true },
  name: { type: String, required: true },
  patientId: { type: String, required: true },
  patientName: String,
  visitType: String,
  contactNumber: String,
  relationship: String,
  checkInTime: Date,
  checkOutTime: Date,
  status: { type: String, default: 'active' }
});

const Visitor = mongoose.model('Visitor', visitorSchema);
export default Visitor;
