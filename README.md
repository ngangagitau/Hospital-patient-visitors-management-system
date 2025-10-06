# Hospital Visitor Management System

A full-stack web application for managing hospital patients, visitors, and users, with a comprehensive audit trail for all operations.

## Features
- **Patient Management:** Add, discharge, and view patients.
- **Visitor Management:** Check-in, check-out, and track visitors per patient (max 2 at a time).
- **User Management:** Administer user accounts and roles.
- **Audit Trail:** All actions (CRUD, authentication) are logged to MongoDB for compliance.
- **Authentication:** User login with role-based access.
- **Modern UI:** Built with React and Vite for a fast, responsive experience.

## Tech Stack
- **Frontend:** React, Vite, Axios
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Audit Logging:** MongoDB (AuditTrail collection)

## Folder Structure
```
backend/           # Express API server
  src/
    models/        # Mongoose models (Patient, Visitor, User, AuditTrail)
    routes/        # API route handlers
    utils/         # Utility modules (auditLogger.js)
  package.json     # Backend dependencies

frontend/          # React app
  src/
    components/    # React components (Patient, Visitor, User management)
  package.json     # Frontend dependencies

data/              # (Legacy) JSON data files (not used with MongoDB)
```

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB (local or cloud instance)

### 1. Clone the Repository
```
git clone <repo-url>
cd hospital-visitor-system1
```

### 2. Setup Backend
```
cd backend
npm install
# Create a .env file if needed (see below)
npm start
```

#### Backend Environment Variables
Create a `.env` file in `backend/` (if not present):
```
MONGODB_URI=mongodb://localhost:27017/hospital-visitor-system
PORT=5000
```

### 3. Setup Frontend
```
cd ../frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` (or as shown in the terminal).

### 4. Access the App
- Open your browser to the frontend URL.
- Log in with your user credentials (admin/user accounts can be seeded or created via the UI).

## API Endpoints
- `/api/patients` - Manage patients
- `/api/visitors` - Manage visitors
- `/api/users` - Manage users
- `/api/audit` - View audit trail
- `/api/auth` - User authentication

## Audit Trail
All operations (add, update, delete, check-in/out, login) are logged in the `AuditTrail` MongoDB collection. Each log includes:
- Timestamp
- Action
- User
- Details (payload)

## Development
- Backend: Hot reload with `nodemon` (optional)
- Frontend: Fast refresh with Vite

## License
MIT

---

**Contributors:**
- Your Name
- ...
