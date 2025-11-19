# Backend Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   cd Backend
   npm install
   ```

2. **Setup Environment Variables**
   - Copy `.env.example` to `.env` (if exists) or create `.env`
   - Update MongoDB connection string if needed
   - Default: `MONGODB_URI=mongodb://localhost:27017/medhavi-hostel`

3. **Seed Demo Users**
   ```bash
   npm run seed:users
   ```
   This creates three test users:
   - **Admin**: admin@medhavi.edu / password123
   - **Warden**: warden@medhavi.edu / password123
   - **Student**: student@medhavi.edu / password123

4. **Seed Students and Rooms (Optional)**
   ```bash
   npm run seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   Server runs on http://localhost:4000

## Test Credentials

Use these credentials to login:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@medhavi.edu | password123 |
| Warden | warden@medhavi.edu | password123 |
| Student | student@medhavi.edu | password123 |

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run seed:users` - Seed demo users
- `npm run seed` - Seed students and rooms

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (requires auth)

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create student
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Rooms
- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Create room
- `GET /api/rooms/:id` - Get room by ID
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

### Fees
- `GET /api/fees` - Get all fees
- `POST /api/fees` - Create fee
- `GET /api/fees/:id` - Get fee by ID
- `PUT /api/fees/:id` - Update fee
- `DELETE /api/fees/:id` - Delete fee
