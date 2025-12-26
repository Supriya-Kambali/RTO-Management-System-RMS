# RTO Management System - Complete API Testing Guide

## 📥 Step 1: Import Postman Collection

1. Open Postman
2. Click **Import** button
3. Select the file: `postman_collection.json`
4. The collection "RTO Management System API" will be imported

---

## 🗄️ Step 2: Setup Database Tables

Before testing, run these SQL commands in your Aiven PostgreSQL console:

### Connect to Database
```
Host: <YOUR_DATABASE_HOST>
Port: <YOUR_DATABASE_PORT>
Database: <YOUR_DATABASE_NAME>
User: <YOUR_DATABASE_USER>
Password: <YOUR_DATABASE_PASSWORD>
```

Note: Get your database credentials from your .env file or your database provider.

### Create Tables (Run in Order)

```sql
-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    role VARCHAR(20) DEFAULT 'CITIZEN' CHECK (role IN ('SUPER_ADMIN', 'RTO_ADMIN', 'RTO_OFFICER', 'CITIZEN', 'POLICE', 'AUDITOR')),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    address TEXT,
    date_of_birth DATE,
    aadhaar_number VARCHAR(20),
    rto_office_id UUID,
    email_verified BOOLEAN DEFAULT false,
    otp VARCHAR(10),
    otp_expires_at TIMESTAMP,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    refresh_token TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. RTO Offices Table
CREATE TABLE IF NOT EXISTS rto_offices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    state VARCHAR(50) NOT NULL,
    district VARCHAR(50) NOT NULL,
    address TEXT,
    phone VARCHAR(15),
    email VARCHAR(150),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    registration_number VARCHAR(20) UNIQUE,
    vehicle_type VARCHAR(50) NOT NULL,
    make VARCHAR(50),
    model VARCHAR(50),
    year INTEGER,
    color VARCHAR(30),
    engine_number VARCHAR(50),
    chassis_number VARCHAR(50),
    fuel_type VARCHAR(20) CHECK (fuel_type IN ('Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid')),
    rto_office_id UUID REFERENCES rto_offices(id),
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'VERIFIED', 'APPROVED', 'REJECTED', 'TRANSFERRED', 'SCRAPPED')),
    verified_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    registration_date DATE,
    insurance_expiry DATE,
    puc_expiry DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. DL Applications Table
CREATE TABLE IF NOT EXISTS dl_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rto_office_id UUID REFERENCES rto_offices(id),
    license_type VARCHAR(20) DEFAULT 'LMV' CHECK (license_type IN ('LMV', 'MCWG', 'HMV', 'HGMV', 'HPMV', 'TRANS')),
    status VARCHAR(30) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'DOCUMENTS_VERIFIED', 'TEST_SCHEDULED', 'TEST_PASSED', 'TEST_FAILED', 'APPROVED', 'REJECTED')),
    verified_by UUID REFERENCES users(id),
    test_scheduled_at TIMESTAMP,
    test_result VARCHAR(10) CHECK (test_result IN ('PASS', 'FAIL')),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Driving Licenses Table
CREATE TABLE IF NOT EXISTS driving_licenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(20) UNIQUE NOT NULL,
    license_type VARCHAR(20) DEFAULT 'LMV' CHECK (license_type IN ('LMV', 'MCWG', 'HMV', 'HGMV', 'HPMV', 'TRANS')),
    rto_office_id UUID REFERENCES rto_offices(id),
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'EXPIRED', 'SUSPENDED', 'REVOKED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Challans Table
CREATE TABLE IF NOT EXISTS challans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    issued_by UUID NOT NULL REFERENCES users(id),
    violation_type VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'UNPAID' CHECK (status IN ('UNPAID', 'PAID', 'DISPUTED', 'CANCELLED')),
    dispute_reason TEXT,
    dispute_resolved_by UUID REFERENCES users(id),
    dispute_resolution TEXT,
    location VARCHAR(255),
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challan_id UUID REFERENCES challans(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_type VARCHAR(30) DEFAULT 'CHALLAN' CHECK (payment_type IN ('CHALLAN', 'REGISTRATION', 'LICENSE', 'RENEWAL', 'TRANSFER', 'OTHER')),
    reference_id UUID,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')),
    transaction_id VARCHAR(100),
    payment_method VARCHAR(30),
    refund_reason TEXT,
    refunded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rto_office_id UUID REFERENCES rto_offices(id),
    purpose VARCHAR(100) NOT NULL,
    appointment_date TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED')),
    notes TEXT,
    completed_by UUID REFERENCES users(id),
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_vehicles_owner ON vehicles(owner_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_registration ON vehicles(registration_number);
CREATE INDEX IF NOT EXISTS idx_challans_vehicle ON challans(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_challans_status ON challans(status);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
```

