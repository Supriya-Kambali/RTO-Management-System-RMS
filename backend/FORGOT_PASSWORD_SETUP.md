# Forgot Password with OTP Email - Setup Guide

## Overview
This feature implements a secure password reset flow using OTP (One-Time Password) sent via email. Users can reset their password by receiving a 6-digit OTP code in their email, which is valid for 10 minutes.

## Flow Diagram
```
User → Enter Email → Receive OTP Email → Enter OTP → Set New Password → Login
```

## Backend Setup

### 1. Email Configuration

Add the following environment variables to your `.env` file:

```env
# Email Configuration (for OTP and notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=RTO Management System <noreply@rto.com>
```

### 2. Gmail Setup (Recommended)

If using Gmail:
1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security → 2-Step Verification → App Passwords
4. Generate an App Password for "Mail"
5. Use this password in `EMAIL_PASSWORD`

**Note:** Regular Gmail passwords won't work. You MUST use an App-Specific Password.

### 3. Alternative Email Providers

#### 
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

#### AWS SES
```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=your-aws-smtp-username
EMAIL_PASSWORD=your-aws-smtp-password
```

#### Outlook/Office365
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

## API Endpoints

### 1. Request Password Reset (Send OTP)
```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "If the email exists in our system, you will receive an OTP shortly"
}
```

### 2. Reset Password with OTP
```http
POST /auth/reset-password
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "newSecurePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successful. You can now login with your new password"
}
```

## Frontend Pages

### 1. Forgot Password (`/auth/forgot-password`)
- User enters their email address
- System sends OTP to email
- Redirects to OTP verification page

### 2. Verify OTP (`/auth/verify-otp?email=...`)
- User enters 6-digit OTP from email
- Option to resend OTP
- Validates OTP and proceeds to reset password

### 3. Reset Password (`/auth/reset-password?email=...&otp=...`)
- User creates new password
- Password must be at least 6 characters
- Confirms password match
- Resets password and redirects to login

## Database Schema

The OTP functionality uses existing fields in the `users` table:
- `otp_code` (varchar): Stores the 6-digit OTP
- `otp_expires_at` (timestamp): OTP expiration time (10 minutes from generation)

## Security Features

1. **OTP Expiration**: OTPs expire after 10 minutes
2. **Single Use**: OTPs are cleared after successful password reset
3. **Email Privacy**: System doesn't reveal if email exists in database
4. **Password Validation**: Minimum 6 characters required
5. **Secure Email**: HTML email templates with security warnings

## Testing

### Local Testing (Development)

For local development without email setup, you can:
1. Check server console logs for OTP codes
2. Copy the OTP from console and use it in the frontend

Example console output:
```
🔐 OTP generated for user@example.com: 123456 (expires in 10 minutes)
```

### Production Testing

1. Configure real SMTP credentials
2. Test with your own email address
3. Verify email delivery and OTP expiration
4. Test "resend OTP" functionality

## Troubleshooting

### Email Not Sending

1. **Check Environment Variables**
   ```bash
   # In backend directory
   cat .env | grep EMAIL
   ```

2. **Verify SMTP Credentials**
   - Test credentials with an email client
   - Ensure App Password is used (for Gmail)

3. **Check Server Logs**
   ```
   ❌ Email service configuration error: [error details]
   ```

4. **Firewall Issues**
   - Ensure port 587 (or 465 for SSL) is not blocked
   - Some networks block SMTP ports

### OTP Invalid or Expired

1. **Check Server Time**
   - Ensure server time is synchronized (NTP)
   - OTP expiry is calculated based on server time

2. **OTP Already Used**
   - OTPs can only be used once
   - Request a new OTP if needed

3. **Wrong Email**
   - Ensure email matches the one used in forgot password

## Email Template Customization

Edit `backend/src/utils/emailService.ts` to customize:
- Email subject line
- HTML template styling
- Company name and branding
- OTP validity message

## Rate Limiting (Recommended)

To prevent abuse, consider implementing rate limiting:
```typescript
// Example: Limit to 3 OTP requests per email per hour
const MAX_OTP_REQUESTS = 3;
const TIME_WINDOW = 3600000; // 1 hour in ms
```

## Future Enhancements

- [ ] Add rate limiting for OTP requests
- [ ] Track failed OTP attempts
- [ ] Send SMS OTP as alternative
- [ ] Add password strength meter
- [ ] Email notification on successful password change
- [ ] Two-factor authentication (2FA)

## Support

If you encounter issues:
1. Check console logs for errors
2. Verify email configuration
3. Test with a different email provider
4. Check database for OTP storage

## Security Best Practices

1. **Never log OTPs in production** (only for development)
2. **Use HTTPS** for all API requests
3. **Implement CAPTCHA** to prevent automated attacks
4. **Monitor suspicious activity** (multiple failed attempts)
5. **Clear expired OTPs** periodically from database
