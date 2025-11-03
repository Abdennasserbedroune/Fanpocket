# Fanpocket

A Progressive Web App for Moroccan football fans to discover stadiums, track teams, follow matches, and connect with the local football culture.

## Project Structure

This is a monorepo containing:

- **client/** - Next.js 14+ PWA with TypeScript, Tailwind CSS, and shadcn/ui
- **server/** - Express.js API with TypeScript and MongoDB
- **shared/** - Shared TypeScript types and constants
- **docs/** - Project documentation

## Tech Stack

### Client

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- next-pwa for Progressive Web App functionality
- next-i18next for internationalization (en, fr, ar)
- React Leaflet for maps

### Server

- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT authentication
- Firebase Cloud Messaging for notifications

### Development Tools

- ESLint for linting
- Prettier for code formatting
- Husky for git hooks
- commitlint for commit message standards
- Docker Compose for local database

## Prerequisites

- Node.js 20.11.0 (use `nvm use` to automatically switch)
- Docker and Docker Compose
- npm or yarn

## Getting Started

### Installation

```bash
# Install dependencies for all workspaces
npm install

# Start local MongoDB with Docker Compose
npm run docker:up
```

### Development

```bash
# Run both client and server concurrently
npm run dev:all

# Or run them separately:
npm run dev:client  # Client on http://localhost:3000
npm run dev:server  # Server on http://localhost:5000
```

### Available Scripts

- `npm run dev:all` - Run client and server concurrently
- `npm run dev:client` - Run only the client
- `npm run dev:server` - Run only the server
- `npm run build` - Build all workspaces
- `npm run lint` - Lint all workspaces
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Type check all workspaces
- `npm run seed` - Seed the database with AFCON 2025 data
- `npm run docker:up` - Start Docker services (MongoDB)
- `npm run docker:down` - Stop Docker services

### Database Scripts (server/)

- `npm run seed` - Seed AFCON 2025 data (9 stadiums, 24 teams, 36+ matches)
- `npm run seed:clear` - Clear all database collections
- `npm run db:reset` - Clear database and reseed with fresh data

## Environment Variables

### Client (.env.local)

Copy `client/.env.local.example` to `client/.env.local` and configure:

- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_FIREBASE_CONFIG` - Firebase configuration
- Map tile provider keys (if needed)

### Server (.env)

Copy `server/.env.example` to `server/.env` and configure:

- `PORT` - Server port
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing
- `JWT_EXPIRE` - JWT expiration time
- `CORS_ORIGIN` - Allowed CORS origin
- Firebase Cloud Messaging credentials

## Development Workflow

1. Create a feature branch
2. Make your changes
3. Run `npm run lint` and `npm run typecheck` to ensure code quality
4. Commit with conventional commit messages (enforced by commitlint)
5. Push and create a pull request

## Code Quality

- **Pre-commit**: Runs lint-staged to format and lint changed files
- **Commit-msg**: Validates commit message format
- **Conventional Commits**: feat, fix, docs, style, refactor, test, chore, etc.

## Database

Local MongoDB runs via Docker Compose:

- MongoDB: `mongodb://admin:admin123@localhost:27017/fanpocket`
- Mongo Express UI: http://localhost:8081

### AFCON 2025 Seed Data

The database includes comprehensive AFCON 2025 tournament data:

- **9 Stadiums** across 6 Moroccan host cities (Casablanca, Rabat, Agadir, Marrakech, Fès, Tangier, Meknès, Oujda, Tétouan)
- **24 National Teams** divided into 6 groups (A-F)
- **36+ Group Stage Matches** with proper scheduling across all stadiums
- **GeoJSON coordinates** for all stadiums with 2dsphere indexes for geospatial queries
- **Multi-language support** (English, French, Arabic) for all team and stadium data

### Seeding Process

The seed scripts are idempotent and can be run multiple times:

```bash
# Navigate to server directory
cd server

# Seed database with AFCON 2025 data
npm run seed

# Clear all data
npm run seed:clear

# Reset database (clear + seed)
npm run db:reset
```

### Database Indexes

Automatically created indexes for optimal query performance:

- **Stadiums**: 2dsphere on `location`, unique on `slug`, indexed on `city`
- **Teams**: unique on `slug` and `shortCode`, indexed on `group` and `city`
- **Matches**: unique on `matchNumber`, compound index on `(dateTime, stadium)`, indexed on `status`, `stage`, `group`, and compound `(homeTeam, awayTeam)`
- **Users**: unique on `email` and `username`

### API Endpoints

Available read endpoints to verify seeded data:

- `GET /api/stadiums` - List all stadiums with populated homeTeams
- `GET /api/stadiums/:slug` - Get specific stadium details
- `GET /api/teams` - List all teams (supports `?group=A` filter)
- `GET /api/teams/:slug` - Get specific team details
- `GET /api/matches` - List all matches (supports `?stage=group&group=A&status=scheduled` filters)
- `GET /api/matches/:id` - Get specific match details

## License

See LICENSE file for details.
