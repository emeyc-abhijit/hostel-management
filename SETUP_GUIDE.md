# Hostel Harmony Hub - Full Stack Setup Guide

## Project Overview

A complete hostel management system with:

- **Backend**: Express.js + MongoDB + Mongoose
- **Frontend**: React + TypeScript + Vite + Shadcn UI
- **Database**: MongoDB
- **Authentication**: JWT-based with role-based access control

## Quick Start

### 1. Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **bun**
- **MongoDB** (local or Atlas)

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

**Install dependencies:**

```bash
npm install
```

**Configure environment:**

```bash
cp .env.example .env
```

Edit `.env` and update MongoDB URI if needed:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hostel-harmony
NODE_ENV=development
JWT_SECRET=hostel_harmony_super_secret_key_change_in_production_2024
JWT_EXPIRY=7d
FRONTEND_URL=http://localhost:5173
```

**Start MongoDB:**

```bash
# If using local MongoDB
mongod

# OR use MongoDB Atlas (update MONGODB_URI in .env)
```

**Seed database (optional but recommended):**

```bash
npm run seed
```

This creates test data with these credentials:

- **Admin**: admin@hostel.com / admin123
- **Warden**: warden.boys@hostel.com / warden123
- **Student**: student1@hostel.com / student123

**Start development server:**

```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Frontend Setup

Navigate to the web directory:

```bash
cd web
```

**Install dependencies:**

```bash
npm install
```

**Configure environment:**

```bash
# Frontend .env is already configured
# VITE_API_URL=http://localhost:5000/api
```

**Start development server:**

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

### Students

- `GET /api/students` - Get all students (admin/warden)
- `GET /api/students/:id` - Get student details
- `POST /api/students` - Create student (admin/warden)
- `PUT /api/students/:id` - Update student (admin/warden)
- `DELETE /api/students/:id` - Delete student (admin/warden)
- `POST /api/students/:id/allocate-room` - Allocate room (admin/warden)
- `GET /api/students/me` - Get my profile

### Hostels

- `GET /api/hostels` - Get all hostels
- `POST /api/hostels` - Create hostel (admin only)
- `GET /api/hostels/:id` - Get hostel details
- `PUT /api/hostels/:id` - Update hostel (admin only)
- `DELETE /api/hostels/:id` - Delete hostel (admin only)

### Rooms

- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Create room (admin/warden)
- `GET /api/rooms/:id` - Get room details
- `PUT /api/rooms/:id` - Update room (admin/warden)
- `DELETE /api/rooms/:id` - Delete room (admin/warden)

### Applications

- `GET /api/applications` - Get all applications (admin/warden)
- `POST /api/applications` - Submit application
- `GET /api/applications/:id` - Get application details
- `PUT /api/applications/:id` - Update application status (admin/warden)
- `GET /api/applications/my` - Get my application

### Complaints

- `GET /api/complaints` - Get all complaints (admin/warden)
- `POST /api/complaints` - Create complaint
- `GET /api/complaints/:id` - Get complaint details
- `PUT /api/complaints/:id` - Update complaint (admin/warden)
- `DELETE /api/complaints/:id` - Delete complaint (admin/warden)
- `GET /api/complaints/my` - Get my complaints

### Notices

- `GET /api/notices` - Get all notices
- `POST /api/notices` - Create notice (admin/warden)
- `GET /api/notices/:id` - Get notice details
- `PUT /api/notices/:id` - Update notice (admin/warden)
- `DELETE /api/notices/:id` - Delete notice (admin/warden)

### Fees

- `GET /api/fees` - Get all fees (admin/warden)
- `POST /api/fees` - Create fee record (admin/warden)
- `GET /api/fees/:id` - Get fee details
- `PUT /api/fees/:id` - Update fee status
- `GET /api/fees/my` - Get my fees

### Attendance & Leaves

- `GET /api/attendance/attendance` - Get all attendance (admin/warden)
- `POST /api/attendance/attendance` - Record attendance (admin/warden)
- `GET /api/attendance/attendance/my` - Get my attendance
- `GET /api/attendance/leaves` - Get all leave requests (admin/warden)
- `POST /api/attendance/leaves` - Submit leave request
- `PUT /api/attendance/leaves/:id` - Update leave status (admin/warden)
- `GET /api/attendance/leaves/my` - Get my leave requests

## User Roles & Permissions

### Admin

- Full access to all resources
- Manage users, hostels, rooms, applications
- View reports and analytics

