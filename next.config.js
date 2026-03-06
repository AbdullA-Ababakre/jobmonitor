/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // globe.gl / three.js need canvas
      config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    }
    return config;
  },
  transpilePackages: ['three', 'globe.gl', 'react-globe.gl'],
};

module.exports = nextConfig;
