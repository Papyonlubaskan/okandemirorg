# ⚡ Performance Optimizasyonları

Proje performans metrikleri ve optimizasyon stratejileri.

---

## 📊 Mevcut Performans

### Lighthouse Scores (Hedef)

| Metrik | Hedef | Açıklama |
|--------|-------|----------|
| Performance | 95+ | Sayfa yükleme hızı |
| Accessibility | 100 | Erişilebilirlik |
| Best Practices | 100 | En iyi pratikler |
| SEO | 100 | Arama motoru optimizasyonu |

---

## 🚀 Yapılan Optimizasyonlar

### 1. Image Optimization

**next.config.ts:**
```typescript
images: {
  formats: ['image/avif', 'image/webp'],
  minimumCacheTTL: 31536000, // 1 yıl
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
```

**Kullanım:**
```tsx
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  priority // LCP için kritik resimler
  placeholder="blur"
/>
```

---

### 2. Font Optimization

**app/layout.tsx:**
```typescript
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // FOUT önleme
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
  adjustFontFallback: true,
})
```

---

### 3. Code Splitting

**Otomatik (Next.js):**
- Her route otomatik split
- Dynamic imports

**Manuel:**
```tsx
import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(() => import('@/components/Heavy'), {
  loading: () => <LoadingSpinner />,
  ssr: false, // Client-side only
})
```

---

### 4. Bundle Optimization

**next.config.ts:**
```typescript
experimental: {
  optimizePackageImports: ['@/components', '@/lib', 'lucide-react'],
}

compiler: {
  removeConsole: process.env.NODE_ENV === 'production' ? {
    exclude: ['error', 'warn'],
  } : false,
}
```

**Bundle Analizi:**
```bash
npm run build:analyze
```

---

### 5. Caching Strategy

**middleware.ts:**
```typescript
// Static assets - 1 yıl
if (request.nextUrl.pathname.startsWith('/_next/static')) {
  response.headers.set(
    'Cache-Control',
    'public, max-age=31536000, immutable'
  )
}

// Pages - 1 saat + stale-while-revalidate
response.headers.set(
  'Cache-Control',
  'public, s-maxage=3600, stale-while-revalidate=86400'
)
```

---

### 6. Database Optimization

**lib/mysql.ts:**
```typescript
const pool = mysql.createPool({
  connectionLimit: 10, // Max connections
  queueLimit: 0, // Unlimited queue
  waitForConnections: true,
})
```

**Best Practices:**
- Connection pooling kullanın
- Prepared statements (SQL injection önleme)
- Index'ler ekleyin
- N+1 query'leri önleyin

---

### 7. API Route Optimization

```typescript
// Edge Runtime (daha hızlı)
export const runtime = 'edge'

// Revalidate (ISR)
export const revalidate = 3600 // 1 saat

// Dynamic rendering kontrolü
export const dynamic = 'force-static'
```

---

### 8. Critical CSS

**app/critical.css:**
```css
/* Above-the-fold kritik stiller */
/* Satır içi yüklenir, render blocking önler */
```

**app/layout.tsx:**
```tsx
import './critical.css'
```

---

## 📈 Web Vitals Hedefleri

### Core Web Vitals

| Metrik | Hedef | Açıklama |
|--------|-------|----------|
| LCP (Largest Contentful Paint) | < 2.5s | En büyük içerik yükleme |
| FID (First Input Delay) | < 100ms | İlk etkileşim gecikmesi |
| CLS (Cumulative Layout Shift) | < 0.1 | Düzen kayması |

### Diğer Metrikler

| Metrik | Hedef | Açıklama |
|--------|-------|----------|
| FCP (First Contentful Paint) | < 1.8s | İlk içerik gösterimi |
| TTFB (Time to First Byte) | < 600ms | Sunucu yanıt süresi |
| TBT (Total Blocking Time) | < 200ms | Toplam engelleme süresi |
| SI (Speed Index) | < 3.4s | Hız indeksi |

---

## 🔧 Performance Monitoring

### 1. Next.js Analytics

```tsx
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

### 2. Web Vitals Reporting

```tsx
// app/layout.tsx
export function reportWebVitals(metric) {
  console.log(metric)
  
  // Google Analytics'e gönder
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_label: metric.id,
      non_interaction: true,
    })
  }
}
```

---

## ⚙️ Optimizasyon Checklist

### Images
- [ ] WebP/AVIF formatı kullan
- [ ] Uygun boyutlarda resize et
- [ ] Lazy loading (priority olmayan)
- [ ] Blur placeholder ekle
- [ ] Alt text ekle

### Fonts
- [ ] Font subsetting
- [ ] Font display: swap
- [ ] Preload kritik fontlar
- [ ] System font fallback

### JavaScript
- [ ] Code splitting
- [ ] Tree shaking
- [ ] Dynamic imports
- [ ] Remove unused code
- [ ] Minify production build

### CSS
- [ ] Tailwind purge aktif
- [ ] Critical CSS inline
- [ ] Remove unused styles
- [ ] CSS minification

### Network
- [ ] HTTP/2 kullan
- [ ] Compression (gzip/brotli)
- [ ] CDN kullan (Cloudflare)
- [ ] Cache headers doğru
- [ ] Prefetch/preload

### Database
- [ ] Connection pooling
- [ ] Query optimization
- [ ] Index'ler ekle
- [ ] N+1 problem çöz

---

## 🎯 Performance Budget

### Bundle Size Limitleri

```json
{
  "budgets": [
    {
      "page": "/_app",
      "limit": "200kb"
    },
    {
      "page": "/blog/*",
      "limit": "150kb"
    },
    {
      "asset": "*.js",
      "limit": "100kb"
    },
    {
      "asset": "*.css",
      "limit": "50kb"
    }
  ]
}
```

---

## 🔍 Performance Testing

### 1. Lighthouse CI

```bash
npm install -g @lhci/cli

# Test çalıştır
lhci autorun --collect.url=http://localhost:3000
```

### 2. WebPageTest

```
https://www.webpagetest.org/
URL: https://okandemir.org
Location: Frankfurt, Germany
Browser: Chrome
```

### 3. PageSpeed Insights

```
https://pagespeed.web.dev/
URL: https://okandemir.org
```

---

## 📱 Mobile Optimization

- [ ] Mobile-first design
- [ ] Touch-friendly (44x44px minimum)
- [ ] Viewport meta tag
- [ ] Responsive images
- [ ] Reduce network requests
- [ ] Optimize font loading

---

## 🌐 CDN & Caching

### Cloudflare Settings

```
Auto Minify: HTML, CSS, JS
Brotli: Enabled
HTTP/2: Enabled
HTTP/3: Enabled
Cache Level: Standard
Browser Cache TTL: 1 year
```

---

## 📊 Monitoring Tools

1. **Google Analytics** - User behavior
2. **Cloudflare Analytics** - Network performance
3. **Railway Metrics** - Server performance
4. **Sentry** (optional) - Error tracking
5. **LogRocket** (optional) - Session replay

---

## 🚀 Next Steps

1. Lighthouse audit yap
2. Performance budget belirle
3. CI/CD'ye performance tests ekle
4. Real User Monitoring (RUM) ekle
5. A/B testing için hazırla

---

**Performance Tracking:**
```bash
# Build size kontrol
npm run build
du -sh .next

# Bundle analizi
npm run build:analyze
```

