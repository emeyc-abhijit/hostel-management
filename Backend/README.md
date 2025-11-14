# Medhavi Backend (Auth)

This folder contains a minimal TypeScript + Express + Mongoose backend scaffold for authentication (register/login/me).

Features
- Register (POST /api/auth/register)
- Login (POST /api/auth/login)
- Get current user (GET /api/auth/me)
- JWT-based auth
- Password hashing with bcryptjs

Quick start
1. cd Backend
2. npm install (or yarn)
3. copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`
4. npm run dev

Endpoints
- POST /api/auth/register  { name, email, password, role }
- POST /api/auth/login     { email, password }
- GET  /api/auth/me        Authorization: Bearer <token>

Notes
- This is a local scaffold using Mongoose. Adapt as needed for production (rate limit, input validation, stronger secrets, HTTPS, etc.).
