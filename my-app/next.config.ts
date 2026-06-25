/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '1000logos.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
  eslint: {
  ignoreDuringBuilds: true,
},
};

export default nextConfig;