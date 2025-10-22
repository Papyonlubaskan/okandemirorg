# 🚀 Railway Deployment Rehberi

Bu döküman, Okan Demir portfolio sitesini Railway'de deploy etmek için adım adım talimatları içerir.

## 📋 Ön Hazırlık

### ✅ Tamamlanmış Adımlar:
1. ✅ GitHub repository oluşturuldu
2. ✅ Tüm kod GitHub'a push edildi
3. ✅ Build testi başarılı (34 sayfa)
4. ✅ Dockerfile hazır
5. ✅ Prisma migrations hazır

---

## 🚂 Railway Deployment Adımları

### 1. Railway'de Proje Oluşturma

1. **Railway.app**'e gidin: https://railway.app
2. **"New Project"** butonuna tıklayın
3. **"Deploy from GitHub repo"** seçin
4. **"Papyonlubaskan/okandemirorg"** repository'yi seçin
5. **"Deploy Now"** tıklayın

### 2. Environment Variables Ekleme

Railway dashboard'da **"Variables"** sekmesine gidin ve şu değişkenleri ekleyin:

#### Temel Değişkenler (Zorunlu)
```bash
DATABASE_URL=file:./prisma/dev.db
NEXT_TELEMETRY_DISABLED=1
NODE_ENV=production
```

#### Email Ayarları (İsteğe Bağlı - İletişim formu için)
```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=info@okandemir.org
EMAIL_PASS=your-gmail-app-password
EMAIL_PASSWORD=your-gmail-app-password
```

> **NOT:** Gmail App Password almak için:
> 1. Google Account → Security → 2-Step Verification (aktif olmalı)
> 2. App passwords → Generate → Mail → Other (Custom name)
> 3. "Railway" yazıp 16 karakterlik şifreyi alın

### 3. Build Ayarları

Railway otomatik olarak `Dockerfile`'ı algılayacak ve kullanacak.

**Build Command:** Otomatik (Dockerfile)
**Start Command:** Otomatik (Dockerfile)

### 4. Domain Ayarları

#### Railway Domain (Otomatik)
Deploy sonrası otomatik olarak şu şekilde bir URL alacaksınız:
```
https://okandemirorg-production.up.railway.app
```

#### Custom Domain (okandemir.org)

1. **Railway Dashboard → Settings → Domains**
2. **"Custom Domain"** butonuna tıklayın
3. **"okandemir.org"** yazın
4. Railway size DNS kayıtları verecek

**Domain Provider'da (Namecheap/GoDaddy/vs.) DNS Ayarları:**

```
Type: CNAME
Name: @
Value: [Railway'den aldığınız CNAME değeri]
TTL: Auto

Type: CNAME  
Name: www
Value: [Railway'den aldığınız CNAME değeri]
TTL: Auto
```

> **NOT:** DNS yayılması 1-48 saat sürebilir (genelde 1-2 saat)

### 5. SSL Sertifikası

Railway otomatik olarak Let's Encrypt SSL sertifikası oluşturur.
- Custom domain ekledikten sonra otomatik aktif olur
- Hiçbir şey yapmanıza gerek yok

---

## 🔍 Deployment Sonrası Kontroller

### 1. Site Erişimi
```
✅ https://okandemirorg-production.up.railway.app
✅ https://okandemir.org (DNS yayıldıktan sonra)
```

### 2. Test Edilmesi Gerekenler

**Public Sayfalar:**
- [ ] `/` - Ana sayfa
- [ ] `/hakkimda` - Hakkımda
- [ ] `/hizmetler` - Hizmetler
- [ ] `/projeler` - 3D Portfolio
- [ ] `/iletisim` - İletişim formu
- [ ] `/survey` - Müşteri anketi

**Admin Dashboards:**
- [ ] `/admin` - Ana kontrol paneli
- [ ] `/admin/dashboard` - AI Müşteri Analizi
- [ ] `/admin/analytics` - Canlı Performans
- [ ] `/admin/seo` - SEO Analiz
- [ ] `/admin/surveys` - Anket Sonuçları
- [ ] `/admin/projects` - Proje Yönetimi
- [ ] `/admin/builder` - Landing Page Builder

**PWA Özellikleri:**
- [ ] Service Worker aktif mi?
- [ ] Install prompt çalışıyor mu?
- [ ] Offline page görünüyor mu?
- [ ] Manifest.json yükleniyor mu?

**WhatsApp Chatbot:**
- [ ] Floating button görünüyor mu?
- [ ] Chat bubble açılıyor mu?
- [ ] Mesaj gönderimi çalışıyor mu?

**İletişim Formu:**
- [ ] Form gönderimi çalışıyor mu?
- [ ] AI analiz yapılıyor mu?
- [ ] Email gidiyor mu?

---

## 🐛 Sorun Giderme

### Build Hatası
```bash
# Yerel olarak test edin
npm run build

# Eğer başarılı ise, Railway'de "Redeploy" yapın
```

### Database Hatası
```bash
# Railway logs kontrol edin
# Prisma generate çalıştığından emin olun
```

### Email Hatası
```bash
# EMAIL_PASSWORD ve EMAIL_PASS değişkenlerini kontrol edin
# Gmail App Password doğru mu?
```

### 500 Internal Server Error
```bash
# Railway logs kontrol edin
# Prisma Client generate edildi mi?
# Environment variables doğru mu?
```

---

## 📊 Deployment Başarı Kriterleri

✅ Build başarılı (exit code 0)
✅ 34 sayfa oluşturuldu
✅ SSL sertifikası aktif
✅ Custom domain çalışıyor
✅ Tüm API endpoints yanıt veriyor
✅ PWA install prompt görünüyor
✅ WhatsApp chatbot aktif
✅ Analytics tracking çalışıyor
✅ İletişim formu email gönderiyor
✅ Admin dashboards erişilebilir

---

## 🎯 Production Checklist

- [ ] Railway'de deploy tamamlandı
- [ ] Custom domain eklendi
- [ ] DNS kayıtları eklendi
- [ ] SSL sertifikası aktif
- [ ] Environment variables ayarlandı
- [ ] Email testi yapıldı
- [ ] Tüm sayfalar test edildi
- [ ] Admin dashboards test edildi
- [ ] Mobile responsive kontrol edildi
- [ ] PWA install test edildi
- [ ] Analytics çalışıyor
- [ ] SEO metadata kontrol edildi

---

## 📞 Destek

Deployment sırasında sorun yaşarsanız:
- Railway logs'ları kontrol edin
- Build output'u inceleyin
- Environment variables'ları doğrulayın

**İletişim:** info@okandemir.org

