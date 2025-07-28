/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')(
  // This is the default location for the i18n config
  './i18n.ts'
);

const nextConfig = {
  // Enable access from other devices on the network during development
  experimental: {
    // Future experimental features can go here
  },
  
  // Optimize images for mobile devices
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Ensure proper mobile viewport handling
  poweredByHeader: false,
  
  // Enable compression for better mobile performance
  compress: true,
}

module.exports = withNextIntl(nextConfig);
