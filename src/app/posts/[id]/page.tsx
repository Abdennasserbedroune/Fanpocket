import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { renderMarkdown } from '@/lib/markdown';

interface PostPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { creator: true },
  });

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} - Fanpocket`,
    description: post.content.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.content.slice(0, 160),
      images: [post.heroImageUrl],
      type: 'article',
      authors: [post.creator.name],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { creator: true },
  });

  if (!post || !post.published) {
    notFound();
  }

  const htmlContent = await renderMarkdown(post.content);

  return (
    <article className="bg-gray-50 py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href={`/creators/${post.creator.slug}`}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <span>←</span>
            <span>Back to {post.creator.name}</span>
          </Link>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="relative h-96 w-full">
            <Image
              src={post.heroImageUrl}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
          </div>

          <div className="p-8">
            <div className="mb-6 flex items-center gap-4">
              <Link href={`/creators/${post.creator.slug}`}>
                <div className="relative h-12 w-12 overflow-hidden rounded-full">
                  <Image
                    src={post.creator.avatarUrl}
                    alt={post.creator.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
              </Link>
              <div>
                <Link
                  href={`/creators/${post.creator.slug}`}
                  className="font-semibold text-gray-900 hover:text-blue-600"
                >
                  {post.creator.name}
                </Link>
                <p className="text-sm text-gray-500">
                  {new Intl.DateTimeFormat('en', {
                    dateStyle: 'long',
                  }).format(post.createdAt)}
                </p>
              </div>
            </div>

            <h1 className="mb-8 text-4xl font-bold text-gray-900">
              {post.title}
            </h1>

            <MarkdownRenderer html={htmlContent} />
          </div>
        </div>
      </div>
    </article>
  );
}
