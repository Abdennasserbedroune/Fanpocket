#!/usr/bin/env tsx
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { readFileSync, existsSync } from 'fs';

const prisma = new PrismaClient();

type PostInput = {
  creator: string;
  title: string;
  md: string;
  hero: string;
  publish: boolean;
};

function parseArgs(): PostInput | null {
  const args = process.argv.slice(2);
  const input: Record<string, string | boolean | undefined> = {};

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      if (key === 'publish') {
        input.publish = true;
      } else {
        const next = args[i + 1];
        if (!next || next.startsWith('--')) {
          console.error(`❌ Missing value for argument: --${key}`);
          return null;
        }
        input[key] = next;
        i += 1;
      }
    }
  }

  const required: Array<'creator' | 'title' | 'md' | 'hero'> = [
    'creator',
    'title',
    'md',
    'hero',
  ];

  for (const field of required) {
    if (!input[field]) {
      console.error(`❌ Missing required argument: --${field}`);
      return null;
    }
  }

  return {
    creator: input.creator as string,
    title: input.title as string,
    md: input.md as string,
    hero: input.hero as string,
    publish: Boolean(input.publish),
  };
}

async function main() {
  const input = parseArgs();
  if (!input) {
    process.exit(1);
  }

  if (!existsSync(input.md)) {
    console.error(`❌ File not found: ${input.md}`);
    process.exit(1);
  }

  let markdownContent: string;
  try {
    markdownContent = readFileSync(input.md, 'utf-8');
  } catch (error) {
    console.error(`❌ Failed to read file: ${input.md}`, error);
    process.exit(1);
  }

  const creator = await prisma.creator.findUnique({
    where: { slug: input.creator },
  });

  if (!creator) {
    console.error(`❌ Creator with slug "${input.creator}" not found.`);
    process.exit(1);
  }

  try {
    const post = await prisma.post.create({
      data: {
        creatorId: creator.id,
        title: input.title,
        content: markdownContent,
        heroImageUrl: input.hero,
        published: input.publish,
      },
    });

    console.log('✅ Post created successfully!');
    console.log(`   - ID: ${post.id}`);
    console.log(`   - Title: ${post.title}`);
    console.log(`   - Creator: ${creator.name}`);
    console.log(`   - Published: ${post.published}`);
  } catch (error) {
    console.error('❌ Failed to add post:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
