# Firebase Setup Guide

This document provides instructions for setting up Firebase for the AFCON 2025 Marrakech MVP.

## Prerequisites

- A Google account
- Access to the [Firebase Console](https://console.firebase.google.com/)

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Enter a project name (e.g., "afcon-2025-marrakech")
4. Accept the terms and click "Continue"
5. Disable Google Analytics (optional for MVP) or configure it
6. Click "Create project"

## Step 2: Register Your Web App

1. In the Firebase Console, click the web icon (`</>`) to add a web app
2. Enter an app nickname (e.g., "AFCON 2025 Web App")
3. Do NOT check "Also set up Firebase Hosting" (we're using Vercel/Netlify)
4. Click "Register app"
5. Copy the Firebase configuration object - you'll need these values

## Step 3: Enable Authentication

1. In the Firebase Console, navigate to **Build > Authentication**
2. Click "Get started"
3. Enable **Email/Password** sign-in method:
   - Click "Email/Password"
   - Toggle "Enable"
   - Click "Save"
4. Enable **Google** sign-in method:
   - Click "Google"
   - Toggle "Enable"
   - Select a support email
   - Click "Save"

## Step 4: Create Firestore Database

1. In the Firebase Console, navigate to **Build > Firestore Database**
2. Click "Create database"
3. Select "Start in production mode" (we'll add security rules next)
4. Choose a Cloud Firestore location (select closest to your users)
5. Click "Enable"

## Step 5: Deploy Security Rules

1. In Firestore Database, go to the "Rules" tab
2. Copy the contents of `firestore.rules` from this repository
3. Paste them into the Firebase Console rules editor
4. Click "Publish"

The rules ensure:

- Users can only read/write their own user documents
- Users can only read/write their own profile documents
- Teams collection is readable by everyone, writable only by admins
- All other collections are denied by default

## Step 6: Configure Environment Variables

### For Local Development

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase configuration values in `.env`:

   ```env
   VITE_FIREBASE_API_KEY=your-api-key-here
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

3. You'll need to manually replace the placeholders in `src/js/config.js` with your actual values for local testing, or use a build tool to inject them.

### For Vercel Deployment

1. Go to your Vercel project dashboard
2. Navigate to **Settings > Environment Variables**
3. Add each environment variable:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
4. Set each variable's value from your Firebase config
5. Choose which environments to apply them to (Production, Preview, Development)
6. Save and redeploy

### For Netlify Deployment

1. Go to your Netlify site dashboard
2. Navigate to **Site settings > Environment variables**
3. Click "Add a variable"
4. Add each environment variable with its value:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
5. Save and redeploy

### Environment Variable Injection

The app uses `src/js/config.js` which contains placeholders like `%%VITE_FIREBASE_API_KEY%%`.

For production deployment, you'll need to add a build step that replaces these placeholders with actual environment variables. You can use a simple build script or Vercel/Netlify's built-in environment variable injection.

Example build script (add to `package.json`):

```json
{
  "scripts": {
    "build:config": "node scripts/inject-config.js",
    "prebuild": "npm run build:config"
  }
}
```

## Step 7: Seed Initial Data (Optional)

For local development, you can seed the teams data:

1. Set `VITE_DEV_SEED_ENABLED=true` in your environment
2. Open your browser console on the site
3. Run: `window.seedTeamsData()`

**Important:** Only use this in local development! For production, use a secure backend script to seed data.

## Step 8: Test Authentication

1. Navigate to the register page (`/register.html`)
2. Create a test account with email/password
3. Try signing in with Google
4. Test password reset functionality
5. Verify that protected pages redirect to login when not authenticated

## Security Best Practices

1. **Never commit `.env` files** - they're already in `.gitignore`
2. **Use environment variables** for all sensitive configuration
3. **Review security rules** regularly as you add features
4. **Enable Firebase App Check** (optional but recommended for production)
5. **Set up Firebase Authentication email templates** in the Authentication section
6. **Monitor usage** in Firebase Console to stay within free tier limits

## Firebase Free Tier Limits

- **Authentication**: Unlimited
- **Firestore**:
  - 1 GiB storage
  - 50,000 reads/day
  - 20,000 writes/day
  - 20,000 deletes/day
- **Hosting**: 10 GB storage, 360 MB/day transfer (if used)

These limits should be sufficient for the MVP. Monitor usage in the Firebase Console.

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"

- Verify all environment variables are set correctly
- Check that the Firebase config values don't have extra quotes or spaces
- Ensure the project ID matches your Firebase project

### "Missing or insufficient permissions"

- Check that Firestore security rules are deployed correctly
- Verify the user is authenticated before accessing protected resources
- Review the rules in the Firebase Console

### "Firebase: Firebase App named '[DEFAULT]' already exists"

- This usually means Firebase is being initialized multiple times
- Check that you're not importing Firebase in multiple places
- Clear browser cache and reload

### Google Sign-In Popup Blocked

- Ensure popups are allowed for your domain
- Check that the authorized domains are configured in Firebase Console under Authentication > Settings > Authorized domains

## Support

For Firebase-specific issues, refer to:

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
- [Cloud Firestore Guide](https://firebase.google.com/docs/firestore)
