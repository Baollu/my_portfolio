const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./i18n.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force dynamic rendering for all pages
  experimental: {
    // This allows dynamic rendering with next-intl
  },
}

module.exports = withNextIntl(nextConfig)