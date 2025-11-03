# Fanpocket

A Next.js 14 web application for creators to share their content with the world. Built with TypeScript, Tailwind CSS, and Prisma ORM.

## Features

- 🚀 Next.js 14 with App Router
- 📝 Markdown content rendering with syntax highlighting
- 🎨 Tailwind CSS for styling
- 🗄️ Prisma ORM with SQLite database
- 🔍 Server-side search functionality
- 📱 Fully responsive design
- ♿ Accessible UI components
- 🚫 No authentication required - all content is public

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (via Prisma ORM)
- **Markdown**: Unified, Remark, Rehype
- **Code Highlighting**: Highlight.js

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Basic knowledge of terminal commands

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd fanpocket
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

The `.env` file contains:

```
DATABASE_URL="file:./prisma/dev.db"
```

4. Run database migrations:

```bash
npm run db:migrate
```

5. Seed the database with sample data:

```bash
npm run db:seed
```

6. Start the development server:

```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

### Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking

### Database

- `npm run db:generate` - Generate Prisma Client
- `npm run db:migrate` - Create and apply migrations
- `npm run db:reset` - Reset database (destructive)
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio (database GUI)

### Content Management

Add creators and posts via CLI:

#### Add a Creator

```bash
npm run content:add:creator -- \
  --name "Creator Name" \
  --slug "creator-slug" \
  --avatar "https://example.com/avatar.jpg" \
  --bio "Creator bio..." \
  --links '{"website":"https://example.com","twitter":"https://twitter.com/user"}'
```

#### Add a Post

```bash
npm run content:add:post -- \
  --creator "creator-slug" \
  --title "Post Title" \
  --md "./path/to/content.md" \
  --hero "https://example.com/hero.jpg" \
  --publish
```

## Project Structure

```
fanpocket/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts               # Database seeding script
│   └── migrations/           # Database migrations
├── scripts/
│   ├── add-creator.ts        # CLI to add creators
│   └── add-post.ts           # CLI to add posts
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── page.tsx         # Landing page
│   │   ├── layout.tsx       # Root layout
│   │   ├── not-found.tsx    # 404 page
│   │   ├── about/           # About page
│   │   ├── contact/         # Contact page
│   │   ├── creators/        # Creators listing & detail
│   │   └── posts/           # Post detail pages
│   ├── components/          # React components
│   │   ├── layout/          # Layout components (Navbar, Footer)
│   │   ├── cards/           # Card components
│   │   ├── EmptyState.tsx   # Empty state component
│   │   └── MarkdownRenderer.tsx  # Markdown renderer
│   └── lib/                 # Utility functions
│       ├── prisma.ts        # Prisma client singleton
│       └── markdown.ts      # Markdown processing
├── public/                   # Static assets
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── next.config.ts           # Next.js configuration
└── README.md               # This file
```

## Pages

- `/` - Landing page with featured creators and latest posts
- `/creators` - List all creators with search functionality
- `/creators/[slug]` - Creator profile with paginated posts
- `/posts/[id]` - Individual post detail with rendered markdown
- `/about` - About page
- `/contact` - Contact page

## Database Schema

### Creator

- `id` (cuid) - Unique identifier
- `slug` (string) - URL-friendly unique slug
- `name` (string) - Display name
- `avatarUrl` (string) - Avatar image URL
- `bio` (string) - Biography
- `links` (Json) - External links (website, social media, etc.)
- `createdAt` (DateTime) - Creation timestamp

### Post

- `id` (cuid) - Unique identifier
- `creatorId` (string) - Foreign key to Creator
- `title` (string) - Post title
- `content` (string) - Markdown content
- `heroImageUrl` (string) - Hero image URL
- `published` (boolean) - Publication status
- `createdAt` (DateTime) - Creation timestamp

## Development

### Adding a New Feature

1. Create components in `src/components/`
2. Add pages in `src/app/`
3. Update database schema in `prisma/schema.prisma` if needed
4. Run `npm run db:migrate` to apply schema changes
5. Test locally with `npm run dev`

### Code Quality

This project uses:

- **ESLint** for linting
- **Prettier** for code formatting
- **TypeScript** for type safety

Run checks before committing:

```bash
npm run lint
npm run typecheck
npm run format
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variable: `DATABASE_URL`
4. Deploy!

Note: For production, consider using PostgreSQL instead of SQLite.

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Railway
- Fly.io

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and type checks
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For questions or issues, please open an issue on GitHub or contact us via the contact page.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS.
