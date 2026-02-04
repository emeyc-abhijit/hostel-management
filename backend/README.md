# Backend API for Hostel Management System

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend root:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hostel-harmony
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRY=7d
FRONTEND_URL=http://localhost:5173
```

### 3. MongoDB Setup

Ensure MongoDB is running locally on port 27017, or update the MONGODB_URI in .env

### 4. Run the Application

**Development Mode:**

```bash
npm run dev
```

**Production Build:**

```bash
npm run build
npm start
```

### 5. Seed Database

```bash
npm run seed
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

### Users

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Students

- `GET /api/students` - Get all students
- `POST /api/students` - Create student
- `GET /api/students/:id` - Get student details
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Hostels

- `GET /api/hostels` - Get all hostels
- `POST /api/hostels` - Create hostel
- `GET /api/hostels/:id` - Get hostel details
- `PUT /api/hostels/:id` - Update hostel
- `DELETE /api/hostels/:id` - Delete hostel

### Rooms

- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Create room
- `GET /api/rooms/:id` - Get room details
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

### Applications

- `GET /api/applications` - Get all applications
- `POST /api/applications` - Submit application
- `GET /api/applications/:id` - Get application details
- `PUT /api/applications/:id` - Update application status

### Complaints

- `GET /api/complaints` - Get all complaints
- `POST /api/complaints` - Create complaint
- `GET /api/complaints/:id` - Get complaint details
- `PUT /api/complaints/:id` - Update complaint

### Fees

- `GET /api/fees` - Get all fee records
- `POST /api/fees` - Create fee record
- `GET /api/fees/:id` - Get fee details
- `PUT /api/fees/:id` - Update fee

### Notices

- `GET /api/notices` - Get all notices
- `POST /api/notices` - Create notice
- `GET /api/notices/:id` - Get notice details
- `PUT /api/notices/:id` - Update notice
- `DELETE /api/notices/:id` - Delete notice

### Attendance

- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Record attendance
- `GET /api/attendance/:id` - Get attendance details

## Architecture

### Folder Structure

```
src/
├── config/           # Configuration files
├── controllers/      # Request handlers
├── models/          # Mongoose schemas
├── routes/          # API routes
├── middleware/      # Custom middleware
├── utils/           # Helper functions
├── types/           # TypeScript types
├── scripts/         # Seed and utility scripts
└── index.ts         # Entry point
```

## Features

- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Admin, Warden, Student roles
- **Input Validation** - Express-validator for data validation
- **Error Handling** - Comprehensive error handling middleware
- **CORS** - Cross-Origin Resource Sharing enabled
- **Logging** - Morgan HTTP request logger
- **Password Hashing** - Bcrypt for secure password storage
- **MongoDB Integration** - Mongoose for schema validation
