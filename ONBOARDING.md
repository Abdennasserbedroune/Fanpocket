# Onboarding System Documentation

## Overview

The onboarding system guides new users through a two-step process to personalize their AFCON 2025 experience by selecting their favorite team.

## Features

### Step 1: Welcome

- Introduces users to the platform
- Shows key features (Live Updates, Team Stats, Tournament Info)
- Simple "Continue" button to proceed

### Step 2: Team Selection

- 4x6 grid displaying all 24 tournament teams
- Search/filter functionality by team name
- Keyboard navigation support (Arrow keys, Enter, Space)
- Visual feedback with team color accents
- Selected team displayed with flag and color theme

## User Flow

### New Users

1. User registers → Profile created with `onboardingComplete: false`
2. Redirected to `/onboarding.html`
3. Completes steps 1 and 2
4. Profile updated: `favoriteTeam` set, `onboardingComplete: true`
5. Redirected to `/dashboard.html`

### Returning Users

1. User logs in
2. System checks `onboardingComplete` status
3. If `true`: Direct to dashboard
4. If `false`: Redirect to onboarding

## Technical Implementation

### Files

- `/public/onboarding.html` - Onboarding page UI
- `/src/js/pages/onboarding.js` - Onboarding logic
- `/src/css/main.css` - Onboarding styles (lines 1188-1414)

### Key Functions

```javascript
checkOnboardingStatus(); // Checks if user has completed onboarding
loadTeams(); // Loads teams from Firestore
renderTeamsGrid(); // Displays team cards
setupKeyboardNavigation(); // Enables arrow key navigation
completeOnboarding(); // Saves selection and marks complete
```

### Data Structure

**Profile Document** (`profiles/{userId}`):

```javascript
{
  userId: string,
  displayName: string,
  favoriteTeam: string, // team-001, team-002, etc.
  onboardingComplete: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Team Document** (`teams/{teamId}`):

```javascript
{
  id: string,
  name: string,
  code: string, // ISO 3166-1 alpha-3
  group: string,
  colors: {
    primary: string,
    secondary: string
  },
  stats: { ... },
  ranking: number,
  flagPath: string
}
```

## Seeding Teams Data

### Option 1: Web Interface

1. Navigate to `/seed-teams.html`
2. Click "Import Teams to Firestore"
3. Confirms 24 teams imported

### Option 2: Auto-seed with URL Parameter

1. Navigate to `/seed-teams.html?seed=true`
2. Teams automatically imported on page load

### Data Source

Teams are loaded from `/data/teams_stats.json` which contains all 24 AFCON 2025 teams with:

- Team information (name, code, group)
- Team colors (primary, secondary)
- Statistics (matches, goals, points)
- Rankings

## Keyboard Navigation

The team grid supports full keyboard navigation:

- **Arrow Right**: Move to next team
- **Arrow Left**: Move to previous team
- **Arrow Down**: Move down one row (6 teams on desktop)
- **Arrow Up**: Move up one row
- **Enter/Space**: Select focused team
- **Tab**: Navigate through interactive elements

## Responsive Design

### Mobile (< 480px)

- 2 columns grid
- Compact team cards
- Touch-optimized

### Tablet (480px - 768px)

- 3 columns grid
- Medium team cards

### Desktop (768px - 1024px)

- 4 columns grid
- Larger team cards
- Better keyboard navigation

### Large Desktop (1024px+)

- 6 columns grid (4x6 = 24 teams)
- Full team card size

## Team Colors

When a team is selected:

- Border color matches team primary color
- Background uses team color at 10% opacity
- Complete button uses team primary color
- Creates personalized experience

## Skip Option

Users can skip onboarding by clicking "Skip for now" which:

- Redirects to dashboard
- Keeps `onboardingComplete: false`
- Will see onboarding again on next login
- Can complete later through profile settings (future feature)

## Future Enhancements

- Add actual SVG flag files (currently using emoji)
- Ability to change favorite team from profile
- Add more onboarding steps (notifications, interests)
- Team-specific dashboard themes
- Follow multiple teams
