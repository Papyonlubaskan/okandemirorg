// Performance Configuration
// Bu dosya sayfa yükleme performansını optimize eder

export const PERFORMANCE_CONFIG = {
  // Prefetch öncelikleri
  prefetch: {
    priority: 'high' as const,
    links: [
      '/',
      '/hizmetler',
      '/projeler',
      '/hakkimda',
      '/iletisim',
    ],
  },
  
  // DNS prefetch
  dnsPrefetch: [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://i.ytimg.com',
    'https://yt3.ggpht.com',
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com',
  ],
  
  // Preconnect
  preconnect: [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ],
  
  // Lazy load thresholds
  lazyLoad: {
    rootMargin: '50px',
    threshold: 0.01,
  },
  
  // Cache durations (seconds)
  cache: {
    static: 31536000, // 1 year
    dynamic: 3600, // 1 hour
    api: 300, // 5 minutes
  },
}

export default PERFORMANCE_CONFIG

