# Firebase Testing Guide

This document explains how to test Firebase Authentication and Firestore security rules.

## Testing Authentication Flows

### Email/Password Registration

1. Navigate to `/register.html`
2. Fill in:
   - Full Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123" (at least 8 characters)
3. Click "Create Account"
4. Should redirect to `/onboarding.html`
5. Check Firebase Console > Authentication to see the new user

### Email/Password Login

1. Navigate to `/login.html`
2. Fill in registered credentials:
   - Email: "test@example.com"
   - Password: "password123"
3. Click "Login"
4. Should redirect to `/dashboard.html`
5. Check browser console for "Firebase initialized successfully"

### Google Sign-In

1. Navigate to `/login.html` or `/register.html`
2. Click "Sign in with Google" button
3. Select Google account in popup
4. Should redirect to `/dashboard.html` (login) or `/onboarding.html` (register)
5. Check Firebase Console > Authentication for new Google user

### Password Reset

1. Navigate to `/reset.html`
2. Enter registered email: "test@example.com"
3. Click "Send Reset Link"
4. Check email inbox for password reset link
5. Click link in email to reset password
6. Should redirect to Firebase password reset page
7. After reset, try logging in with new password

### Logout

1. While logged in, navigate to `/dashboard.html`, `/profile.html`, or `/onboarding.html`
2. Click "Logout" in navigation
3. Should redirect to `/login.html`
4. Verify auth state by checking browser console

## Testing Route Protection

### Access Protected Pages (Unauthenticated)

1. Ensure you're logged out
2. Try accessing:
   - `/dashboard.html`
   - `/profile.html`
   - `/onboarding.html`
3. Should immediately redirect to `/login.html?redirect=[page]`
4. After logging in, should redirect back to the original page

### Access Protected Pages (Authenticated)

1. Log in with any method
2. Navigate to:
   - `/dashboard.html` - Should load successfully
   - `/profile.html` - Should load successfully
   - `/onboarding.html` - Should load successfully
3. No redirects should occur

### Redirect If Already Authenticated

1. Log in to the application
2. Try accessing:
   - `/login.html`
   - `/register.html`
3. Should automatically redirect to `/dashboard.html`

## Testing Firestore Security Rules

### Using Firebase Console Rules Simulator

1. Go to Firebase Console > Firestore Database > Rules
2. Click "Rules playground"
3. Test the following scenarios:

#### Test 1: User Can Read Own User Document

```
Location: /users/{userId}
Operation: get
Authenticated: Yes
UID: user123
Expected: Allow
```

#### Test 2: User Cannot Read Other User's Document

```
Location: /users/{otherUserId}
Operation: get
Authenticated: Yes
UID: user123
Expected: Deny
```

#### Test 3: User Can Write Own User Document

```
Location: /users/{userId}
Operation: create/update
Authenticated: Yes
UID: user123
Expected: Allow
```

#### Test 4: User Can Read Own Profile

```
Location: /profiles/{userId}
Operation: get
Authenticated: Yes
UID: user123
Expected: Allow
```

#### Test 5: User Can Write Own Profile

```
Location: /profiles/{userId}
Operation: update
Authenticated: Yes
UID: user123
Expected: Allow
```

#### Test 6: Anonymous User Cannot Read Profiles

```
Location: /profiles/{userId}
Operation: get
Authenticated: No
Expected: Deny
```

#### Test 7: Anyone Can Read Teams Collection

```
Location: /teams/{teamId}
Operation: get
Authenticated: No
Expected: Allow
```

#### Test 8: Non-Admin Cannot Write Teams

```
Location: /teams/{teamId}
Operation: write
Authenticated: Yes
Admin Claim: false (or not set)
Expected: Deny
```

#### Test 9: Admin Can Write Teams (Future)

```
Location: /teams/{teamId}
Operation: write
Authenticated: Yes
Admin Claim: true
Expected: Allow
```

### Testing in Browser Console

You can test Firestore operations directly in the browser console:

#### Read Own User Document

