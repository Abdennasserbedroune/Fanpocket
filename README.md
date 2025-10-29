# AFCON 2025 Marrakech MVP

A production-ready vanilla JavaScript web application for the Africa Cup of Nations 2025 hosted in Morocco. This is a fan engagement platform providing live updates, match schedules, team statistics, and community features.

## 🏗️ Project Structure

```
├── public/                 # Public HTML pages
│   ├── index.html         # Landing page
│   ├── login.html         # Login page
│   ├── register.html      # Registration page
│   ├── reset.html         # Password reset page
│   ├── dashboard.html     # User dashboard
│   ├── profile.html       # User profile
│   ├── onboarding.html    # Onboarding flow
│   └── favicon.svg        # Favicon
├── src/
│   ├── css/
│   │   └── main.css       # Main stylesheet (includes normalize.css)
│   ├── js/
│   │   ├── app.js         # Main application entry point
│   │   ├── router.js      # Hash-based router
│   │   └── utils/
│   │       ├── dom.js     # DOM manipulation utilities
│   │       └── fetchJSON.js # API utilities
│   └── components/        # Reusable components (future)
├── data/                  # JSON data stubs
│   ├── matches.json       # Match schedule and results
│   ├── updates.json       # Real-time updates and news
│   └── teams_stats.json   # Team statistics
├── images/                # Images and photos
├── icons/                 # Icon assets
├── dist/                  # Build output (minified assets)
└── vercel.json           # Vercel deployment config
```

## 🎨 Design System

### Morocco-Inspired Brand Colors

- **Primary (Red)**: `#c1272d` - Morocco flag red
- **Secondary (Green)**: `#006233` - Morocco flag green
- **Accent (Gold)**: `#d4af37` - Moroccan gold

### CSS Variables

All colors, spacing, and typography are defined as CSS custom properties in `src/css/main.css` for easy theming and consistency.

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

This will start a local development server at `http://localhost:8080`.

### Build

```bash
npm run build
```

This will:

1. Minify CSS using LightningCSS
2. Minify and bundle JavaScript using Terser
3. Output to the `dist/` directory

### Linting & Formatting

```bash
# Check formatting
npm run lint

# Auto-format code
npm run format
```

## 📊 Data Schema

### matches.json

```json
{
  "id": "string - Unique match identifier",
  "homeTeam": "string - Home team name",
  "awayTeam": "string - Away team name",
  "date": "ISO 8601 datetime",
  "venue": "string - Stadium name",
  "status": "scheduled|live|finished",
  "homeScore": "number|null",
  "awayScore": "number|null",
  "group": "string - Tournament group",
  "round": "string - Tournament round"
}
```

### updates.json

```json
{
  "id": "string - Unique update identifier",
  "type": "news|goal|card|substitution|match-event",
  "title": "string - Update headline",
  "content": "string - Detailed content",
  "timestamp": "ISO 8601 datetime",
  "matchId": "string|null - Related match",
  "priority": "high|normal|low"
}
```

### teams_stats.json

```json
{
  "id": "string - Unique team identifier",
  "name": "string - Team name",
  "code": "string - ISO 3166-1 alpha-3 code",
  "group": "string - Tournament group",
  "stats": {
    "played": "number",
    "wins": "number",
    "draws": "number",
    "losses": "number",
    "goalsFor": "number",
    "goalsAgainst": "number",
    "goalDifference": "number",
    "points": "number"
  },
  "form": ["W|D|L"],
  "ranking": "number"
}
```

## ♿ Accessibility

- Skip link for keyboard navigation
- Focus styles for all interactive elements
- Semantic HTML structure
- ARIA labels where needed
- Mobile-first responsive design

## 🔧 Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox
- **Vanilla JavaScript** - ES6+ features
- **LightningCSS** - Fast CSS processing and minification
- **Terser** - JavaScript minification
- **http-server** - Local development server
- **Prettier** - Code formatting

## 🚢 Deployment

### Vercel (Recommended)

The project is configured for Vercel deployment:

```bash
vercel
```

Configuration is in `vercel.json`. Preview deployments are automatically created for pull requests.

### Alternative: Netlify

Create a `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "public"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 📦 Zero-Cost OSS Tools Used

- **normalize.css** (MIT) - CSS reset
- **LightningCSS** (MPL-2.0) - CSS processing
- **Terser** (BSD-2-Clause) - JS minification
- **Prettier** (MIT) - Code formatting
- **http-server** (MIT) - Dev server

## 🎯 Performance

Target Lighthouse scores:

- Performance: >= 80
- Accessibility: >= 90
- Best Practices: >= 90
- SEO: >= 90

## 📝 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run lint` and `npm run build`
5. Submit a pull request

---

Built with ❤️ for AFCON 2025 🇲🇦⚽
