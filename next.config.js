/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["raw.githubusercontent.com", "user-images.githubusercontent.com"],
  },
};

module.exports = nextConfig;
