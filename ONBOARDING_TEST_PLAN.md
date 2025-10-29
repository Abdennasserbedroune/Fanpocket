# Onboarding Test Plan

## Pre-requisites

1. Firebase project configured with Auth and Firestore
2. Teams seeded in Firestore (use `/seed-teams.html?seed=true`)
3. Application running locally or deployed

## Test Scenarios

### 1. Seed Teams Data

**Objective**: Verify teams can be imported to Firestore

**Steps**:
1. Navigate to `/seed-teams.html`
2. Click "Import Teams to Firestore" button
3. Wait for import to complete

**Expected Result**:
- Success message: "✅ Successfully imported 24 teams!"
- Console shows: "Teams in Firestore: 24"
- Firestore `teams` collection contains 24 documents

**Alternate**: Use `/seed-teams.html?seed=true` for automatic import

---

### 2. New User Registration + Onboarding

**Objective**: Verify new users are directed through onboarding

**Steps**:
1. Navigate to `/register.html`
2. Create account with:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
3. Submit registration

**Expected Result**:
- User account created
- Redirected to `/onboarding.html`
- Step 1/2 (Welcome) is displayed
- Stepper shows step 1 active

---

### 3. Onboarding Step Navigation

**Objective**: Verify stepper navigation works

**Steps**:
1. On onboarding page (Step 1)
2. Click "Continue →" button

**Expected Result**:
- Step 2/2 (Team Selection) is displayed
- Stepper shows step 2 active, step 1 completed (with ✓)
- Teams grid loads with 24 teams
- Search box is visible

**Steps** (continued):
3. Click "← Back" button

**Expected Result**:
- Returns to Step 1/2 (Welcome)
- Stepper shows step 1 active again

---

### 4. Team Search/Filter

**Objective**: Verify search functionality

**Steps**:
1. Navigate to Step 2 (Team Selection)
2. Type "Mor" in search box

**Expected Result**:
- Grid updates to show only "Morocco"

**Steps** (continued):
3. Clear search box
4. Type "Nigeria"

**Expected Result**:
- Grid shows only "Nigeria"

**Steps** (continued):
5. Clear search box

**Expected Result**:
- All 24 teams displayed again

---

### 5. Team Selection - Mouse

**Objective**: Verify team selection with mouse

**Steps**:
1. Navigate to Step 2 (Team Selection)
2. Click on "Morocco" team card

**Expected Result**:
- Morocco card highlighted with border
- Selected team info shows: 🇲🇦 Morocco
- "Complete Setup" button enabled
- Button color changes to Morocco's team color (red)

**Steps** (continued):
3. Click on "Senegal" team card

**Expected Result**:
- Morocco card deselected
- Senegal card selected
- Selected team info shows: 🇸🇳 Senegal
- Button color changes to Senegal's team color (green)

---

### 6. Team Selection - Keyboard

**Objective**: Verify keyboard navigation works

**Steps**:
1. Navigate to Step 2 (Team Selection)
2. Click on first team to focus
3. Press Arrow Right key

**Expected Result**:
- Focus moves to next team
- Outline visible on focused team

**Steps** (continued):
4. Press Arrow Down key

**Expected Result**:
- Focus moves down one row (6 teams on desktop)

**Steps** (continued):
5. Press Enter or Space key

**Expected Result**:
- Focused team is selected
- Same visual feedback as mouse click

---

### 7. Complete Onboarding

**Objective**: Verify onboarding completion flow

**Steps**:
1. Navigate to Step 2 (Team Selection)
2. Select any team (e.g., "Egypt")
3. Click "Complete Setup" button

**Expected Result**:
- Button shows "Saving..." briefly
- Profile updated in Firestore:
  - `favoriteTeam`: "team-003" (Egypt's ID)
  - `onboardingComplete`: true
- Redirected to `/dashboard.html`

---

### 8. Returning User - Login

**Objective**: Verify returning users skip onboarding

**Steps**:
1. Logout from dashboard
2. Navigate to `/login.html`
3. Login with the same account

**Expected Result**:
- User logged in successfully
- Redirected directly to `/dashboard.html`
- NOT redirected to onboarding

---

### 9. Skip Onboarding

**Objective**: Verify skip functionality

**Steps**:
1. Logout and create new account
2. On onboarding Step 2, click "Skip for now"

**Expected Result**:
- Redirected to `/dashboard.html`
- Profile `onboardingComplete` remains false

**Steps** (continued):
3. Logout and login again

**Expected Result**:
- Redirected to `/onboarding.html` again
- Can complete or skip again

---

### 10. Mobile Responsiveness

**Objective**: Verify onboarding works on mobile

**Steps**:
1. Open browser DevTools
2. Switch to mobile view (375px width)
3. Navigate through onboarding

**Expected Result**:
- Step 1: Features display vertically, readable
- Step 2: Teams grid shows 2 columns
- Touch interactions work
- Search box is usable
- Buttons are tap-friendly

---

### 11. Tablet Responsiveness

**Objective**: Verify layout on tablet

**Steps**:
1. Set viewport to 768px width
2. Navigate to Step 2

**Expected Result**:
- Teams grid shows 4 columns
- Layout is balanced
- Team cards have appropriate size

---

### 12. Desktop Experience

**Objective**: Verify full desktop layout

**Steps**:
1. Set viewport to 1920px width
2. Navigate to Step 2

**Expected Result**:
- Teams grid shows 6 columns (4 rows × 6 columns = 24 teams)
- All teams visible without scrolling (or minimal scrolling)
- Keyboard navigation with arrow keys works smoothly

---

## Edge Cases

### 13. No Teams in Firestore

**Steps**:
1. Clear teams collection in Firestore
2. Navigate to onboarding Step 2

**Expected Result**:
- Error message: "Failed to load teams. Please try again."
- OR: Empty state message

---

### 14. Network Error During Save

**Steps**:
1. Enable network throttling/offline mode
2. Select team and click "Complete Setup"

**Expected Result**:
- Alert: "Failed to save your selection. Please try again."
- Button returns to "Complete Setup"
- User remains on onboarding page

---

### 15. Direct Access to Dashboard (Not Onboarded)

**Steps**:
1. Create new account (onboardingComplete: false)
2. Manually navigate to `/dashboard.html`

**Expected Result**:
- Immediately redirected to `/onboarding.html`
- Cannot bypass onboarding

---

## Performance Tests

### 16. Team Grid Rendering

**Objective**: Verify 24 teams render quickly

**Steps**:
1. Navigate to Step 2
2. Observe loading time

**Expected Result**:
- Teams grid appears in < 1 second
- No layout shift during load
- Smooth transitions

---

### 17. Search Performance

**Objective**: Verify search is responsive

**Steps**:
1. Navigate to Step 2
2. Type quickly in search box

**Expected Result**:
- Grid updates in real-time
- No lag or freezing
- Smooth filtering

---

## Accessibility Tests

### 18. Keyboard-Only Navigation

**Steps**:
1. Use only Tab, Arrow keys, Enter, Space
2. Navigate through entire onboarding

**Expected Result**:
- All interactive elements reachable
- Visual focus indicators present
- Can complete without mouse

---

### 19. Screen Reader Support

**Steps**:
1. Enable screen reader (NVDA/JAWS/VoiceOver)
2. Navigate onboarding

**Expected Result**:
- Stepper announces current step
- Team cards have aria-labels
- Buttons have descriptive text

---

## Browser Compatibility

Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

All tests should pass on all browsers.
