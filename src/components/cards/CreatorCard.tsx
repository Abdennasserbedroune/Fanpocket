import Link from 'next/link';
import Image from 'next/image';

interface CreatorCardProps {
  slug: string;
  name: string;
  avatarUrl: string;
  bio: string;
}

export default function CreatorCard({
  slug,
  name,
  avatarUrl,
  bio,
}: CreatorCardProps) {
  return (
    <Link
      href={`/creators/${slug}`}
      className="block rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
          <Image
            src={avatarUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{bio}</p>
        </div>
      </div>
    </Link>
  );
}
