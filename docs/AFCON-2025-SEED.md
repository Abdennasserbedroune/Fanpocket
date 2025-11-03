# AFCON 2025 Database Seed Implementation

## Overview

This document describes the MongoDB models and seed scripts implemented for the AFCON 2025 tournament data.

## Models

### User Model

**Location:** `server/src/models/User.ts`

Fields:

- `email` (unique, required) - User email address
- `username` (unique, required) - Username
- `password` (required) - Hashed password
- `displayName` (required) - Display name
- `avatar` (optional) - Avatar URL
- `favoriteTeams[]` - Array of ObjectId references to Team
- `favoriteStadiums[]` - Array of ObjectId references to Stadium
- `notificationPreferences` - Match reminders, team news, stadium events
- `locale` - Language preference (en, fr, ar)
- `fcmTokens[]` - Firebase Cloud Messaging tokens for push notifications

Indexes:

- `email` (unique)
- `username` (unique)

### Team Model

**Location:** `server/src/models/Team.ts`

Fields:

- `name`, `nameAr`, `nameFr` - Team names in multiple languages
- `slug` (unique, required) - URL-friendly identifier
- `shortCode` (unique, required) - 3-letter country code (e.g., MAR, EGY)
- `flag` (required) - Flag image URL
- `logo` (required) - Logo image URL
- `group` - Tournament group (A, B, C, D, E, F)
- `city`, `cityAr`, `cityFr` - City names
- `stadium` - ObjectId reference to home Stadium
- `founded` - Year founded
- `colors` - Primary and secondary colors
- `league` - League/confederation (e.g., CAF)
- `description`, `descriptionAr`, `descriptionFr` - Team descriptions
- `website` - Official website URL
- `socialMedia` - Facebook, Twitter, Instagram handles
- `stats` - Tournament statistics (wins, draws, losses, goals for/against)
- `squad[]` - Array of player objects (number, name, position, age, club)

Indexes:

- `slug` (unique)
- `shortCode` (unique)
- `group`
- `city`

### Stadium Model

**Location:** `server/src/models/Stadium.ts`

Fields:

- `name`, `nameAr`, `nameFr` - Stadium names
- `slug` (unique, required) - URL-friendly identifier
- `shortName` (required) - Short display name
- `city`, `cityAr`, `cityFr` - City names
- `location` (required) - GeoJSON Point with [longitude, latitude]
- `address`, `addressAr`, `addressFr` - Full addresses
- `capacity` (required) - Seating capacity
- `opened` - Year opened
- `surface` - Playing surface type
- `homeTeams[]` - Array of ObjectId references to Team
- `images[]` - Array of image URLs
- `description`, `descriptionAr`, `descriptionFr` - Descriptions
- `facilities[]` - Array of facility names
- `accessibility` - Parking, public transport, wheelchair access
- `transport[]` - Transport options with multilingual descriptions
- `nearbyAttractions[]` - Nearby attractions with distance in km
- `contactInfo` - Phone, email, website

Indexes:

- `location` (2dsphere) - For geospatial queries
- `slug` (unique)
- `city`

### Match Model

**Location:** `server/src/models/Match.ts`

Fields:

- `matchNumber` (unique, required) - Sequential match number
- `homeTeam` (required) - ObjectId reference to Team
- `awayTeam` (required) - ObjectId reference to Team
- `stadium` (required) - ObjectId reference to Stadium
- `competition` (required) - Tournament name (e.g., "AFCON 2025")
- `stage` (required) - Match stage (group, r16, quarter, semi, final)
- `group` - Group letter (A-F) for group stage matches
- `dateTime` (required) - Match date and time
- `status` - Match status (scheduled, live, finished, postponed, cancelled)
- `score` - Home/away scores with optional half-time scores
- `attendance` - Number of attendees
- `ticketInfo` - Ticket availability, URL, price range
- `broadcast` - TV and streaming channels
- `weather` - Weather conditions and temperature
- `events[]` - Match events (goals, cards, substitutions)

Indexes:

- `matchNumber` (unique)
- `(dateTime, stadium)` (compound)
- `status`
- `stage`
- `group`
- `(homeTeam, awayTeam)` (compound)

### Notification Model

**Location:** `server/src/models/Notification.ts`

Fields:

- `type` (required) - Notification type
- `payload` (required) - Notification data (flexible schema)
- `createdAt` - Timestamp (auto-generated)

Indexes:

- `type`
- `createdAt` (descending)

## Seed Data

### Stadiums (9 total)

Across 6 Moroccan host cities:

1. **Stade de Tanger** - Tangier (65,000 capacity)
2. **Stade Prince Moulay Abdellah** - Rabat (52,000)
3. **Stade Mohammed V** - Casablanca (45,891)
4. **Stade Adrar** - Agadir (45,480)
5. **Stade de Marrakech** - Marrakech (45,240)
6. **Stade de Fès** - Fès (45,000)
7. **Stade Municipal de Meknès** - Meknès (30,000)
8. **Stade Municipal d'Oujda** - Oujda (28,000)
9. **Grand Stade de Tétouan** - Tétouan (11,000)

All stadiums include:

- Precise GeoJSON coordinates for mapping
- Multi-language names and descriptions
- Transport options and nearby attractions
- Facilities and accessibility information

### Teams (24 total)

