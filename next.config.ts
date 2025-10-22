import type { NextConfig } from "next";

// Bundle analyzer (sadece ANALYZE=true ile çalışır)
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  // TypeScript ve ESLint build hatalarını TAMAMEN görmezden gel (Railway için)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    // Build sırasında ESLint'i TAMAMEN devre dışı bırak
    ignoreDuringBuilds: true,
  },
  
  /* Turbopack Configuration */
  turbopack: {
    // Turbopack ayarları
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  /* Security Headers - Eski telefonlar için SSL uyumluluğu */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          // Eski cihazlar için SSL cipher desteği
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:; img-src 'self' data: https: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; font-src 'self' data: https:;"
          }
        ],
      },
    ]
  },
  
  /* Performance Optimizations */
  images: {
    formats: ['image/avif', 'image/webp'], // AVIF önce (daha iyi sıkıştırma)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 yıl cache
    unoptimized: false,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    loader: 'default',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'yt3.ggphpt.com',
        pathname: '/**',
      },
    ],
  },
  
  /* Compression */
  compress: true,
  
  /* React Strict Mode */
  reactStrictMode: false, // Mobil uyumluluk için kapalı
  
  /* Power Mode */
  poweredByHeader: false,
  
  /* ETags for caching */
  generateEtags: true,
  
  /* Experimental Features */
  experimental: {
    optimizePackageImports: ['@/components', '@/lib', 'lucide-react'],
  },
  
  /* Production Optimization */
  productionBrowserSourceMaps: false,
  
  /* Output Configuration - Disabled for Railway compatibility */
  // output: 'standalone', // Railway için kapatıldı
  
  /* Generate Build ID for cache busting */
  generateBuildId: async () => {
    return `build-${Date.now()}`
  },
  
  /* Compiler Options - Remove ALL console logs in production */
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? true : false,
  },
};

export default withBundleAnalyzer(nextConfig);
