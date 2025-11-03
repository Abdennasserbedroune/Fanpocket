import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import CreatorCard from '@/components/cards/CreatorCard';
import EmptyState from '@/components/EmptyState';

interface CreatorsPageProps {
  searchParams?: {
    q?: string;
  };
}

export const metadata: Metadata = {
  title: 'Creators - Fanpocket',
  description: 'Browse all creators on Fanpocket and discover your favourites.',
};

export default async function CreatorsPage({
  searchParams,
}: CreatorsPageProps) {
  const query = searchParams?.q?.trim() ?? '';

  const creators = await prisma.creator.findMany({
    where: query
      ? {
          OR: [
            { name: { contains: query } },
            { slug: { contains: query } },
          ],
        }
      : undefined,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Creators</h1>
            <p className="mt-2 text-gray-600">
              Discover talented creators and explore their latest posts.
            </p>
          </div>
          <form className="w-full max-w-md" method="get">
            <label htmlFor="search" className="sr-only">
              Search creators
            </label>
            <div className="relative rounded-lg shadow-sm">
              <input
                id="search"
                name="q"
                type="search"
                placeholder="Search by name or slug..."
                defaultValue={query}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-blue-600 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-blue-500"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {creators.length > 0 ? (
            creators.map((creator) => (
              <CreatorCard
                key={creator.id}
                slug={creator.slug}
                name={creator.name}
                avatarUrl={creator.avatarUrl}
                bio={creator.bio}
              />
            ))
          ) : (
            <div className="md:col-span-2 lg:col-span-3">
              <EmptyState
                title="No creators found"
                message="Try searching with a different keyword or check back later."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
