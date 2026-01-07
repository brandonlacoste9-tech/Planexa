# Planexo Pre-Launch Checklist

Quick reference checklist before selling Planexo.

---

## 🔴 Critical (Must Have Before Launch)

- [ ] **Stripe Payment Integration**
  - [ ] Install Stripe package
  - [ ] Create checkout sessions
  - [ ] Webhook handler for events
  - [ ] Subscription management
  - [ ] Connect to pricing plans

- [ ] **User Authentication**
  - [ ] Sign up page
  - [ ] Login page
  - [ ] Password reset
  - [ ] JWT token management
  - [ ] Protected routes

- [ ] **User Dashboard**
  - [ ] Post-setup landing page
  - [ ] Overview stats
  - [ ] Recent bookings
  - [ ] Quick actions

- [ ] **Finish Component**
  - [ ] Complete setup flow
  - [ ] Success message
  - [ ] Redirect to dashboard

- [ ] **Database Decision**
  - [ ] Confirm PostgreSQL or MongoDB
  - [ ] Update README
  - [ ] Migrate if needed

---

## 🟡 Important (Should Have Soon)

- [ ] **Email Integration Backend**
  - [ ] Google OAuth callback
  - [ ] Microsoft OAuth callback
  - [ ] Email sending API
  - [ ] Email reading API

- [ ] **Calendar Integration Backend**
  - [ ] Google Calendar sync
  - [ ] Microsoft Calendar sync
  - [ ] Availability sync
  - [ ] Conflict detection

- [ ] **User Settings**
  - [ ] Profile management
  - [ ] Preferences
  - [ ] Connected accounts
  - [ ] Billing settings

- [ ] **Billing Page**
  - [ ] Current plan display
  - [ ] Upgrade/downgrade
  - [ ] Payment method
  - [ ] Invoice history

---

## 🟢 Nice to Have (Later)

- [ ] **Admin Dashboard**
- [ ] **API Documentation**
- [ ] **Error Tracking (Sentry)**
- [ ] **Analytics (Google Analytics)**
- [ ] **Performance Monitoring**
- [ ] **Automated Testing**
- [ ] **CI/CD Pipeline**

---

## 🧹 Cleanup Tasks

- [ ] Remove legacy `app/` directory (old Next.js)
- [ ] Remove old `components/` in root
- [ ] Clean up test files
- [ ] Update README with correct info
- [ ] Create `.env.example` with all variables
- [ ] Add API documentation

---

## ✅ Already Complete

- [x] Landing page
- [x] Setup assistant (7/8 steps)
- [x] Quebec geofencing
- [x] SMS AI assistant
- [x] Deployment infrastructure
- [x] Theme system
- [x] Responsive design
- [x] French localization

---

**Current Status:** ~70% complete  
**Estimated Time to Launch:** 10-14 days of focused work
