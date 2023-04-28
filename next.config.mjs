// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import('./src/env/server.mjs'));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  optimizeFonts: true,
  experimental: {
    appDir: true,
    runtime: 'experimental-edge',
  },
  rewrites: async () => {
    return [
      {
        source: '/ingest/js/script.js',
        destination: 'https://ingest.tokia.dev/js/script.js',
      },
      {
        source: '/ingest/api/event',
        destination: 'https://ingest.tokia.dev/api/event',
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
export default config;
