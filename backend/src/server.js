
import dotenv from 'dotenv';
import os from 'os';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRouter from './routes/auth.js';
import auditRouter from './routes/audit.mongo.js';
import usersRouter from './routes/users.mongo.js';
import patientsRouter from './routes/patients.mongo.js';
import visitorsRouter from './routes/visitors.mongo.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/audit', auditRouter);
app.use('/api/users', usersRouter);
app.use('/api/patients', patientsRouter);
app.use('/api/visitors', visitorsRouter);

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Hospital Visitor Management System API',
    endpoints: {
      patients: '/api/patients',
      visitors: '/api/visitors',
      users: '/api/users',
      audit: '/api/audit',
      auth: '/api/auth'
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 API available at: http://localhost:${PORT}`);
  console.log('🌐 Accessible on your local network at: http://' + getLocalIP() + ':' + PORT);
});

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}
