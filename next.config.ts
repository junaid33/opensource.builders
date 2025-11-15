import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ['graphql'],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.S3_ENDPOINT ? process.env.S3_ENDPOINT.replace(/^https?:\/\//, '').replace(/:\d+$/, '') : '/',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    if (process.env.OPENFRONT_GRAPHQL_URL) {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.OPENFRONT_GRAPHQL_URL}/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;