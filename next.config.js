/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Optimasi kompresi
  compress: true,
  // Optimasi images
  images: {
    domains: [],
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Optimasi output
  swcMinify: true,
  // Optimasi production
  productionBrowserSourceMaps: false,
  // Optimasi static files
  poweredByHeader: false,
  // Optimasi production build
  generateEtags: true,
  // Optimasi headers (disabled untuk dev mode - hanya aktif di production)
  // async headers() {
  //   return [
  //     {
  //       source: '/:path*',
  //       headers: [
  //         {
  //           key: 'X-DNS-Prefetch-Control',
  //           value: 'on'
  //         },
  //         {
  //           key: 'X-Frame-Options',
  //           value: 'SAMEORIGIN'
  //         },
  //         {
  //           key: 'X-Content-Type-Options',
  //           value: 'nosniff'
  //         },
  //         {
  //           key: 'Referrer-Policy',
  //           value: 'origin-when-cross-origin'
  //         }
  //       ],
  //     },
  //     {
  //       source: '/images/:path*',
  //       headers: [
  //         {
  //           key: 'Cache-Control',
  //           value: 'public, max-age=31536000, immutable'
  //         }
  //       ],
  //     },
  //     {
  //       source: '/audio/:path*',
  //       headers: [
  //         {
  //           key: 'Cache-Control',
  //           value: 'public, max-age=31536000, immutable'
  //         }
  //       ],
  //     }
  //   ]
  // },
}

module.exports = nextConfig

