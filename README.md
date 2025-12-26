# RTO Management System - Frontend

A modern, responsive web application for RTO (Regional Transport Office) Management System built with React, TypeScript, and Tailwind CSS. This application provides a comprehensive interface for citizens, RTO officials, police, and administrators to manage vehicle registrations, driving licenses, traffic challans, and more.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [User Roles & Dashboards](#user-roles--dashboards)
- [Setup & Installation](#setup--installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Available Pages](#available-pages)
- [Components](#components)
- [State Management](#state-management)
- [Styling](#styling)
- [Recent Updates](#recent-updates)
- [Build & Deployment](#build--deployment)

## ✨ Features

### Core Functionality

- ✅ **Authentication & Authorization**
  - Secure login/register with JWT tokens
  - Role-based access control (6 user roles)
  - Password reset with OTP via email ✨ **WORKING**
  - Email OTP verification with resend functionality ✨ **NEW**
  - Profile management
  - Session persistence

- ✅ **Responsive Design**
  - Mobile-first approach
  - Tailwind CSS utility classes
  - shadcn/ui components
  - Dark/light mode support
  - Animated 3D globe visualization

- ✅ **Citizen Portal**
  - Vehicle registration and tracking
  - Driving license applications
  - Challan payment
  - Appointment booking
  - Payment history
  - Real-time notifications

- ✅ **RTO Officer Dashboard**
  - Document verification
  - DL test scheduling
  - Application processing
  - Vehicle inspections

- ✅ **RTO Admin Dashboard**
  - Approve/reject DL applications
  - Approve vehicle registrations
  - Manage appointments
  - Resolve disputes
  - Analytics and reports

- ✅ **Police Dashboard**
  - Issue traffic challans
  - Track violations
  - View violation statistics
  - Search vehicles by registration

- ✅ **Super Admin Panel**
  - Manage RTO offices
  - User management
  - Role assignments
  - System configuration
  - Global analytics

- ✅ **Auditor Portal**
  - View reports and analytics
  - Payment audits
  - Revenue tracking
  - Read-only access

### UI/UX Features

- ✅ Interactive 3D globe on homepage
- ✅ Glass morphism design
- ✅ Gradient animations
- ✅ Toast notifications
- ✅ Loading states and skeletons
- ✅ Form validation
- ✅ Responsive navigation
- ✅ Card-based layouts
- ✅ Modal dialogs

## 🛠️ Tech Stack

### Core Technologies

- **React** 18.3+ - UI library
- **TypeScript** 5.9+ - Type safety
- **Vite** 6.0+ - Build tool and dev server
- **React Router DOM** 7.1+ - Client-side routing

### UI Libraries

- **Tailwind CSS** 3.4+ - Utility-first CSS
- **shadcn/ui** - Pre-built accessible components
- **Radix UI** - Headless UI primitives
- **Lucide React** - Icon library

### 3D & Animations

- **Three.js** - 3D graphics
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Three.js helpers
- **Framer Motion** - Animation library

### HTTP & State

- **Axios** - HTTP client
- **React Context API** - Global state
- **Custom hooks** - Reusable logic

## 👥 User Roles & Dashboards

| Role | Route | Key Features |
|------|-------|--------------|
| **Citizen** | `/citizen/dashboard` | Register vehicles, apply for DL, pay challans, book appointments |
| **Police** | `/police/dashboard` | Issue challans, track violations, search vehicles |
| **RTO Officer** | `/officer/dashboard` | Verify documents, schedule tests, process applications |
| **RTO Admin** | `/admin/dashboard` | Approve DLs/vehicles, manage office, resolve disputes |
| **Super Admin** | `/super-admin/dashboard` | Manage all RTOs, users, system settings |
| **Auditor** | `/auditor/dashboard` | View analytics, reports, payment history (read-only) |

## 📦 Setup & Installation

### Prerequisites

- Node.js v18 or higher
- npm, yarn, or bun
- Backend API running (see backend README)

### 1. Clone & Navigate

### 1. Clone & Navigate

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to frontend directory
cd final_project/frontend
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Configure Environment (Optional)

Create `.env` file:

```env
VITE_API_URL=http://localhost:3001
```

## 🚀 Running the Application

### Development Mode

```sh
npm run dev
```

App starts at `http://localhost:5173` with Hot Module Replacement.

### Production Build

```sh
# Build
npm run build

# Preview
npm run preview
```

### Linting

```sh
npm run lint
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── layout/              # Layout components
│   │   ├── auth/                # Auth components
│   │   ├── DigitalGlobe.tsx     # 3D globe
│   │   └── NavLink.tsx
│   │
│   ├── pages/                   # Page components
│   │   ├── auth/                # Login, Register, ForgotPassword, etc.
│   │   ├── citizen/             # Citizen portal pages
│   │   ├── officer/             # RTO Officer pages
│   │   ├── admin/               # RTO Admin pages
│   │   ├── police/              # Police pages
│   │   ├── superadmin/          # Super Admin pages
│   │   ├── auditor/             # Auditor pages
│   │   └── public/              # Public pages
│   │
│   ├── contexts/                # React Context providers
│   │   └── AuthContext.tsx
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-toast.ts
│   │   ├── use-mobile.tsx
│   │   └── use-notifications.tsx
│   │
│   ├── services/                # API service layer
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── vehicleService.ts
│   │   └── ...
│   │
│   ├── types/                   # TypeScript types
│   ├── lib/                     # Utilities
│   ├── App.tsx                  # Main App
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
│
├── public/                      # Static assets
├── index.html                   # HTML template
├── vite.config.ts              # Vite config
├── tailwind.config.ts          # Tailwind config
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies
```

## 📄 Available Pages

### Public (No Auth Required)
- `/` - Homepage with 3D globe
- `/auth/login` - Login
- `/auth/register` - Register
- `/auth/forgot-password` - Request password reset
- `/auth/verify-otp` - Enter OTP code
- `/auth/reset-password` - Set new password

### Citizen Portal (`/citizen/*`)
- Dashboard, Vehicle Registration, My Vehicles
- DL Application, Challans, Payments, Appointments

### Officer Portal (`/officer/*`)
- Dashboard, Verifications, Test Scheduling

### Admin Portal (`/admin/*`)
- Dashboard, Approvals, Dispute Resolution

### Police Portal (`/police/*`)
- Dashboard, Issue Challans, Search Vehicles

### Super Admin (`/super-admin/*`)
- System Management, User Management, Analytics

### Auditor (`/auditor/*`)
- Reports, Analytics (Read-only)

## 🎨 Components

### shadcn/ui Components

```typescript
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
```

### Custom Components

**DigitalGlobe** - 3D globe animation
**DashboardLayout** - Reusable layout wrapper
**ProtectedRoute** - Route authentication

## 🔄 State Management

### Auth Context

```typescript
import { useAuth } from '@/contexts/AuthContext';

const { user, isAuthenticated, login, logout } = useAuth();
```

## 🎨 Styling

- **Tailwind CSS** - Utility classes
- **Custom CSS** - Global and app-specific styles
- **Glass Morphism** - Modern UI effects
- **Animations** - Framer Motion + CSS

## 🆕 Recent Updates

### December 2025

✅ **Forgot Password with OTP**
- Complete email OTP flow
- 6-digit OTP input component
- Password visibility toggle
- Success/error animations

✅ **Enhanced UI**
- 3D globe homepage
- Updated meta tags
- Removed "Lovable App" branding
- Mobile-responsive design

## 🏗️ Build & Deployment

### Build for Production

```sh
npm run build
```

Output: `dist/` directory

### Deployment Platforms

**Vercel (Recommended)**
```sh
npm i -g vercel
vercel
```

**Netlify**
- Build command: `npm run build`
- Publish directory: `dist`

**Docker**
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

## 🐛 Troubleshooting

**Port in use:**
```sh
npx kill-port 5173
```

**API not connecting:**
- Check backend is running
- Verify `VITE_API_URL` in `.env`
- Check CORS settings

**Build errors:**
- Clear node_modules
- Reinstall dependencies
- Check import paths

## 📞 Support

For issues, include:
- Browser and version
- Steps to reproduce
- Console errors
- Screenshots

## 📄 License

Private and Proprietary

## 👨‍💻 Authors

RTO Management System Development Team

---

**Last Updated:** December 26, 2025
**Version:** 1.0.0
