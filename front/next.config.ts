/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.1.172', 'localhost', '10.28.255.119',],

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
