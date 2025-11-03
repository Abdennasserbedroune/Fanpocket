import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - Fanpocket',
  description: 'Learn more about Fanpocket and our mission.',
};

export default function AboutPage() {
  return (
    <div className="bg-gray-50 py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <h1 className="text-4xl font-bold text-gray-900">About Fanpocket</h1>

          <div className="mt-8 space-y-6 text-gray-700">
            <p className="text-lg">
              Welcome to Fanpocket, a platform designed to connect creators with
              their audience through meaningful content.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900">Our Mission</h2>
            <p>
              We believe in empowering creators to share their knowledge,
              insights, and stories with the world. Fanpocket provides a simple
              yet powerful platform for creators to publish their content and
              build their community.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900">
              What We Offer
            </h2>
            <ul className="list-inside list-disc space-y-2">
              <li>Beautiful, distraction-free reading experience</li>
              <li>Easy content discovery through creator profiles</li>
              <li>
                Simple and intuitive interface for exploring posts and creators
              </li>
              <li>Fast, responsive design that works on all devices</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900">
              Built with Modern Tech
            </h2>
            <p>
              Fanpocket is built with Next.js 14, TypeScript, Tailwind CSS, and
              Prisma ORM. We leverage the latest web technologies to deliver a
              fast and reliable experience.
            </p>

            <div className="mt-8 rounded-lg bg-blue-50 p-6">
              <p className="text-sm text-gray-700">
                Fanpocket is an open platform focused on great content and user
                experience. No authentication required - just explore and enjoy!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
