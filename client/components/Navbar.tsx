'use client';

import Link from 'next/link';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-moroccanRed">
              Fanpocket
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/map"
              className="text-gray-700 hover:text-moroccanRed transition"
            >
              Map
            </Link>
            <Link
              href="/matches"
              className="text-gray-700 hover:text-moroccanRed transition"
            >
              Matches
            </Link>
            <Link
              href="/stadiums"
              className="text-gray-700 hover:text-moroccanRed transition"
            >
              Stadiums
            </Link>
            <Link
              href="/teams"
              className="text-gray-700 hover:text-moroccanRed transition"
            >
              Teams
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
