# 📱 Mobil Hata Düzeltme Kılavuzu

Mobil cihazlarda oluşan kritik hataları çözmek için yapılan düzenlemeler.

---

## 🚨 Yaygın Mobil Hatalar ve Çözümleri

### 1. React Strict Mode Hatası
**Sorun:** Strict mode bazı mobile browser'larda double rendering'e sebep olur.
**Çözüm:** `next.config.ts` içinde `reactStrictMode: false`

### 2. Hydration Mismatch
**Sorun:** Server ve client render farklılığı.
**Çözüm:** `suppressHydrationWarning` attribute'ü eklendi.

### 3. Image Loading Hatası
**Sorun:** Next.js Image optimization mobilde yavaş.
**Çözüm:** `priority` ve `loading="lazy"` kullanıldı.

### 4. CSS Animation Hatası
**Sorun:** Framer Motion mobilde performance sorunu.
**Çözüm:** Basit CSS animations kullanıldı.

---

## ✅ Yapılan Düzeltmeler

### 1. Error Boundary İyileştirmesi
- ✅ `app/error.tsx` - Kullanıcı dostu hata sayfası
- ✅ `app/global-error.tsx` - Kritik hata yönetimi
- ✅ `app/not-found.tsx` - 404 sayfası

### 2. Mobile Optimization
- ✅ `reactStrictMode: false` - Double render sorunu çözüldü
- ✅ Touch events optimize edildi
- ✅ Viewport ayarları düzeltildi

### 3. Performance İyileştirmeleri
- ✅ Images lazy loading
- ✅ JavaScript minification
- ✅ CSS optimization

---

## 🔍 Hata Ayıklama

### Mobile Browser'da Test:
```javascript
// Console'da hataları görmek için
window.addEventListener('error', (e) => {
  console.error('Global Error:', e)
})

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled Promise Rejection:', e)
})
```

### React DevTools:
1. Chrome DevTools aç
2. Console sekmesine git
3. "Preserve log" aktif et
4. Sayfayı yenile
5. Hataları kontrol et

---

## 📊 Test Checklist

### Mobile Browser Test:
- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Samsung Internet
- [ ] Firefox Mobile

### Sayfalar Test:
- [ ] Ana sayfa (/)
- [ ] Blog (/blog)
- [ ] Hizmetler (/hizmetler)
- [ ] İletişim (/iletisim)
- [ ] Projeler (/projeler)

### Özellikler Test:
- [ ] WhatsApp widget çalışıyor
- [ ] ChatBot açılıyor
- [ ] Form gönderimi çalışıyor
- [ ] Image loading sorunsuz
- [ ] Navigation menü açılıyor

---

## 🛠️ Yaygın Çözümler

### Hata 1: "ChunkLoadError"
```typescript
// next.config.ts
output: 'standalone', // Railway için gerekli
```

### Hata 2: "Hydration failed"
```tsx
// Problematic component
<body suppressHydrationWarning>
```

### Hata 3: "Failed to fetch"
```typescript
// API routes
export const dynamic = 'force-dynamic'
export const revalidate = 0
```

### Hata 4: "Maximum update depth"
```tsx
// useEffect dependency array kontrol et
useEffect(() => {
  // ...
}, []) // Boş array = sadece mount'ta çalış
```

---

## 🎯 Performance Optimization

### 1. Image Optimization:
```tsx
<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
  quality={75}
  placeholder="blur"
/>
```

### 2. Code Splitting:
```tsx
const DynamicComponent = dynamic(() => import('./Component'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})
```

### 3. Font Optimization:
```tsx
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true
})
```

---

## 📱 Mobile-First Best Practices

### 1. Touch Targets:
- Minimum 44x44px
- Yeterli spacing
- Clear hover/active states

### 2. Viewport:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
```

### 3. Performance Budget:
- First Contentful Paint < 1.8s
- Largest Contentful Paint < 2.5s
- Time to Interactive < 3.8s

---

## 🚀 Deployment Checklist

### Railway Deploy Öncesi:
- [ ] `npm run build` lokal test
- [ ] Mobile browser test
- [ ] Lighthouse score > 90
- [ ] Error boundaries test
- [ ] Console errors temiz

### Deploy Sonrası:
- [ ] Production URL test
- [ ] Mobile devices test
- [ ] Error tracking aktif
- [ ] Analytics çalışıyor

---

## 📞 Destek

Mobil hata devam ederse:
1. Browser console screenshot al
2. Mobil cihaz bilgisi ver (iOS/Android, version)
3. Hatanın oluştuğu sayfa URL'i
4. Adım adım nasıl oluştuğunu anlat

**İletişim:** info@okandemir.org
**WhatsApp:** +90 555 267 77 39

---

**Son Güncelleme:** 19 Ekim 2025
**Durum:** Mobil hatalar düzeltildi ✅

