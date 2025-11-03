import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact - Fanpocket',
  description: 'Get in touch with the Fanpocket team.',
};

export default function ContactPage() {
  return (
    <div className="bg-gray-50 py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>

          <div className="mt-8 space-y-6 text-gray-700">
            <p className="text-lg">
              We&apos;d love to hear from you! Whether you have feedback,
              questions, or just want to say hello, feel free to reach out.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900">
              Stay Connected
            </h2>
            <ul className="list-inside list-disc space-y-2">
              <li>
                Email: <a href="mailto:hello@fanpocket.dev" className="text-blue-600 hover:underline">hello@fanpocket.dev</a>
              </li>
              <li>Follow us on social media for updates and new features.</li>
              <li>Join our community to support and collaborate with other creators.</li>
            </ul>

            <div className="rounded-lg bg-blue-50 p-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Feedback & Suggestions
              </h3>
              <p className="mt-2 text-gray-700">
                Your feedback helps us improve Fanpocket. Share your ideas and let us know what you&apos;d like to see next!
              </p>
            </div>

            <p className="text-sm text-gray-600">
              Our team typically responds within 1-2 business days. Thank you for being part of the Fanpocket community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
