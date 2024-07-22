/** @type {import('next').NextConfig} */

const { version } = require('./package.json')

const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    const cf = config
    cf.resolve.fallback = { fs: false }
    return cf
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
  },
}

module.exports = nextConfig
