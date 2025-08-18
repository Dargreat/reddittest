/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
};

module.exports = {
  output: "export", // Change from 'standalone' to 'export'
  distDir: "out", // Specify output directory
};
