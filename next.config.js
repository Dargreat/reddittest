/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/search',
        destination: '/api/search' // Ensures proper routing
      }
    ]
  }
};
