import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const creators = await prisma.creator.findMany({
    select: { slug: true, updatedAt: true, createdAt: true },
  });

  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { id: true, updatedAt: true, createdAt: true },
  });

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/creators`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
    },
    ...creators.map((creator) => ({
      url: `${baseUrl}/creators/${creator.slug}`,
      lastModified: creator.updatedAt,
    })),
    ...posts.map((post) => ({
      url: `${baseUrl}/posts/${post.id}`,
      lastModified: post.updatedAt,
    })),
  ];
}
