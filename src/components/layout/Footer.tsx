export default function Footer() {
  return (
    <footer className="border-t bg-gray-50 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center text-sm text-gray-600 sm:flex-row sm:text-left">
        <p>&copy; {new Date().getFullYear()} Fanpocket. All rights reserved.</p>
        <p className="text-gray-500">
          Built with Next.js, Tailwind CSS, and Prisma.
        </p>
      </div>
    </footer>
  );
}
