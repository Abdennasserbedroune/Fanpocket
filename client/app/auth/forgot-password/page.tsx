import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="text-3xl font-bold text-moroccanRed">
            Fanpocket
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Password reset functionality coming soon.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 mb-4">
            This feature is currently under development.
          </p>
          <Link
            href="/auth/login"
            className="text-moroccanRed hover:text-moroccanRed/80 font-medium"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}