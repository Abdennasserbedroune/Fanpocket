# Quick Start Guide

Get up and running with Firebase authentication in 5 minutes!

## 1. Prerequisites

- Node.js 16+ installed
- Firebase account (free tier)
- Code editor

## 2. Clone and Install

```bash
git clone <your-repo-url>
cd afcon2025-marrakech-mvp
npm install
```

## 3. Firebase Setup

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it "afcon-2025-marrakech" (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create project"

### Register Web App

1. In Firebase Console, click the web icon `</>`
2. Name your app "AFCON 2025 Web"
3. Don't enable Firebase Hosting
4. Copy the config object

### Enable Authentication

1. Go to **Build > Authentication**
2. Click "Get started"
3. Enable **Email/Password**
4. Enable **Google** (select support email)

### Create Firestore Database

1. Go to **Build > Firestore Database**
2. Click "Create database"
3. Start in **production mode**
4. Choose location closest to your users
5. Click "Enable"

### Deploy Security Rules

1. In Firestore, go to "Rules" tab
2. Copy contents from `firestore.rules` in this repo
3. Paste in Firebase Console
4. Click "Publish"

## 4. Configure Environment

### For Local Development

Option A: Manual config (quickest for testing)

1. Open `src/js/config.js`
2. Replace `%%PLACEHOLDERS%%` with your Firebase config values:

```javascript
window.ENV = {
  VITE_FIREBASE_API_KEY: 'AIza...',
  VITE_FIREBASE_AUTH_DOMAIN: 'your-project.firebaseapp.com',
  VITE_FIREBASE_PROJECT_ID: 'your-project-id',
  VITE_FIREBASE_STORAGE_BUCKET: 'your-project.appspot.com',
  VITE_FIREBASE_MESSAGING_SENDER_ID: '123456789',
  VITE_FIREBASE_APP_ID: '1:123456789:web:abc123',
  VITE_DEV_SEED_ENABLED: 'false',
  VITE_USE_EMULATOR: 'false',
};
```

Option B: Using build script

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your Firebase config values

3. Run build to inject vars:
   ```bash
   npm run build
   ```

## 5. Run Development Server

```bash
npm run dev
```

This opens `http://localhost:8080` in your browser.

## 6. Test Authentication

### Register a New User

1. Navigate to `http://localhost:8080/register.html`
2. Fill in:
   - Full Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
3. Click "Create Account"
4. You should be redirected to onboarding

### Login

1. Navigate to `http://localhost:8080/login.html`
2. Use your credentials from above
3. Click "Login"
4. You should see the dashboard

### Test Route Protection

1. While logged out, try visiting:
   - `http://localhost:8080/dashboard.html`
   - Should redirect to login
2. After logging in, visit:
   - `http://localhost:8080/dashboard.html`
   - Should load successfully

## 7. Verify in Firebase Console

1. Go to **Authentication > Users**
2. You should see your test user listed
3. Go to **Firestore Database**
4. You should see:
   - `users` collection with your user document
   - `profiles` collection with your profile document

## 8. (Optional) Seed Teams Data

Only for local development:

1. Set in `.env`:

   ```
   VITE_DEV_SEED_ENABLED=true
   ```

2. Rebuild:

   ```bash
   npm run build
   ```

3. Open browser console on any page
4. Run:

   ```javascript
   window.seedTeamsData();
   ```

5. Check Firestore - you should see `teams` collection with 8 teams

## Common Issues

### "Firebase: Error (auth/configuration-not-found)"

**Fix:** Double-check your Firebase config values in `src/js/config.js`

### "Missing or insufficient permissions"

**Fix:** Make sure you deployed the security rules to Firestore

### Google Sign-In popup blocked

**Fix:** Allow popups for localhost in your browser settings

### Page doesn't redirect after login

**Fix:** Check browser console for errors, verify Firebase is initialized

## Next Steps

- Read `FIREBASE_SETUP.md` for detailed configuration
- Read `TESTING_FIREBASE.md` for comprehensive testing guide
- Read `DEPLOYMENT.md` for production deployment instructions
- Customize the profile and onboarding flows
- Add more features!

## Need Help?

- **Firebase Docs**: https://firebase.google.com/docs
- **Firebase Auth**: https://firebase.google.com/docs/auth
- **Firestore**: https://firebase.google.com/docs/firestore

---

**You're all set!** 🎉 Start building your AFCON 2025 fan platform!
