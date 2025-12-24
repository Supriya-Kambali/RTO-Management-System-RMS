# RTO Management System - Backend

A comprehensive backend API for RTO (Regional Transport Office) Management System built with Node.js, TypeScript, Express.js, and PostgreSQL.

## Tech Stack

- Node.js (LTS)
- TypeScript
- Express.js
- PostgreSQL with pg (raw SQL, no ORM)
- JWT for authentication (access + refresh tokens)
- bcrypt for password hashing

## User Roles

| Role | Description |
|------|-------------|
| `SUPER_ADMIN` | Full system access, manages all RTO offices |
| `RTO_ADMIN` | Manages a specific RTO office |
| `RTO_OFFICER` | Handles DL/vehicle verifications and approvals |
| `CITIZEN` | Regular user - applies for DL, registers vehicles |
| `POLICE` | Issues challans, views violations |
| `AUDITOR` | Read-only access to reports and analytics |

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rto_management
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

### 3. Database Setup

Create a PostgreSQL database named `rto_management` and run the SQL files in `src/models/` in this order:

1. `rto_offices.sql`
2. `user.sql`
3. `vehicles.sql`
4. `dl_applications.sql`
5. `driving_licenses.sql`
6. `challans.sql`
7. `payments.sql`
8. `appointments.sql`
9. `notifications.sql`

### 4. Run the Server

Development:
```bash
npm run dev
```

Production:
```bash
npm run build
npm start
```

## API Endpoints

### Health Check
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/health` | Server health status | Public |

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Register new citizen | Public |
| POST | `/auth/login` | Login and get tokens | Public |
| POST | `/auth/refresh-token` | Refresh access token | Public |
| POST | `/auth/logout` | Logout user | Authenticated |
| POST | `/auth/forgot-password` | Request password reset | Public |
| POST | `/auth/reset-password` | Reset password with token | Public |
| POST | `/auth/verify-otp` | Verify OTP code | Public |
| PUT | `/auth/change-password` | Change password | Authenticated |

### User Management
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/users` | List all users | SUPER_ADMIN |
| GET | `/users/profile` | Get my profile | Authenticated |
| PUT | `/users/profile` | Update my profile | Authenticated |
| GET | `/users/:id` | Get user by ID | SUPER_ADMIN, RTO_ADMIN |
| PUT | `/users/:id` | Update user | SUPER_ADMIN, RTO_ADMIN |
| DELETE | `/users/:id` | Delete user | SUPER_ADMIN |
| PUT | `/users/:id/status` | Update user status | SUPER_ADMIN, RTO_ADMIN |
| POST | `/users/assign-role` | Assign role to user | SUPER_ADMIN |

### RTO Offices
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/rto/offices` | List all RTO offices | Authenticated |
| GET | `/rto/offices/:id` | Get RTO office by ID | Authenticated |
| POST | `/rto/offices` | Create RTO office | SUPER_ADMIN |
| PUT | `/rto/offices/:id` | Update RTO office | SUPER_ADMIN |
| DELETE | `/rto/offices/:id` | Delete RTO office | SUPER_ADMIN |

### Vehicle Registration
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/vehicles` | List all vehicles | SUPER_ADMIN, RTO_ADMIN, RTO_OFFICER |
| GET | `/vehicles/my` | Get my vehicles | CITIZEN |
| GET | `/vehicles/:id` | Get vehicle by ID | Authenticated |
| POST | `/vehicles/register` | Register new vehicle | CITIZEN |
| PUT | `/vehicles/:id/verify` | Verify vehicle documents | RTO_OFFICER |
| PUT | `/vehicles/:id/approve` | Approve vehicle registration | RTO_ADMIN |
| POST | `/vehicles/:id/transfer` | Transfer vehicle ownership | CITIZEN |
| PUT | `/vehicles/:id/scrap` | Mark vehicle as scrapped | SUPER_ADMIN, RTO_ADMIN |

