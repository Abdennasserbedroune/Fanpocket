const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\.tile\.openstreetmap\.org\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'openstreetmap-tiles',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24,
        },
      },
    },
  ],
});

module.exports = withPWA({
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'fr', 'ar'],
    defaultLocale: 'en',
  },
  images: {
    domains: ['localhost'],
  },
});
