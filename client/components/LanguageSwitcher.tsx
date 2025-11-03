'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇲🇦' },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = useState('en');

  const handleLanguageChange = (locale: string) => {
    setCurrentLocale(locale);
    const dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', locale);
  };

  return (
    <div className="flex gap-2">
      {languages.map(lang => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={`px-3 py-1 rounded ${
            currentLocale === lang.code
              ? 'bg-moroccanRed text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          title={lang.name}
        >
          {lang.flag}
        </button>
      ))}
    </div>
  );
}
