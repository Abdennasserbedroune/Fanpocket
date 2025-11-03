import { prisma } from '@/lib/prisma';

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: { creator: true },
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Fanpocket</title>
    <link>${baseUrl}</link>
    <description>Latest posts from Fanpocket creators</description>
    <language>en</language>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/posts/${post.id}</link>
      <guid isPermaLink="true">${baseUrl}/posts/${post.id}</guid>
      <description><![CDATA[${post.content.slice(0, 300)}...]]></description>
      <author><![CDATA[${post.creator.name}]]></author>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
