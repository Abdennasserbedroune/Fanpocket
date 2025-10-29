# Feature: Onboarding & Team Selection

## Overview

A two-step onboarding flow that welcomes new users and allows them to select their favorite AFCON 2025 team. The selected team preference is stored in the user's profile and used throughout the application for personalization.

## Features Implemented

### 1. Teams Data Population

**File**: `/public/seed-teams.html`

- Import script to populate Firestore with 24 AFCON 2025 teams
- Can be accessed directly or with `?seed=true` for auto-import
- Reads from `/data/teams_stats.json`
- Creates documents in `teams` collection with:
  - Team information (name, code, group)
  - Colors (primary, secondary) for theming
  - Statistics and rankings
  - Flag asset paths

**Data File**: `/data/teams_stats.json`
- Contains all 24 tournament teams
- Each team has unique ID, colors, and metadata

### 2. Onboarding UI

**File**: `/public/onboarding.html`

Two-step wizard with progress indicator:

**Step 1: Welcome**
- Welcomes user to AFCON 2025
- Shows 3 key features with icons
- Simple continue button

**Step 2: Team Selection**
- Grid of 24 team cards (4×6 on desktop)
- Search/filter by team name
- Visual selection feedback
- Displays selected team with flag and color
- Complete button uses team color accent

### 3. Team Selection Grid

Features:
- **Responsive Grid**:
  - Mobile: 2 columns
  - Tablet: 3-4 columns
  - Desktop: 6 columns (4×6 = 24 teams)
  
- **Search/Filter**: Real-time filtering by team name

- **Keyboard Support**:
  - Arrow keys for navigation
  - Enter/Space to select
  - Tab for focus management
  
- **Visual Feedback**:
  - Hover effects
  - Selection highlight
  - Team color accents
  - Flag emoji display

### 4. State Management

**Profile Document** updates:
```javascript
{
  favoriteTeam: "team-001", // Selected team ID
  onboardingComplete: true,  // Marks onboarding as done
  updatedAt: serverTimestamp()
}
```

### 5. Auth Flow Integration

**Login** (`/src/js/pages/login.js`):
- Checks `onboardingComplete` status after login
- Redirects to onboarding if not complete
- Otherwise goes to dashboard

**Register** (`/src/js/pages/register.js`):
- Creates profile with `onboardingComplete: false`
- Redirects to onboarding after signup

**Dashboard** (`/src/js/pages/dashboard.js`):
- Checks onboarding status on load
- Redirects to onboarding if not complete
- Prevents access before onboarding

**Auth Guard** (`/src/js/utils/authGuard.js`):
- Enhanced to check onboarding status
- Automatic redirect logic for new users

### 6. Styling

**File**: `/src/css/main.css` (lines 1188-1414)

Includes:
- Stepper component styles
- Team grid responsive layouts
- Card hover/selection states
- Feature showcase styling
- Mobile-first responsive design
- Keyboard focus states

## Files Added/Modified

### New Files
- `/public/seed-teams.html` - Team import interface
- `/ONBOARDING.md` - Feature documentation
- `/ONBOARDING_TEST_PLAN.md` - Testing guide
- `/images/flags/README.md` - Flag assets guide
- `/FEATURE_ONBOARDING.md` - This file

### Modified Files
- `/data/teams_stats.json` - Expanded to 24 teams with colors
- `/public/onboarding.html` - Complete rewrite with new UI
- `/src/js/pages/onboarding.js` - Complete rewrite with new logic
- `/src/js/pages/login.js` - Added onboarding redirect logic
- `/src/js/pages/dashboard.js` - Added onboarding check
- `/src/js/utils/authGuard.js` - Enhanced with onboarding logic
- `/src/css/main.css` - Added onboarding styles
- `/firestore.rules` - Enabled authenticated writes to teams

## Usage Instructions

### For Developers

1. **Setup Teams Data**:
   ```bash
   # Make sure you're logged in to the app
   # Navigate to /seed-teams.html?seed=true
   # Or click the import button manually
   ```

2. **Test Onboarding**:
   ```bash
   # Create a new user account
   # You'll automatically be redirected to onboarding
   # Complete steps 1 and 2
   # Verify redirect to dashboard
   ```

3. **Build Assets**:
   ```bash
   npm run build:css  # Build CSS
   npm run build:copy # Copy to public
   ```

### For Users

1. Register for an account
2. Complete welcome screen (Step 1)
3. Search and select your favorite team (Step 2)
4. Click "Complete Setup"
5. Enjoy personalized experience

## Technical Details

### Team Data Structure

```javascript
{
  id: "team-001",
  name: "Morocco",
  code: "MAR",
  group: "A",
  colors: {
    primary: "#C1272D",
    secondary: "#006233"
  },
  stats: {
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0
  },
  form: [],
  ranking: 1,
  flagPath: "/images/flags/mar.svg"
}
```

### Component Architecture

```
onboarding.html
├── Stepper Component
│   ├── Step 1 Indicator
│   ├── Progress Line
│   └── Step 2 Indicator
├── Step 1: Welcome
│   ├── Feature List
│   └── Continue Button
└── Step 2: Team Selection
    ├── Search Input
    ├── Teams Grid (24 cards)
    ├── Selected Team Display
    └── Action Buttons
```

### State Flow

```
Register → Profile Created (onboardingComplete: false)
    ↓
Login → Check onboardingComplete
    ↓
false → Redirect to /onboarding.html
    ↓
Step 1 (Welcome) → Step 2 (Team Selection)
    ↓
Select Team → Update Profile
    ↓
favoriteTeam saved, onboardingComplete: true
    ↓
Redirect to /dashboard.html
```

## Acceptance Criteria Status

✅ Running the import creates 24 team docs with expected fields
✅ New user logs in, sees onboarding, selects team, profile updates and redirects
✅ Returning user logs in, bypasses onboarding
✅ All interactions work on mobile and desktop with keyboard support

## Future Enhancements

1. **SVG Flags**: Replace emoji with actual SVG flag files
2. **Change Team**: Allow users to change favorite team from profile
3. **Multiple Teams**: Support following multiple teams
4. **Team Themes**: Apply team colors throughout the app
5. **Onboarding Skip Recovery**: Add profile setting to complete later
6. **Additional Steps**: Add more personalization options
7. **Analytics**: Track team selection statistics
8. **Social Sharing**: Share favorite team on social media

## Testing

See `ONBOARDING_TEST_PLAN.md` for comprehensive test scenarios.

Quick smoke test:
1. Seed teams: `/seed-teams.html?seed=true`
2. Register new user
3. Complete onboarding
4. Verify in Firestore: profile has `favoriteTeam` and `onboardingComplete: true`
5. Logout and login again
6. Verify direct access to dashboard (no onboarding)

## Known Issues

None currently. Flag emojis may not render consistently across all platforms (future enhancement to use SVG).

## Support

For issues or questions:
- Check `ONBOARDING.md` for detailed documentation
- See `ONBOARDING_TEST_PLAN.md` for test cases
- Review Firestore rules in `firestore.rules`
- Check console logs for debugging information