### Warden

- Manage hostel operations
- Approve applications and allocate rooms
- Manage complaints and maintenance
- Handle fee records
- Post notices

### Student

- View hostel information
- Submit room application
- View room allocation
- Submit complaints
- View notices
- Check fees and payment status
- Track attendance
- Submit leave requests

## Database Schema

### User

- name, email, password, role, phone, avatar
- Timestamps (createdAt, updatedAt)

### Student

- userId (ref), name, email, phone, course, year, rollNumber
- roomId (ref), hostelId (ref), status
- Timestamps

### Hostel

- name, type (boys/girls), totalRooms, capacity
- occupiedRooms, currentOccupancy, wardenId (ref)
- Timestamps

### Room

- hostelId (ref), roomNumber, floor
- capacity, occupied, type (single/double/triple)
- status (available/full/maintenance)
- students (array of refs)
- Timestamps

### Application

- studentId (ref), studentName, course, year
- preferredHostel, status (pending/approved/rejected)
- appliedDate, notes
- Timestamps

### Complaint

- studentId (ref), studentName, roomNumber
- category, subject, description
- status (open/in-progress/resolved/closed)
- priority, assignedTo (ref), notes
- Timestamps

### Notice

- title, content, category
- postedBy (ref), targetAudience, targetHostel (ref)
- postedAt, expiresAt
- Timestamps

### FeeRecord

- studentId (ref), semester, amount
- dueDate, paidDate, status
- paymentMethod, transactionId
- Timestamps

### AttendanceRecord

- studentId (ref), date, status
- remarks
- Timestamps

### LeaveRequest

- studentId (ref), studentName, fromDate, toDate
- reason, status, appliedAt, approvedBy (ref)
- Timestamps

## Frontend Integration

The frontend uses a centralized API client (`src/services/api.ts`) that handles all HTTP requests with automatic:

- Authentication token injection
- Error handling
- Request/response formatting
- Base URL management

### Making API Calls

```typescript
import api from "@/services/api";

// Login
const response = await api.login(email, password, role);
if (response.success) {
  // Handle success
}

// Get students
const students = await api.getAllStudents(page, limit);

// Create complaint
const complaint = await api.createComplaint(data);
```

## Production Deployment

### Backend

1. Build: `npm run build`
2. Set environment variables for production
3. Deploy to server (Heroku, AWS, DigitalOcean, etc.)
4. Ensure MongoDB is running and accessible
5. Run migrations/seed if needed

### Frontend

1. Build: `npm run build`
2. Deploy dist folder to CDN or static hosting (Vercel, Netlify, etc.)
3. Update API_URL to production backend
4. Set up environment variables

## Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Enable HTTPS
- [ ] Set secure CORS origin
- [ ] Use environment variables for sensitive data
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Use HTTPS for API calls
- [ ] Implement logging and monitoring
- [ ] Regular security audits
- [ ] Keep dependencies updated

## Troubleshooting

### MongoDB Connection Issues

```bash
# Check MongoDB is running
mongo

# If using local MongoDB
# Windows: mongod
# Mac: brew services start mongodb-community
```

### CORS Errors

- Ensure backend CORS is configured with frontend URL
- Check browser console for origin issues
- Verify frontend is using correct API URL

### Authentication Issues

- Clear localStorage and try again
- Check token expiration
- Verify JWT_SECRET matches between auth and verification

### Port Already in Use

```bash
# Backend (5000)
lsof -i :5000
kill -9 <PID>

# Frontend (5173)
lsof -i :5173
kill -9 <PID>
```

## Development Workflow

1. **Start MongoDB**: `mongod` (or use Atlas)
2. **Start Backend**: `cd backend && npm run dev`
3. **Start Frontend**: `cd web && npm run dev`
4. **Open Browser**: `http://localhost:5173`
5. **Login**: Use credentials from seeded data or register new account

## Building for Production

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd web
npm run build
npm run preview
```

## Performance Optimizations

- Database indexing for frequently queried fields
- Pagination for list endpoints
- Caching with HTTP headers
- Lazy loading in frontend
- Code splitting in React
- Compression middleware

## Logging

Backend uses Morgan for HTTP request logging. Enable detailed logging in development mode.

## Future Enhancements

- Email notifications
- SMS alerts
- Payment gateway integration
- File uploads for documents
- Advanced reporting and analytics
- Mobile app (React Native)
- Real-time notifications (Socket.io)
- Backup and disaster recovery
