/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['10.28.255.119', 'localhost'],

  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: 'http://backend:3000/auth/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'http://backend:3000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