Divided into 6 groups of 4 teams each:

**Group A:** Morocco (MAR), Egypt (EGY), Ghana (GHA), Tanzania (TAN)  
**Group B:** Senegal (SEN), Algeria (ALG), Burkina Faso (BFA), South Africa (RSA)  
**Group C:** Nigeria (NGA), Ivory Coast (CIV), Cameroon (CMR), Zimbabwe (ZIM)  
**Group D:** Tunisia (TUN), Mali (MLI), Uganda (UGA), Zambia (ZAM)  
**Group E:** DR Congo (COD), Guinea (GUI), Mozambique (MOZ), Benin (BEN)  
**Group F:** Angola (ANG), Mauritania (MTN), Botswana (BOT), Comoros (COM)

Each team includes:

- Multi-language names
- National flag URLs from flagcdn.com
- Team colors
- Group assignment
- Stats structure for tournament tracking

### Matches (36 group stage matches)

Complete group stage schedule with:

- All 6 matches per group (36 total)
- Proper round-robin scheduling
- Stadium rotation across all venues
- Placeholder dates starting from December 21, 2025
- Status set to "scheduled"

Match generation algorithm:

- Round 1: Team 1 vs Team 2, Team 3 vs Team 4
- Round 2: Team 1 vs Team 3, Team 2 vs Team 4
- Round 3: Team 4 vs Team 1, Team 2 vs Team 3

## Seed Scripts

### seedAfcon.ts

**Location:** `server/src/scripts/seedAfcon.ts`

Main seeding script that:

1. Connects to MongoDB
2. Clears existing data (Stadium, Team, Match collections)
3. Seeds 9 stadiums with full data
4. Seeds 24 teams with group assignments
5. Generates and seeds 36 group stage matches
6. Closes connection

Features:

- Deterministic seeding (consistent results)
- Idempotent (can be run multiple times)
- Progress logging with emojis
- Automatic ObjectId references

### clearDb.ts

**Location:** `server/src/scripts/clearDb.ts`

Utility script to clear all collections:

- Stadium
- Team
- Match
- User
- Notification

### NPM Scripts

Added to `server/package.json`:

```json
{
  "seed": "ts-node-dev --transpile-only src/scripts/seedAfcon.ts",
  "seed:clear": "ts-node-dev --transpile-only src/scripts/clearDb.ts",
  "db:reset": "npm run seed:clear && npm run seed"
}
```

## API Endpoints

### GET /api/stadiums

Lists all stadiums sorted by capacity (descending).

Response includes:

- Stadium details with selected fields
- Populated homeTeams (name, logo, etc.)
- Location coordinates for mapping

### GET /api/stadiums/:slug

Returns full details for a specific stadium.

### GET /api/teams

Lists all teams sorted by group and name.

Query parameters:

- `group` - Filter by group (A, B, C, D, E, F)

Response includes:

- Team details with stats
- Flag and logo URLs
- Group assignment

### GET /api/teams/:slug

Returns full details for a specific team including stadium.

### GET /api/matches

Lists all matches sorted by dateTime.

Query parameters:

- `stage` - Filter by stage (group, r16, quarter, semi, final)
- `group` - Filter by group (A-F)
- `status` - Filter by status (scheduled, live, finished, etc.)

Response includes:

- Populated homeTeam and awayTeam with names, flags, logos
- Populated stadium with name, city, location
- Match details and ticket info

### GET /api/matches/:id

Returns full details for a specific match.

## TypeScript Types

Updated shared types in `shared/src/types/`:

- **user.ts** - Added `fcmTokens: string[]`
- **team.ts** - Added `shortCode`, `flag`, `group`, `stats`, `squad`
- **stadium.ts** - Added `shortName`, `transport`, `nearbyAttractions`
- **match.ts** - Added `matchNumber`, `stage`, `group`, `events`
- **notification.ts** - New file with Notification types

All types include proper TypeScript interfaces matching the Mongoose schemas.

## Verification

To verify the implementation:

```bash
# Start MongoDB
npm run docker:up

# Seed the database
cd server && npm run seed

# Verify in MongoDB shell
docker exec -it fanpocket-mongodb mongosh -u admin -p admin123 --authenticationDatabase admin fanpocket

# Check collections
db.stadia.countDocuments()    # Should return 9
db.teams.countDocuments()     # Should return 24
db.matches.countDocuments()   # Should return 36

# Check indexes
db.stadia.getIndexes()        # Should include 2dsphere on location
db.teams.getIndexes()         # Should include indexes on slug, shortCode, group
db.matches.getIndexes()       # Should include compound index on (dateTime, stadium)

# Test API endpoints
curl http://localhost:5000/api/stadiums
curl http://localhost:5000/api/teams?group=A
curl http://localhost:5000/api/matches?stage=group&group=A
```

## Notes

- All seed scripts use TypeScript with ts-node-dev for development
- Connection string loaded from .env (MONGODB_URI)
- Indexes created automatically by Mongoose on first insert
- 2dsphere index enables geospatial queries (e.g., "find stadiums near me")
- Multi-language support (en, fr, ar) throughout all data
- Flag URLs use flagcdn.com CDN for reliable country flags
- Match dates are placeholder values starting from December 21, 2025
- Idempotent seeding allows safe re-runs without data duplication