---

## 👤 Step 3: Create SUPER_ADMIN User

After creating tables, insert a SUPER_ADMIN user:

```sql
-- Password is: admin123 (bcrypt hashed)
INSERT INTO users (name, email, password, phone, role, status, email_verified)
VALUES (
    'Super Admin',
    'admin@rto.gov.in',
    '$2a$10$rMgKxLBxcGNHaJK9TU8U/.KwKq5N/gPE6eM8YFTmqj8HmQHWqF2.K',
    '9999999999',
    'SUPER_ADMIN',
    'ACTIVE',
    true
);
```

---

## 🧪 Step 4: Start Testing

### Make Sure Server is Running
```bash
npm run dev
```
Server should be running on `http://localhost:3000`

---

## 📋 Complete Testing Flow

### Test 1: Health Check ✅
```
GET http://localhost:3000/health
```
**Expected:** `{"success":true,"message":"RTO Management System API is running"}`

---

### Test 2: Login as SUPER_ADMIN 🔐
```
POST http://localhost:3000/auth/login
Content-Type: application/json

{
    "email": "admin@rto.gov.in",
    "password": "admin123"
}
```
**Response:**
```json
{
    "success": true,
    "data": {
        "user": {
            "id": "uuid-here",
            "name": "Super Admin",
            "email": "admin@rto.gov.in",
            "role": "SUPER_ADMIN"
        },
        "accessToken": "eyJhbGciOiJIUzI1NiIs...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
}
```
**⚠️ Copy the accessToken - you'll need it for all subsequent requests**

---

### Test 3: Create RTO Office (SUPER_ADMIN) 🏢
```
POST http://localhost:3000/rto/offices
Authorization: Bearer <your_access_token>
Content-Type: application/json

{
    "name": "Mumbai Central RTO",
    "code": "MH01",
    "state": "Maharashtra",
    "district": "Mumbai",
    "address": "RTO Building, Tardeo Road, Mumbai - 400034",
    "phone": "022-23456789",
    "email": "mh01@rto.gov.in"
}
```
**⚠️ Copy the rto_office id from response**

---

### Test 4: Register a Citizen 👤
```
POST http://localhost:3000/auth/register
Content-Type: application/json

{
    "name": "Rahul Sharma",
    "email": "rahul@gmail.com",
    "password": "password123",
    "phone": "9876543210"
}
```

---

### Test 5: Login as Citizen 🔐
```
POST http://localhost:3000/auth/login
Content-Type: application/json

{
    "email": "rahul@gmail.com",
    "password": "password123"
}
```
**⚠️ Copy the citizen's accessToken**

---

### Test 6: Update Citizen Profile 📝
```
PUT http://localhost:3000/users/profile
Authorization: Bearer <citizen_access_token>
Content-Type: application/json

{
    "name": "Rahul Kumar Sharma",
    "phone": "9876543211",
    "address": "123 Main Street, Mumbai, Maharashtra",
    "date_of_birth": "1995-05-15",
    "aadhaar_number": "1234-5678-9012"
}
```

---

### Test 7: Register a Vehicle (CITIZEN) 🚗
```
POST http://localhost:3000/vehicles/register
Authorization: Bearer <citizen_access_token>
Content-Type: application/json

{
    "vehicle_type": "Car",
    "make": "Maruti Suzuki",
    "model": "Swift",
    "year": 2024,
    "color": "White",
    "engine_number": "K12N1234567",
    "chassis_number": "MA3EYD81S00123456",
    "fuel_type": "Petrol",
    "rto_office_id": "<rto_office_id_from_step_3>"
}
```
**⚠️ Copy the vehicle id**

---

### Test 8: Assign RTO_OFFICER Role (SUPER_ADMIN) 👮
```
POST http://localhost:3000/users/assign-role
Authorization: Bearer <super_admin_token>
Content-Type: application/json

{
    "userId": "<some_user_id>",
    "role": "RTO_OFFICER",
    "rtoOfficeId": "<rto_office_id>"
}
```

---

