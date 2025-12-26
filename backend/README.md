# RTO Management System - Backend API

A comprehensive backend API for RTO (Regional Transport Office) Management System built with Node.js, TypeScript, Express.js, and PostgreSQL. This system manages vehicle registrations, driving licenses, traffic challans, appointments, payments, and provides analytics.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [User Roles](#user-roles)
- [Setup & Installation](#setup--installation)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Project Structure](#project-structure)
- [Recent Updates](#recent-updates)

## ✨ Features

### Core Functionality
- ✅ **User Authentication & Authorization**
  - JWT-based auth (access + refresh tokens)
  - Role-based access control (RBAC)
  - Password reset with OTP via email ✨ **WORKING**
  - Email service with Gmail SMTP integration ✨ **NEW**
  - Secure password hashing with bcrypt
  
- ✅ **Vehicle Management**
  - Vehicle registration and verification
  - RC (Registration Certificate) issuance
  - Ownership transfer
  - Vehicle scrapping (mark as scrapped)
  - Vehicle search and filtering
  
- ✅ **Driving License Management**
  - DL application submission
  - Document verification workflow
  - Driving test scheduling
  - DL approval/rejection
  - License renewal
  
- ✅ **Traffic Challan System**
  - Challan issuance by police
  - Location tracking for violations
  - Challan payment processing
  - Dispute management
  - Payment history
  
- ✅ **Appointment System**
  - Book RTO appointments
  - Reschedule/cancel appointments
  - Appointment completion tracking
  - Calendar management
  
- ✅ **Payment Processing**
  - Integrated payment gateway simulation
  - Payment verification
  - Payment history and receipts
  - Refund functionality (pending implementation)
  
- ✅ **Notifications**
  - Database-stored notifications
  - Real-time notification system
  - Read/unread status tracking
  
- ✅ **Analytics & Reporting**
  - Dashboard statistics
  - Revenue analytics
  - Violation statistics
  - ML-based risk assessment
  - Role-based analytics access

### Email Integration
- ✅ **Nodemailer Integration**
  - OTP email for password reset
  - Professional HTML email templates
  - Support for Gmail, SendGrid, AWS SES, Outlook
  - Email verification on startup

## 🛠️ Tech Stack

- **Runtime**: Node.js (v18+ recommended)
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (Aiven PostgreSQL Cloud)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Email**: Nodemailer
- **Environment**: dotenv
- **CORS**: cors middleware
- **Dev Tools**: ts-node-dev, TypeScript compiler

## 👥 User Roles

| Role | Code | Description | Capabilities |
|------|------|-------------|--------------|
| Super Admin | `SUPER_ADMIN` | Full system access | Manage all RTO offices, all users, system configuration |
| RTO Admin | `RTO_ADMIN` | RTO office manager | Manage specific RTO office, approve DLs/vehicles, handle disputes |
| RTO Officer | `RTO_OFFICER` | Field officer | Verify documents, schedule tests, process applications |
| Citizen | `CITIZEN` | Regular user | Apply for DL, register vehicles, pay challans, book appointments |
| Police | `POLICE` | Traffic enforcement | Issue challans, view violations, track offenders |
| Auditor | `AUDITOR` | Read-only analyst | Access reports, analytics, payment history (no write access) |

## 📦 Setup & Installation

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- PostgreSQL database (local or cloud)
- SMTP email account (optional, for OTP emails)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd final_project/backend
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- express, cors, dotenv
- pg (PostgreSQL client)
- jsonwebtoken, bcrypt
- nodemailer
- TypeScript and type definitions

## ⚙️ Environment Configuration

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration (Aiven PostgreSQL)
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require

# JWT Secrets (generate strong random strings)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long
JWT_REFRESH_SECRET=your_refresh_secret_key_also_long_and_random

# Email Configuration (for OTP and notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=RTO Management System <noreply@rto.com>
```

### Email Setup Options

#### Option 1: Gmail (Recommended for Development)
1. Enable 2-Factor Authentication on your Google Account
2. Go to Security → 2-Step Verification → App Passwords
3. Generate an App Password for "Mail"
4. Use this password in `EMAIL_PASSWORD`

#### Option 2: SendGrid (Production)
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```
- Free tier: 100 emails/day

#### Option 3: AWS SES
```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=your-aws-smtp-username
EMAIL_PASSWORD=your-aws-smtp-password
```

See [FORGOT_PASSWORD_SETUP.md](./FORGOT_PASSWORD_SETUP.md) for detailed email configuration.

## 🗄️ Database Setup

### Option 1: Automated Setup Script

```bash
npm run setup-db
```

This will run `setup-db.js` which creates all tables in the correct order.

### Option 2: Manual Setup

Run SQL files in this order:

```bash
# 1. RTO Offices
psql -U username -d database -f src/models/rto_offices.sql

# 2. Users
psql -U username -d database -f src/models/user.sql

# 3. Vehicles
psql -U username -d database -f src/models/vehicles.sql

# 4. DL Applications
psql -U username -d database -f src/models/dl_applications.sql

# 5. Driving Licenses
psql -U username -d database -f src/models/driving_licenses.sql

# 6. Challans
psql -U username -d database -f src/models/challans.sql

# 7. Payments
psql -U username -d database -f src/models/payments.sql

# 8. Appointments
psql -U username -d database -f src/models/appointments.sql

# 9. Notifications
psql -U username -d database -f src/models/notifications.sql
```

### Database Schema Overview

**Tables:**
- `users` - User accounts with roles
- `rto_offices` - RTO office locations and details
- `vehicles` - Vehicle registration data
- `dl_applications` - Driving license applications
- `driving_licenses` - Approved driving licenses
- `challans` - Traffic violation challans
- `payments` - Payment transactions
- `appointments` - Appointment bookings
- `notifications` - User notifications

## 🚀 Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

Server will start on `http://localhost:3001` (or your configured PORT)

### Production Build

```bash
# Build TypeScript to JavaScript
npm run build

# Run production server
npm start
```

### Check Server Status

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "data": {
    "timestamp": "2025-12-26T...",
    "uptime": 123.456,
    "status": "healthy"
  }
}
```

```

## 📚 API Documentation

### Base URL
```
http://localhost:3001
```

### Response Format

All API responses follow this standard format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

### API Endpoints Summary

#### 🔐 Authentication (`/auth`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Register new citizen account | Public |
| POST | `/auth/login` | Login and receive JWT tokens | Public |
| POST | `/auth/refresh-token` | Refresh expired access token | Public |
| POST | `/auth/logout` | Logout and invalidate refresh token | Authenticated |
| POST | `/auth/forgot-password` | Request password reset OTP via email | Public |
| POST | `/auth/reset-password` | Reset password using email + OTP | Public |
| POST | `/auth/verify-otp` | Verify OTP code | Public |
| PUT | `/auth/change-password` | Change password (logged in) | Authenticated |

**Forgot Password Flow:**
1. User requests OTP → `/auth/forgot-password` with email
2. OTP sent to email (6-digit, valid 10 minutes)
3. User submits OTP + new password → `/auth/reset-password`

#### 👤 User Management (`/users`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/users` | List all users | SUPER_ADMIN |
| GET | `/users/profile` | Get my profile | Authenticated |
| PUT | `/users/profile` | Update my profile | Authenticated |
| GET | `/users/:id` | Get user by ID | SUPER_ADMIN, RTO_ADMIN |
| PUT | `/users/:id` | Update user details | SUPER_ADMIN, RTO_ADMIN |
| DELETE | `/users/:id` | Soft delete user | SUPER_ADMIN |
| PUT | `/users/:id/status` | Update user status (ACTIVE/INACTIVE) | SUPER_ADMIN, RTO_ADMIN |
| POST | `/users/assign-role` | Assign role to user | SUPER_ADMIN |

#### 🏢 RTO Offices (`/rto/offices`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/rto/offices` | List all RTO offices | Authenticated |
| GET | `/rto/offices/:id` | Get RTO office details | Authenticated |
| POST | `/rto/offices` | Create new RTO office | SUPER_ADMIN |
| PUT | `/rto/offices/:id` | Update RTO office | SUPER_ADMIN |
| DELETE | `/rto/offices/:id` | Delete RTO office | SUPER_ADMIN |

#### 🚗 Vehicle Registration (`/vehicles`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/vehicles` | List all vehicles | SUPER_ADMIN, RTO_ADMIN, RTO_OFFICER |
| GET | `/vehicles/my` | Get my vehicles | CITIZEN |
| GET | `/vehicles/:id` | Get vehicle details | Authenticated |
| POST | `/vehicles/register` | Register new vehicle | CITIZEN |
| PUT | `/vehicles/:id/verify` | Verify vehicle documents | RTO_OFFICER |
| PUT | `/vehicles/:id/approve` | Approve registration & issue RC | RTO_ADMIN |
| POST | `/vehicles/:id/transfer` | Transfer vehicle ownership | CITIZEN |
| PUT | `/vehicles/:id/scrap` | Mark vehicle as scrapped | SUPER_ADMIN, RTO_ADMIN |

**Vehicle Status Flow:**
```
PENDING → VERIFIED (by Officer) → APPROVED (by Admin, RC issued) → ACTIVE
                                                                  ↓
                                                              SCRAPPED
```

#### 🪪 DL Applications (`/dl-applications`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/dl-applications` | List all DL applications | SUPER_ADMIN, RTO_ADMIN, RTO_OFFICER |
| GET | `/dl-applications/my` | Get my DL applications | CITIZEN |
| GET | `/dl-applications/:id` | Get application details | Authenticated |
| POST | `/dl-applications` | Apply for driving license | CITIZEN |
| PUT | `/dl-applications/:id/verify` | Verify documents | RTO_OFFICER |
| PUT | `/dl-applications/:id/schedule-test` | Schedule driving test | RTO_OFFICER, RTO_ADMIN |

#### 📜 Driving Licenses (`/dl`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/dl/my` | Get my driving license | CITIZEN |
| GET | `/dl/:dlNumber` | Get DL by number | Authenticated |
| PUT | `/dl/:id/approve` | Approve DL (issue license) | RTO_ADMIN |
| PUT | `/dl/:id/reject` | Reject DL application | RTO_ADMIN |
| PUT | `/dl/:id/renew` | Renew driving license | CITIZEN |

#### 🚨 Traffic Challans (`/challans`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/challans` | List all challans | SUPER_ADMIN, RTO_ADMIN, POLICE |
| GET | `/challans/my` | Get my challans | CITIZEN |
| GET | `/challans/:id` | Get challan details | Authenticated |
| GET | `/challans/vehicle/:vehicleId` | Get challans by vehicle | Authenticated |
| POST | `/challans` | Issue a challan | POLICE |
| POST | `/challans/:id/dispute` | Dispute challan | CITIZEN |
| PUT | `/challans/:id/resolve` | Resolve dispute | SUPER_ADMIN, RTO_ADMIN |

**Challan Fields:**
- `violation_type`: Type of traffic violation
- `location`: Where violation occurred (GPS coordinates or address)
- `fine_amount`: Penalty amount
- `status`: PENDING, PAID, DISPUTED, RESOLVED

#### 💳 Payments (`/payments`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/payments` | List all payments | SUPER_ADMIN, RTO_ADMIN, AUDITOR |
| GET | `/payments/history` | My payment history | CITIZEN |
| GET | `/payments/:id` | Get payment details | Authenticated |
| POST | `/payments/initiate` | Initiate payment | CITIZEN |
| POST | `/payments/pay/:challanId` | Pay challan | CITIZEN |
| PUT | `/payments/:id/verify` | Verify payment | Authenticated |
| POST | `/payments/:id/refund` | Refund payment | SUPER_ADMIN, RTO_ADMIN |

#### 📅 Appointments (`/appointments`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/appointments` | List all appointments | SUPER_ADMIN, RTO_ADMIN, RTO_OFFICER |
| GET | `/appointments/my` | Get my appointments | CITIZEN |
| GET | `/appointments/:id` | Get appointment details | Authenticated |
| POST | `/appointments/book` | Book appointment | CITIZEN |
| PUT | `/appointments/:id/reschedule` | Reschedule appointment | CITIZEN |
| PUT | `/appointments/:id/cancel` | Cancel appointment | CITIZEN |
| PUT | `/appointments/:id/complete` | Mark appointment complete | RTO_OFFICER, RTO_ADMIN |

#### 🔔 Notifications (`/notifications`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/notifications` | Get my notifications | Authenticated |
| PUT | `/notifications/:id/read` | Mark notification as read | Authenticated |
| POST | `/notifications/send` | Send notification to user | SUPER_ADMIN, RTO_ADMIN |

#### 📊 Analytics (`/analytics`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/analytics/dashboard` | Dashboard statistics | SUPER_ADMIN, RTO_ADMIN, AUDITOR |
| GET | `/analytics/revenue` | Revenue analytics | SUPER_ADMIN, RTO_ADMIN, AUDITOR |
| GET | `/analytics/violations` | Violation statistics | SUPER_ADMIN, RTO_ADMIN, AUDITOR, POLICE |
| GET | `/analytics/ml-risk` | ML-based risk assessment | SUPER_ADMIN, RTO_ADMIN |

#### ❤️ Health Check
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/health` | Server health status | Public |

#### ❤️ Health Check
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/health` | Server health status | Public |

## 🔐 Authentication

The API uses JWT (JSON Web Token) based authentication with two token types:

### Token Types

1. **Access Token**
   - Short-lived (15 minutes)
   - Used for authenticating API requests
   - Include in Authorization header

2. **Refresh Token**
   - Long-lived (7 days)
   - Used to obtain new access tokens
   - Stored in database for validation

### Making Authenticated Requests

Include the access token in the Authorization header:

```http
GET /users/profile HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Login Flow Example

```javascript
// 1. Login
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "...", "role": "CITIZEN" },
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci..."
  }
}

