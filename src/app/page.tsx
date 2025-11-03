import { prisma } from '@/lib/prisma';
import CreatorCard from '@/components/cards/CreatorCard';
import PostCard from '@/components/cards/PostCard';
import Link from 'next/link';

export const metadata = {
  title: 'Fanpocket - Discover Creators and Content',
  description: 'Explore amazing creators and their latest posts.',
};

export default async function Home() {
  const featuredCreators = await prisma.creator.findMany({
    take: 3,
    orderBy: {
      createdAt: 'desc',
    },
  });

  const latestPosts = await prisma.post.findMany({
    where: {
      published: true,
    },
    take: 6,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      creator: true,
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold">
              Welcome to Fanpocket
            </h1>
            <p className="mt-6 text-xl text-blue-100">
              Discover amazing creators and their stories. Connect with content
              that inspires you.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link
                href="/creators"
                className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 transition-colors hover:bg-blue-50"
              >
                Browse Creators
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Creators
            </h2>
            <Link
              href="/creators"
              className="text-blue-600 hover:text-blue-500"
            >
              View all →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredCreators.map((creator) => (
              <CreatorCard
                key={creator.id}
                slug={creator.slug}
                name={creator.name}
                avatarUrl={creator.avatarUrl}
                bio={creator.bio}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-gray-900">
            Latest Posts
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                heroImageUrl={post.heroImageUrl}
                excerpt={post.content.slice(0, 150) + '...'}
                creatorName={post.creator.name}
                createdAt={post.createdAt}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
