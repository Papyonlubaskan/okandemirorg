import type { NextConfig } from "next";

// Bundle analyzer (sadece ANALYZE=true ile çalışır)
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
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
    quality: 85, // Yüksek kalite
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
  reactStrictMode: true,
  
  /* Power Mode */
  poweredByHeader: false,
  
  /* ETags for caching */
  generateEtags: true,
  
  /* Experimental Features */
  experimental: {
    optimizePackageImports: ['@/components', '@/lib', 'lucide-react'],
    turbo: {
      root: process.cwd(),
    },
  },
  
  /* Production Optimization */
  productionBrowserSourceMaps: false,
  
  /* Compiler Options */
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
};

export default withBundleAnalyzer(nextConfig);