### Test 9: Create POLICE User 🚔
```sql
-- Run in database
INSERT INTO users (name, email, password, phone, role, status, email_verified)
VALUES (
    'Traffic Police',
    'police@traffic.gov.in',
    '$2a$10$rMgKxLBxcGNHaJK9TU8U/.KwKq5N/gPE6eM8YFTmqj8HmQHWqF2.K',
    '9888888888',
    'POLICE',
    'ACTIVE',
    true
);
```

Login as Police:
```
POST http://localhost:3000/auth/login
Content-Type: application/json

{
    "email": "police@traffic.gov.in",
    "password": "admin123"
}
```

---

### Test 10: Issue Challan (POLICE) 🎫
```
POST http://localhost:3000/challans
Authorization: Bearer <police_access_token>
Content-Type: application/json

{
    "vehicle_id": "<vehicle_id_from_step_7>",
    "violation_type": "Over Speeding",
    "amount": 1000
}
```
**⚠️ Copy the challan id**

---

### Test 11: Pay Challan (CITIZEN) 💳
```
POST http://localhost:3000/payments/pay/<challan_id>
Authorization: Bearer <citizen_access_token>
```

---

### Test 12: Apply for Driving License (CITIZEN) 📄
```
POST http://localhost:3000/dl-applications
Authorization: Bearer <citizen_access_token>
Content-Type: application/json

{
    "rto_office_id": "<rto_office_id>",
    "license_type": "LMV"
}
```
**⚠️ Copy the dl_application id**

---

### Test 13: Book Appointment (CITIZEN) 📅
```
POST http://localhost:3000/appointments/book
Authorization: Bearer <citizen_access_token>
Content-Type: application/json

{
    "rto_office_id": "<rto_office_id>",
    "purpose": "Driving License Test",
    "appointment_date": "2025-01-20T10:00:00Z"
}
```

---

### Test 14: Get Dashboard Analytics (Admin) 📊
```
GET http://localhost:3000/analytics/dashboard
Authorization: Bearer <super_admin_token>
```

---

## 🔑 Role-Based Access Summary

| Endpoint | SUPER_ADMIN | RTO_ADMIN | RTO_OFFICER | CITIZEN | POLICE | AUDITOR |
|----------|-------------|-----------|-------------|---------|--------|---------|
| Create RTO Office | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Assign Roles | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Register Vehicle | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Verify Vehicle | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Approve Vehicle | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Issue Challan | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Pay Challan | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| View Analytics | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |

---

## 🎯 Quick Test Script (All in One)

Here's the order to test everything:

1. **Health Check** → Verify server is up
2. **Login SUPER_ADMIN** → Get admin token
3. **Create RTO Office** → Get office ID
4. **Register Citizen** → Create test user
5. **Login Citizen** → Get citizen token
6. **Update Profile** → Add personal details
7. **Register Vehicle** → Get vehicle ID
8. **Create Police User** → (via SQL)
9. **Login Police** → Get police token
10. **Issue Challan** → Get challan ID
11. **Pay Challan** → Complete payment
12. **Apply for DL** → Get application ID
13. **Book Appointment** → Schedule visit
14. **Check Notifications** → View updates
15. **View Analytics** → Dashboard stats

---

## ⚠️ Common Issues

### 1. "Token required" Error
**Solution:** Add `Authorization: Bearer <token>` header

### 2. "Unauthorized" Error
**Solution:** Token expired. Call `/auth/refresh-token` or login again

### 3. "Access denied" Error
**Solution:** Your role doesn't have permission. Login with correct role

### 4. "Not found" Error
**Solution:** Check if the ID exists in database

---

## 🔧 Postman Variables

The collection uses these variables (auto-set by test scripts):
- `{{base_url}}` - http://localhost:3000
- `{{access_token}}` - JWT access token
- `{{refresh_token}}` - JWT refresh token
- `{{user_id}}` - Current user ID
- `{{rto_office_id}}` - RTO office ID
- `{{vehicle_id}}` - Vehicle ID
- `{{challan_id}}` - Challan ID
- `{{payment_id}}` - Payment ID
- `{{appointment_id}}` - Appointment ID
- `{{dl_application_id}}` - DL application ID

---

## ✅ Testing Complete!

You now have a fully functional RTO Management System with:
- 6 User Roles
- 60+ API Endpoints
- Complete Authentication Flow
- Vehicle Registration
- Challan Management
- Payment Processing
- Appointment Booking
- Analytics Dashboard
