import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import PostCard from '@/components/cards/PostCard';
import EmptyState from '@/components/EmptyState';

interface CreatorPageProps {
  params: {
    slug: string;
  };
  searchParams?: {
    page?: string;
  };
}

const POSTS_PER_PAGE = 6;

export async function generateMetadata({
  params,
}: CreatorPageProps): Promise<Metadata> {
  const creator = await prisma.creator.findUnique({
    where: { slug: params.slug },
  });

  if (!creator) {
    return {
      title: 'Creator Not Found',
    };
  }

  return {
    title: `${creator.name} - Fanpocket`,
    description: creator.bio,
    openGraph: {
      title: creator.name,
      description: creator.bio,
      images: [creator.avatarUrl],
    },
  };
}

export default async function CreatorPage({
  params,
  searchParams,
}: CreatorPageProps) {
  const pageParam = parseInt(searchParams?.page || '1', 10);
  const page = Number.isNaN(pageParam) ? 1 : Math.max(1, pageParam);

  const creator = await prisma.creator.findUnique({
    where: { slug: params.slug },
    include: {
      posts: {
        where: {
          published: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * POSTS_PER_PAGE,
        take: POSTS_PER_PAGE,
      },
    },
  });

  if (!creator) {
    notFound();
  }

  const totalPosts = await prisma.post.count({
    where: {
      creatorId: creator.id,
      published: true,
    },
  });

  const totalPages = Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE));
  const links =
    (creator.links as Record<string, string> | null | undefined) ?? {};

  return (
    <div className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <div className="flex flex-col items-start gap-6 sm:flex-row">
            <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-full">
              <Image
                src={creator.avatarUrl}
                alt={creator.name}
                fill
                className="object-cover"
                sizes="128px"
                priority
              />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900">
                {creator.name}
              </h1>
              <p className="mt-4 text-gray-600">{creator.bio}</p>
              {links && Object.keys(links).length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {Object.entries(links).map(([key, value]) => (
                    <a
                      key={key}
                      href={value as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 underline hover:text-blue-500"
                    >
                      {key}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900">Posts</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {creator.posts.length > 0 ? (
              creator.posts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  heroImageUrl={post.heroImageUrl}
                  excerpt={post.content.slice(0, 150) + '...'}
                  creatorName={creator.name}
                  createdAt={post.createdAt}
                />
              ))
            ) : (
              <div className="md:col-span-2 lg:col-span-3">
                <EmptyState
                  title="No posts yet"
                  message={`${creator.name} hasn't published any posts yet.`}
                />
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <a
                    key={pageNum}
                    href={`?page=${pageNum}`}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      pageNum === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </a>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
