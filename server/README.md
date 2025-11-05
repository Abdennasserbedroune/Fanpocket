# Fanpocket Server

Express.js API server for Fanpocket application with JWT authentication, MongoDB integration, and comprehensive security features.

## Features

- 🔐 **JWT Authentication** with refresh tokens and httpOnly cookies
- 🛡️ **Security**: Rate limiting, CORS, Helmet, CSRF protection
- 📊 **MongoDB** with Mongoose ODM
- 🚀 **TypeScript** with full type safety
- 🧪 **Comprehensive testing** with Jest and Supertest
- 🌐 **Multi-language support** (en, fr, ar)

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running on port 27017
- Docker (for MongoDB setup)

### Installation

1. Clone the repository and navigate to the server directory:
```bash
cd server
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://admin:admin123@localhost:27017/fanpocket?authSource=admin

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Cookie Configuration
COOKIE_SECURE=false

# CORS
CORS_ORIGIN=http://localhost:3000
```

4. Start MongoDB using Docker:
```bash
npm run docker:up
```

5. Run the development server:
```bash
npm run dev
```

## Authentication Flow

### Overview

The server implements a secure JWT-based authentication system with the following characteristics:

- **Access Tokens**: Short-lived (15 minutes) for API requests
- **Refresh Tokens**: Long-lived (7 days) for token rotation
- **HttpOnly Cookies**: Prevent XSS attacks
- **Token Rotation**: Prevents refresh token reuse attacks
- **Rate Limiting**: 5 requests per minute for auth endpoints
- **CSRF Protection**: Double-submit token pattern

### Authentication Flow Diagram

```
┌─────────┐    POST /api/auth/register     ┌─────────────┐
│ Client  │ ───────────────────────────────► │   Server    │
└─────────┐                                 └─────────────┘
      ▲                                               │
      │                                               ▼
      │                                     ┌─────────────────┐
      │                                     │ Create User      │
      │                                     │ Hash Password    │
      │                                     │ Generate Tokens  │
      │                                     └─────────────────┘
      │                                               │
      │                                               ▼
      │                                   Set HttpOnly Cookies
      │                                               │
      │                                               ▼
┌─────────┐    201 Created + User Data      ┌─────────────┐
│ Client  │ ◄─────────────────────────────── │   Server    │
└─────────┐                                 └─────────────┘

┌─────────┐    POST /api/auth/login         ┌─────────────┐
│ Client  │ ───────────────────────────────► │   Server    │
└─────────┘                                 └─────────────┘
      ▲                                               │
      │                                               ▼
      │                                     ┌─────────────────┐
      │                                     │ Validate User   │
      │                                     │ Check Password  │
      │                                     │ Generate Tokens │
      │                                     │ Store Refresh   │
      │                                     └─────────────────┘
      │                                               │
      │                                               ▼
      │                                   Set HttpOnly Cookies
      │                                               │
      │                                               ▼
┌─────────┐    200 OK + User Data          ┌─────────────┐
│ Client  │ ◄─────────────────────────────── │   Server    │
└─────────┘                                 └─────────────┘

┌─────────┐    POST /api/auth/refresh       ┌─────────────┐
│ Client  │ ───────────────────────────────► │   Server    │
└─────────┐                                 └─────────────┘
      ▲                                               │
      │                                               ▼
      │                                     ┌─────────────────┐
      │                                     │ Verify Refresh  │
      │                                     │ Rotate Token    │
      │                                     │ Generate New    │
      │                                     └─────────────────┘
      │                                               │
      │                                               ▼
      │                                   Set New HttpOnly Cookies
      │                                               │
      │                                               ▼
┌─────────┐    200 OK + User Data          ┌─────────────┐
│ Client  │ ◄─────────────────────────────── │   Server    │
└─────────┘                                 └─────────────┘
```

## API Endpoints

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "username": "username",
  "displayName": "Display Name"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

#### Refresh Token
```http
POST /api/auth/refresh
Cookie: refresh-token=<refresh_token>
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <access_token>
Cookie: refresh-token=<refresh_token>
```

### Protected Routes

#### Basic Protected Route
```http
GET /api/protected
Authorization: Bearer <access_token>
```

#### Admin Protected Route
```http
GET /api/protected/admin
Authorization: Bearer <access_token>
```

### Health Check

#### Server Health
```http
GET /api/health
```

## Security Features

### Rate Limiting

- **General Limiting**: 100 requests per 15 minutes per IP
- **Auth Limiting**: 5 requests per 15 minutes per IP for auth endpoints

### CSRF Protection

- CSRF tokens are automatically generated for GET requests
- State-changing requests (POST, PUT, DELETE, PATCH) require:
  - `csrf-token` cookie
  - `X-CSRF-Token` header with matching value

### Token Security

- Access tokens: 15 minutes expiration
- Refresh tokens: 7 days expiration
- Token rotation prevents replay attacks
- Refresh tokens are stored hashed in the database
- HttpOnly cookies prevent XSS access

### Password Security

- Passwords are hashed using bcrypt with 12 rounds
- Timing attack protection on login failures
- Password minimum length: 6 characters

## Testing

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Test Structure

- **Unit Tests**: Individual function and component testing
- **Integration Tests**: Full API endpoint testing
- **Auth Flow Tests**: Complete authentication scenarios
- **Security Tests**: Token rotation, CSRF, rate limiting

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 5000 | No |
| `NODE_ENV` | Environment mode | development | No |
| `MONGODB_URI` | MongoDB connection string | - | Yes |
| `JWT_SECRET` | JWT access token secret | - | Yes |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | - | Yes |
| `JWT_EXPIRE` | Access token expiration | 15m | No |
| `JWT_REFRESH_EXPIRE` | Refresh token expiration | 7d | No |
| `COOKIE_SECURE` | Enable secure cookies in production | false | No |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:3000 | No |

## Development Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run typecheck

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Seed database with sample data
npm run seed
```

## Docker Commands

```bash
# Start MongoDB and Mongo Express
npm run docker:up

# Stop Docker services
npm run docker:down
```

## Error Handling

The server implements centralized error handling with:

- Consistent error response format
- Error logging with request context
- Development vs production error details
- Custom ApiError interface for typed errors

## Database Models

### User Model
```typescript
{
  email: string;           // Unique, lowercase
  username: string;        // Unique
  password: string;        // Hashed, not returned in queries
  displayName: string;
  avatar?: string;
  favoriteTeams: ObjectId[];
  favoriteStadiums: ObjectId[];
  refreshTokens: {
    token: string;         // Hashed refresh token
    createdAt: Date;
    userAgent?: string;
    ip?: string;
  }[];
  notificationPreferences: {
    matchReminders: boolean;
    teamNews: boolean;
    stadiumEvents: boolean;
  };
  locale: 'en' | 'fr' | 'ar';
}
```

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Update documentation for API changes
4. Use conventional commits for commit messages
5. Run tests and type checking before submitting

## License

This project is licensed under the MIT License.