/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true, // For static export, images must be unoptimized
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ext.same-assets.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com',
      }
    ],
    domains: ['ext.same-assets.com', 'images.unsplash.com', 'github.com', 'raw.githubusercontent.com'],
  },
  // Performance optimizations
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // For improved performance in static export
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
};

export default nextConfig;