### DL Applications
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/dl-applications` | List all applications | SUPER_ADMIN, RTO_ADMIN, RTO_OFFICER |
| GET | `/dl-applications/my` | Get my applications | CITIZEN |
| GET | `/dl-applications/:id` | Get application by ID | Authenticated |
| POST | `/dl-applications` | Apply for driving license | CITIZEN |
| PUT | `/dl-applications/:id/verify` | Verify documents | RTO_OFFICER |
| PUT | `/dl-applications/:id/schedule-test` | Schedule driving test | RTO_OFFICER, RTO_ADMIN |

### Driving Licenses
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/dl/my` | Get my driving license | CITIZEN |
| GET | `/dl/:dlNumber` | Get DL by number | Authenticated |
| PUT | `/dl/:id/approve` | Approve DL application | RTO_ADMIN |
| PUT | `/dl/:id/reject` | Reject DL application | RTO_ADMIN |
| PUT | `/dl/:id/renew` | Renew driving license | CITIZEN |

### Challans
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/challans` | List all challans | SUPER_ADMIN, RTO_ADMIN, POLICE |
| GET | `/challans/my` | Get my challans | CITIZEN |
| GET | `/challans/:id` | Get challan by ID | Authenticated |
| GET | `/challans/vehicle/:vehicleId` | Get challans by vehicle | Authenticated |
| POST | `/challans` | Issue a challan | POLICE |
| POST | `/challans/:id/dispute` | Dispute a challan | CITIZEN |
| PUT | `/challans/:id/resolve` | Resolve challan dispute | SUPER_ADMIN, RTO_ADMIN |

### Payments
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/payments` | List all payments | SUPER_ADMIN, RTO_ADMIN, AUDITOR |
| GET | `/payments/history` | Get my payment history | CITIZEN |
| GET | `/payments/:id` | Get payment by ID | Authenticated |
| POST | `/payments/initiate` | Initiate a payment | CITIZEN |
| POST | `/payments/pay/:challanId` | Pay a challan | CITIZEN |
| PUT | `/payments/:id/verify` | Verify payment | Authenticated |
| POST | `/payments/:id/refund` | Refund a payment | SUPER_ADMIN, RTO_ADMIN |

### Appointments
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/appointments` | List all appointments | SUPER_ADMIN, RTO_ADMIN, RTO_OFFICER |
| GET | `/appointments/my` | Get my appointments | CITIZEN |
| GET | `/appointments/:id` | Get appointment by ID | Authenticated |
| POST | `/appointments/book` | Book an appointment | CITIZEN |
| PUT | `/appointments/:id/reschedule` | Reschedule appointment | CITIZEN |
| PUT | `/appointments/:id/cancel` | Cancel appointment | CITIZEN |
| PUT | `/appointments/:id/complete` | Complete appointment | RTO_OFFICER, RTO_ADMIN |

### Notifications
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/notifications` | Get my notifications | Authenticated |
| PUT | `/notifications/:id/read` | Mark as read | Authenticated |
| POST | `/notifications/send` | Send notification | SUPER_ADMIN, RTO_ADMIN |

### Analytics
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/analytics/dashboard` | Dashboard statistics | SUPER_ADMIN, RTO_ADMIN, AUDITOR |
| GET | `/analytics/revenue` | Revenue analytics | SUPER_ADMIN, RTO_ADMIN, AUDITOR |
| GET | `/analytics/violations` | Violation statistics | SUPER_ADMIN, RTO_ADMIN, AUDITOR, POLICE |
| GET | `/analytics/ml-risk` | ML risk assessment | SUPER_ADMIN, RTO_ADMIN |

## Response Format

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "message": "Optional message",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## Authentication

The API uses JWT-based authentication with access and refresh tokens:

- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (7 days), used to obtain new access tokens

Include the access token in the `Authorization` header:
```
Authorization: Bearer <access_token>
```

## Project Structure

```
src/
├── controllers/     # Request handlers
├── middlewares/     # Auth and role middlewares
├── models/          # Database models and SQL
├── routes/          # API route definitions
├── db.ts            # Database connection
└── index.ts         # App entry point
```