// 2. Use access token for requests
GET /vehicles/my
Authorization: Bearer <accessToken>

// 3. When access token expires, refresh it
POST /auth/refresh-token
{
  "refreshToken": "<refreshToken>"
}

// Response
{
  "success": true,
  "data": {
    "accessToken": "new_access_token...",
    "refreshToken": "new_refresh_token..."
  }
}
```

### Password Reset Flow

```javascript
// 1. Request OTP
POST /auth/forgot-password
{ "email": "user@example.com" }

// User receives 6-digit OTP via email (valid 10 minutes)

// 2. Reset password with OTP
POST /auth/reset-password
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "newPassword123"
}
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/         # Request handlers and business logic
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── vehicleController.ts
│   │   ├── dlApplicationController.ts
│   │   ├── drivingLicenseController.ts
│   │   ├── challanController.ts
│   │   ├── paymentController.ts
│   │   ├── appointmentController.ts
│   │   ├── notificationController.ts
│   │   ├── rtoOfficeController.ts
│   │   ├── analyticsController.ts
│   │   └── healthController.ts
│   │
│   ├── middlewares/         # Express middlewares
│   │   ├── authMiddleware.ts    # JWT verification
│   │   └── roleMiddleware.ts    # Role-based access control
│   │
│   ├── models/              # Database models and SQL schemas
│   │   ├── userModel.ts
│   │   ├── user.sql
│   │   ├── vehicleModel.ts
│   │   ├── vehicles.sql
│   │   ├── dlApplicationModel.ts
│   │   ├── dl_applications.sql
│   │   ├── drivingLicenseModel.ts
│   │   ├── driving_licenses.sql
│   │   ├── challanModel.ts
│   │   ├── challans.sql
│   │   ├── paymentModel.ts
│   │   ├── payments.sql
│   │   ├── appointmentModel.ts
│   │   ├── appointments.sql
│   │   ├── notificationModel.ts
│   │   ├── notifications.sql
│   │   ├── rtoOfficeModel.ts
│   │   ├── rto_offices.sql
│   │   └── analyticsModel.ts
│   │
│   ├── routes/              # API route definitions
│   │   ├── authRoutes.ts
│   │   ├── userRoutes.ts
│   │   ├── vehicleRoutes.ts
│   │   ├── dlApplicationRoutes.ts
│   │   ├── drivingLicenseRoutes.ts
│   │   ├── challanRoutes.ts
│   │   ├── paymentRoutes.ts
│   │   ├── appointmentRoutes.ts
│   │   ├── notificationRoutes.ts
│   │   ├── rtoOfficeRoutes.ts
│   │   ├── analyticsRoutes.ts
│   │   ├── healthRoutes.ts
│   │   └── roleTestRoutes.ts
│   │
│   ├── utils/               # Utility functions
│   │   └── emailService.ts  # Email sending with Nodemailer
│   │
│   ├── db.ts                # PostgreSQL database connection
│   └── index.ts             # Application entry point
│
├── dist/                    # Compiled JavaScript (generated)
├── node_modules/            # Dependencies
├── .env                     # Environment variables (not in git)
├── .env.example             # Example environment file
├── package.json             # Project dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── setup-db.js              # Database setup script
├── README.md                # This file
├── FORGOT_PASSWORD_SETUP.md # Email/OTP setup guide
└── API_TESTING_GUIDE.md     # Postman collection & testing

