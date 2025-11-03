import Link from 'next/link';
import Image from 'next/image';

interface PostCardProps {
  id: string;
  title: string;
  heroImageUrl: string;
  excerpt: string;
  creatorName: string;
  createdAt: Date;
}

export default function PostCard({
  id,
  title,
  heroImageUrl,
  excerpt,
  creatorName,
  createdAt,
}: PostCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-48 w-full">
        <Image
          src={heroImageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <p className="text-sm text-gray-500">
          {new Intl.DateTimeFormat('en', {
            dateStyle: 'medium',
          }).format(createdAt)}{' '}
          • {creatorName}
        </p>
        <h3 className="mt-2 text-xl font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 line-clamp-3 text-gray-600">{excerpt}</p>
        <Link
          href={`/posts/${id}`}
          className="mt-4 inline-block text-blue-600 transition-colors hover:text-blue-500"
        >
          Read more →
        </Link>
      </div>
    </article>
  );
}
