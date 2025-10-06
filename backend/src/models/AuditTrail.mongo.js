import mongoose from 'mongoose';

const auditTrailSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  action: String,
  user: String,
  details: mongoose.Schema.Types.Mixed
});

const AuditTrail = mongoose.model('AuditTrail', auditTrailSchema);
export default AuditTrail;