```

## 🆕 Recent Updates & Changelog

### December 2025

✅ **Forgot Password with OTP Email**
- Integrated Nodemailer for email sending
- Generate 6-digit OTP codes (10-minute expiry)
- Professional HTML email templates
- Support for Gmail, SendGrid, AWS SES, Outlook
- Updated `/auth/forgot-password` to send OTP
- Updated `/auth/reset-password` to verify OTP + email

✅ **Challan Location Tracking**
- Added `location` field to challans table
- Police can record violation location
- Migration script: `migrate-add-location.js`

✅ **Vehicle Scrapping Feature**
- Added scrap status to vehicles
- Admin/Super Admin can mark vehicles as scrapped
- Endpoint: `PUT /vehicles/:id/scrap`

✅ **Database Schema Improvements**
- Added OTP fields to users table (otp_code, otp_expires_at)
- Added reset token fields (reset_token, reset_token_expires_at)
- Location field for challans

## 📝 Development Notes

### Adding New Features

1. **Create Model** (`src/models/`)
   - Define TypeScript interface
   - Write SQL schema file
   - Create CRUD functions

2. **Create Controller** (`src/controllers/`)
   - Implement business logic
   - Handle request/response

3. **Create Routes** (`src/routes/`)
   - Define endpoints
   - Apply middleware

4. **Register Routes** (`src/index.ts`)
   - Import and use routes

### Database Migrations

When adding/modifying fields:

1. Create migration script (e.g., `migrate-add-field.js`)
2. Test on dev database
3. Document in changelog
4. Update model interfaces

### Testing APIs

Use the provided Postman collection:
```bash
# Import into Postman
backend/postman_collection.json
```

Or use curl:
```bash
# Health check
curl http://localhost:3001/health

# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🚨 Troubleshooting

### Database Connection Issues

```
Error: connect ECONNREFUSED
```

**Solution:**
- Verify `DATABASE_URL` in `.env`
- Check PostgreSQL is running
- Ensure firewall allows connection
- For Aiven, verify SSL mode is enabled

### Email Not Sending

```
❌ Email service configuration error
```

**Solution:**
- Check `EMAIL_*` variables in `.env`
- For Gmail, use App Password (not regular password)
- Verify SMTP port is not blocked by firewall
- Check console logs for OTP (development mode)

### JWT Token Errors

```
Error: jwt malformed
```

**Solution:**
- Ensure `JWT_SECRET` is set in `.env`
- Check Authorization header format: `Bearer <token>`
- Token may have expired (access tokens expire in 15 min)

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution:**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

## 🔒 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` to git
   - Use strong JWT secrets (32+ characters)
   - Rotate secrets periodically

2. **Password Security**
   - Passwords hashed with bcrypt (10 rounds)
   - Minimum 6 characters enforced
   - Consider adding password strength requirements

3. **API Security**
   - Rate limiting (recommended to add)
   - CORS configured for frontend origin
   - SQL injection prevention (parameterized queries)

4. **Email Security**
   - OTP expires in 10 minutes
   - Single-use OTPs
   - Don't reveal if email exists

## 📦 Deployment

### Preparation

```bash
# Build TypeScript
npm run build

# Test production build
NODE_ENV=production npm start
```

### Environment Variables for Production

Ensure these are set:
- `NODE_ENV=production`
- `DATABASE_URL` (production database)
- Strong `JWT_SECRET` and `JWT_REFRESH_SECRET`
- Email credentials (if using OTP feature)
- Correct `PORT` and `CORS_ORIGIN`

### Recommended Platforms

- **Railway**: Auto-deployment from Git
- **Heroku**: Add PostgreSQL add-on
- **AWS EC2**: Full control
- **DigitalOcean**: App Platform
- **Render**: Free tier available

### Database Hosting

- **Aiven** (currently used): Managed PostgreSQL
- **Neon**: Serverless PostgreSQL
- **Supabase**: PostgreSQL with extras
- **AWS RDS**: Enterprise-grade

## 📞 Support & Contributing

### Reporting Issues

Please include:
- Description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment (OS, Node version)
- Error logs

### Feature Requests

Open an issue with:
- Feature description
- Use case
- Proposed implementation (optional)

## 📄 License

This project is private and proprietary.

## 👨‍💻 Authors

RTO Management System Development Team

---

**Last Updated:** December 26, 2025
