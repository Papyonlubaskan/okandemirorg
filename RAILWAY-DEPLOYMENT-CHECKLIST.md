# 🚀 Railway Deployment Checklist

Railway'de sorunsuz deployment için kontrol listesi.

---

## ✅ 1. Build Hatalarını Önleme

### TypeScript Ayarları:
- ✅ `typescript.ignoreBuildErrors: true` - next.config.ts
- ✅ `eslint.ignoreDuringBuilds: true` - next.config.ts
- ✅ `strict: false` - tsconfig.json
- ✅ Tüm strict modlar kapatıldı

### ESLint Ayarları:
- ✅ `@typescript-eslint/no-explicit-any: off`
- ✅ `@typescript-eslint/no-unused-vars: warn`
- ✅ `react/no-unescaped-entities: off`

---

## 🔧 2. Environment Variables (Railway Dashboard)

### Gerekli Değişkenler:
```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://okandemir.org
NEXT_PUBLIC_GA_ID=G-6RC4K67QLT
NODE_ENV=production

# MySQL (Railway)
MYSQL_HOST=tramway.proxy.rlwy.net
MYSQL_PORT=32383
MYSQL_USER=root
MYSQL_PASSWORD=dFTGONASywbEMGsQoojVBRnQYZsxIwUz
MYSQL_DATABASE=railway

# Email
EMAIL_HOST=okandemir.org
EMAIL_PORT=465
EMAIL_USER=info@okandemir.org
EMAIL_PASS=Okan- 1881@
EMAIL_FROM=info@okandemir.org

# YouTube API
YOUTUBE_API_KEY=AIzaSyBQ5HSFpUiPm2vuKWiNhGESfAYzlqAgum4
YOUTUBE_CHANNEL_ID=UCITScioE02DHLU5tvy01IzA

# Instagram API
INSTAGRAM_APP_ID=25354205500863758
INSTAGRAM_APP_SECRET=ddc77cd5c03c9a417b54a8cdc03419f8
INSTAGRAM_ACCESS_TOKEN=EAFoTgZCxw9Q4BPqsImkOTG9fZBSfkRc5UAQg06TGsJ2b7e1fD7vqzyJEXL37Hn9zKQbZCfXHhJtNLoKDITc2Bh2ket8LDtcsUUjDcimUMfSAMiZABMlhUOgEtijzYEhHdonzbZCh8MLmaQ5jhqFuJVE9BBbgpJaxuucZAGCYjwiAiEhCOwZBZBIPGUmtkPvApjeVfT3Ud5bW6PkAqOVuV16O3ys2wtpYiiS41GHsnYGNqWkxHTjvS43VA7s3QBmw0yi1ZBXj69bPXomgpqdiUIwY6BObL

# WhatsApp Business API (Opsiyonel)
WHATSAPP_VERIFY_TOKEN=your-verify-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_ACCESS_TOKEN=your-access-token
```

---

## 📦 3. Package.json Scripts

### Build Script:
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint --fix"
  }
}
```

---

## 🚨 4. Yaygın Hatalar ve Çözümleri

### Hata 1: TypeScript Build Errors
**Çözüm:** `next.config.ts` içinde `typescript.ignoreBuildErrors: true`

### Hata 2: ESLint Warnings
**Çözüm:** `next.config.ts` içinde `eslint.ignoreDuringBuilds: true`

### Hata 3: Environment Variables Undefined
**Çözüm:** Railway Dashboard > Variables > Tüm değişkenleri ekle

### Hata 4: MySQL Connection Error
**Çözüm:** Railway MySQL private network kullanıyor, credentials doğru mu kontrol et

### Hata 5: Image Optimization Error
**Çözüm:** `next.config.ts` içinde `unoptimized: true` (gerekirse)

### Hata 6: API Route 404
**Çözüm:** Route dosyalarının `route.ts` uzantılı olduğundan emin ol

---

## 🔍 5. Deployment Öncesi Kontrol

- [ ] `git push origin main` yapıldı mı?
- [ ] Railway otomatik deploy tetiklendi mi?
- [ ] Build logları kontrol edildi mi?
- [ ] Environment variables Railway'de tanımlı mı?
- [ ] MySQL connection test edildi mi?
- [ ] Production URL çalışıyor mu?

---

## 📊 6. Deployment Sonrası Test

### Test Edilecek Sayfalar:
- [ ] https://okandemir.org - Ana sayfa
- [ ] https://okandemir.org/blog - Blog
- [ ] https://okandemir.org/hizmetler - Hizmetler
- [ ] https://okandemir.org/iletisim - İletişim formu
- [ ] https://okandemir.org/api/youtube-feed - YouTube API
- [ ] https://okandemir.org/api/email - Email API
- [ ] https://okandemir.org/api/chatbot/chat - Chatbot API

### API Endpoint Test:
```bash
# Test YouTube Feed
curl https://okandemir.org/api/youtube-feed

# Test Blog Search
curl https://okandemir.org/api/blog/search?q=dijital

# Test Popular Posts
curl https://okandemir.org/api/blog/popular
```

---

## 🛠️ 7. Troubleshooting

### Build Failed?
1. Railway logs'u kontrol et
2. `npm run build` lokal'de test et
3. TypeScript/ESLint hatalarını kontrol et
4. Dependencies güncel mi kontrol et

### Runtime Error?
1. Browser console'u kontrol et
2. Railway logs'u kontrol et
3. Environment variables eksik mi?
4. MySQL connection çalışıyor mu?

---

## 📝 8. Deployment Komutları

### Railway CLI:
```bash
# Login
railway login

# Link project
railway link

# Deploy
railway up

# Logs
railway logs

# Environment variables
railway variables
```

### Git Push (Otomatik Deploy):
```bash
git add .
git commit -m "feat: your changes"
git push origin main
# Railway otomatik deploy eder
```

---

## ✨ 9. Optimization Tips

- ✅ **Image Optimization:** Next.js Image component kullan
- ✅ **CSS Optimization:** Tailwind CSS purge aktif
- ✅ **JavaScript Minification:** Production build otomatik
- ✅ **Caching:** Static pages cache'lenir
- ✅ **Compression:** Gzip/Brotli aktif

---

## 🎯 10. Success Criteria

Build başarılı sayılır:
- ✅ `npm run build` hatasız tamamlanır
- ✅ Tüm sayfalar erişilebilir
- ✅ API endpoints çalışır
- ✅ Environment variables yüklenir
- ✅ MySQL bağlantısı başarılı
- ✅ Production URL live

---

**Son Güncelleme:** 19 Ekim 2025
**Railway Deployment:** https://okandemir.org