```javascript
import {
  doc,
  getDoc,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db, auth } from './src/js/firebase.js';

const user = auth.currentUser;
const userDoc = await getDoc(doc(db, 'users', user.uid));
console.log('User document:', userDoc.data());
```

#### Read Own Profile

```javascript
import {
  doc,
  getDoc,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db, auth } from './src/js/firebase.js';

const user = auth.currentUser;
const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
console.log('Profile document:', profileDoc.data());
```

#### Read Teams Collection

```javascript
import {
  collection,
  getDocs,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db } from './src/js/firebase.js';

const teamsSnapshot = await getDocs(collection(db, 'teams'));
teamsSnapshot.forEach(doc => {
  console.log(doc.id, '=>', doc.data());
});
```

#### Try to Read Another User's Document (Should Fail)

```javascript
import {
  doc,
  getDoc,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db } from './src/js/firebase.js';

try {
  const otherUserDoc = await getDoc(doc(db, 'users', 'different-user-id'));
  console.log('Should not reach here');
} catch (error) {
  console.log('Expected error:', error.message);
}
```

## Testing Data Seeding (Dev Only)

### Seed Teams Data

1. Set environment variable: `VITE_DEV_SEED_ENABLED=true`
2. Open browser console on any page
3. Run: `window.seedTeamsData()`
4. Check console for success messages
5. Verify in Firebase Console > Firestore Database that teams collection is populated

**Important:** This should only be used in local development, not production!

## Common Issues and Solutions

### Issue: "Firebase: Error (auth/configuration-not-found)"

**Solution:**

- Verify all environment variables are set correctly
- Check `src/js/config.js` for correct placeholder replacement
- Ensure Firebase project is properly configured

### Issue: "Missing or insufficient permissions"

**Solution:**

- Verify Firestore security rules are deployed
- Check that the user is authenticated before accessing resources
- Ensure the UID matches the document ID for user/profile collections

### Issue: Google Sign-In popup blocked

**Solution:**

- Allow popups for your domain in browser settings
- Verify authorized domains in Firebase Console > Authentication > Settings
- Check that redirect URIs are correctly configured

### Issue: Password reset email not received

**Solution:**

- Check spam/junk folder
- Verify email templates in Firebase Console > Authentication > Templates
- Check Firebase Console > Authentication > Users to confirm user exists
- Verify sender email is configured correctly

### Issue: Auth state not persisting

**Solution:**

- Check browser console for errors
- Verify `onAuthStateChanged` is properly set up
- Clear browser cache and cookies
- Check that Firebase Auth is initialized before checking state

## Manual Testing Checklist

### Authentication

- [ ] Register with email/password
- [ ] Register with Google
- [ ] Login with email/password
- [ ] Login with Google
- [ ] Request password reset
- [ ] Complete password reset flow
- [ ] Logout

### Route Protection

- [ ] Access `/dashboard.html` while unauthenticated → redirects to login
- [ ] Access `/profile.html` while unauthenticated → redirects to login
- [ ] Access `/onboarding.html` while unauthenticated → redirects to login
- [ ] Access `/login.html` while authenticated → redirects to dashboard
- [ ] Access `/register.html` while authenticated → redirects to dashboard

### Firestore Security

- [ ] Read own user document (success)
- [ ] Write own user document (success)
- [ ] Read another user's document (fail)
- [ ] Write another user's document (fail)
- [ ] Read own profile (success)
- [ ] Write own profile (success)
- [ ] Read teams collection unauthenticated (success)
- [ ] Write teams collection without admin (fail)

### Data Operations

- [ ] User document created on registration
- [ ] Profile document created on registration
- [ ] Profile data persists across sessions
- [ ] Teams data is readable by all users

## Automated Testing (Future)

For CI/CD integration, consider adding:

- Jest or Vitest for unit tests
- Firebase Emulator Suite for local testing
- Cypress or Playwright for E2E tests
- Firebase Test Lab for cross-browser testing

## Support

For Firebase-specific testing issues:

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Rules Testing](https://firebase.google.com/docs/rules/unit-tests)
- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)
