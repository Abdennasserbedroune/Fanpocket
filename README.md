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
- `npm run seed` - Seed the database with sample data
- `npm run docker:up` - Start Docker services (MongoDB)
- `npm run docker:down` - Stop Docker services

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

## License

See LICENSE file for details.
