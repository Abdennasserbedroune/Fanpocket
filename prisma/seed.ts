import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.post.deleteMany();
  await prisma.creator.deleteMany();

  // Create creators
  const creator1 = await prisma.creator.create({
    data: {
      slug: 'john-doe',
      name: 'John Doe',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      bio: 'Tech enthusiast and content creator sharing insights on web development, design, and innovation.',
      links: {
        website: 'https://johndoe.dev',
        twitter: 'https://twitter.com/johndoe',
        github: 'https://github.com/johndoe',
      },
    },
  });

  const creator2 = await prisma.creator.create({
    data: {
      slug: 'jane-smith',
      name: 'Jane Smith',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
      bio: 'Designer and developer creating beautiful and functional digital experiences. Passionate about UX and accessibility.',
      links: {
        website: 'https://janesmith.design',
        twitter: 'https://twitter.com/janesmith',
        linkedin: 'https://linkedin.com/in/janesmith',
      },
    },
  });

  const creator3 = await prisma.creator.create({
    data: {
      slug: 'alex-chen',
      name: 'Alex Chen',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
      bio: 'Full-stack engineer building scalable applications. Love exploring new technologies and sharing knowledge with the community.',
      links: {
        website: 'https://alexchen.tech',
        github: 'https://github.com/alexchen',
        youtube: 'https://youtube.com/@alexchen',
      },
    },
  });

  // Create posts for creator 1
  await prisma.post.create({
    data: {
      creatorId: creator1.id,
      title: 'Getting Started with Next.js 14',
      content: `# Getting Started with Next.js 14

Next.js 14 introduces exciting new features that make building modern web applications easier than ever.

## Key Features

- **Server Components**: Render components on the server for better performance
- **App Router**: New routing system with improved layouts and nested routes
- **Streaming**: Progressive rendering for faster page loads

## Installation

\`\`\`bash
npx create-next-app@latest
\`\`\`

## Conclusion

Next.js 14 is a game-changer for React developers. Give it a try!`,
      heroImageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      published: true,
    },
  });

  await prisma.post.create({
    data: {
      creatorId: creator1.id,
      title: 'Understanding TypeScript Generics',
      content: `# Understanding TypeScript Generics

Generics are one of the most powerful features in TypeScript, allowing you to write reusable and type-safe code.

## What are Generics?

Generics provide a way to create components that work with multiple types rather than a single one.

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}
\`\`\`

## Use Cases

1. Creating reusable functions
2. Building type-safe data structures
3. Working with APIs

Stay tuned for more TypeScript content!`,
      heroImageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
      published: true,
    },
  });

  await prisma.post.create({
    data: {
      creatorId: creator1.id,
      title: 'Building a REST API with Node.js',
      content: `# Building a REST API with Node.js

Learn how to create a production-ready REST API using Node.js and Express.

## Setup

\`\`\`bash
npm init -y
npm install express
\`\`\`

## Creating Routes

\`\`\`javascript
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});
\`\`\`

More content coming soon!`,
      heroImageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
      published: true,
    },
  });

  // Create posts for creator 2
  await prisma.post.create({
    data: {
      creatorId: creator2.id,
      title: 'Design Systems 101',
      content: `# Design Systems 101

A comprehensive guide to building and maintaining design systems for modern web applications.

## What is a Design System?

A design system is a collection of reusable components, guided by clear standards, that can be assembled to build applications.

## Key Components

- **Typography**: Consistent font families, sizes, and weights
- **Color Palette**: Primary, secondary, and semantic colors
- **Spacing**: Uniform spacing scale
- **Components**: Buttons, forms, cards, and more

## Benefits

1. Consistency across products
2. Faster development
3. Better collaboration between designers and developers

Start small and iterate!`,
      heroImageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
      published: true,
    },
  });

  await prisma.post.create({
    data: {
      creatorId: creator2.id,
      title: 'Mastering CSS Grid',
      content: `# Mastering CSS Grid

CSS Grid is a powerful layout system that makes creating complex layouts easier than ever before.

## Basic Grid

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
\`\`\`

## Grid Areas

Define named areas for intuitive layout control:

\`\`\`css
.container {
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
}
\`\`\`

Grid is the future of web layouts!`,
      heroImageUrl: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800',
      published: true,
    },
  });

  // Create posts for creator 3
  await prisma.post.create({
    data: {
      creatorId: creator3.id,
      title: 'Introduction to Docker',
      content: `# Introduction to Docker

Docker has revolutionized how we deploy and manage applications. Learn the basics in this comprehensive guide.

## What is Docker?

Docker is a platform for developing, shipping, and running applications in containers.

## Key Concepts

- **Images**: Read-only templates
- **Containers**: Running instances of images
- **Dockerfile**: Instructions to build an image

## Basic Commands

\`\`\`bash
docker build -t myapp .
docker run -p 3000:3000 myapp
\`\`\`

Happy containerizing!`,
      heroImageUrl: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800',
      published: true,
    },
  });

  await prisma.post.create({
    data: {
      creatorId: creator3.id,
      title: 'GraphQL vs REST: Choosing the Right API',
      content: `# GraphQL vs REST: Choosing the Right API

Both GraphQL and REST have their place in modern application development. Let's compare them.

## REST

**Pros:**
- Simple and well-understood
- Cacheable
- Stateless

**Cons:**
- Over-fetching/under-fetching
- Multiple endpoints

## GraphQL

**Pros:**
- Precise data fetching
- Single endpoint
- Strong typing

**Cons:**
- Learning curve
- Complexity for simple APIs

Choose based on your needs!`,
      heroImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
      published: true,
    },
  });

  await prisma.post.create({
    data: {
      creatorId: creator3.id,
      title: 'Testing Strategies for Modern Web Apps',
      content: `# Testing Strategies for Modern Web Apps

A solid testing strategy is crucial for maintaining code quality and catching bugs early.

## Types of Tests

1. **Unit Tests**: Test individual functions
2. **Integration Tests**: Test component interactions
3. **E2E Tests**: Test complete user flows

## Tools

- Jest for unit tests
- React Testing Library for component tests
- Playwright for E2E tests

## Best Practices

- Write tests first (TDD)
- Aim for good coverage, not 100%
- Test behavior, not implementation

Happy testing!`,
      heroImageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
      published: true,
    },
  });

  console.log('✅ Seeding complete!');
  console.log(`   - Created 3 creators`);
  console.log(`   - Created 8 posts`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
