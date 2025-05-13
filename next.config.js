/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'undici': false,
    };
    return config;
  },
  experimental: {
    appDir: true,
  },
  swcMinify: false,
};

module.exports = nextConfig;
