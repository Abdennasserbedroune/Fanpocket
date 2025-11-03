#!/usr/bin/env tsx
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type CreatorInput = {
  name: string;
  slug: string;
  avatar: string;
  bio: string;
  links: Record<string, string>;
};

function parseArgs(): CreatorInput | null {
  const args = process.argv.slice(2);
  const input: Record<string, string | undefined> = {};

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (!next || next.startsWith('--')) {
        console.error(`❌ Missing value for argument: --${key}`);
        return null;
      }
      input[key] = next;
      i += 1;
    }
  }

  const required: Array<keyof CreatorInput> = ['name', 'slug', 'avatar', 'bio'];
  for (const field of required) {
    if (!input[field]) {
      console.error(`❌ Missing required argument: --${field}`);
      return null;
    }
  }

  const links: Record<string, string> = {};
  if (input.links) {
    try {
      const parsed = JSON.parse(input.links);
      if (typeof parsed === 'object' && parsed !== null) {
        Object.entries(parsed).forEach(([key, value]) => {
          if (typeof value === 'string') {
            links[key] = value;
          }
        });
      }
    } catch (error) {
      console.error('❌ Invalid JSON for --links. Provide a valid JSON object.');
      return null;
    }
  }

  return {
    name: input.name!,
    slug: input.slug!,
    avatar: input.avatar!,
    bio: input.bio!,
    links,
  };
}

async function main() {
  const input = parseArgs();
  if (!input) {
    process.exit(1);
  }

  try {
    const creator = await prisma.creator.create({
      data: {
        name: input.name,
        slug: input.slug,
        avatarUrl: input.avatar,
        bio: input.bio,
        links: input.links,
      },
    });

    console.log('✅ Creator created successfully!');
    console.log(`   - ID: ${creator.id}`);
    console.log(`   - Name: ${creator.name}`);
    console.log(`   - Slug: ${creator.slug}`);
  } catch (error) {
    console.error('❌ Failed to add creator:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
