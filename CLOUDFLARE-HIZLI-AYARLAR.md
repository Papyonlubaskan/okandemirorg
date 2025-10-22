# ⚡ Cloudflare Hızlı Ayarlar - Kopyala Yapıştır

## 🎯 1. RAILWAY CUSTOM DOMAIN
```
Railway Dashboard > Settings > Domains > + Custom Domain

Domain 1: okandemir.org
Domain 2: www.okandemir.org
```

---

## 🌐 2. CLOUDFLARE DNS KAYITLARI

### CNAME Kayıtları (Ekleyin)
```
Type: CNAME
Name: @
Content: [RAILWAY_DOMAIN].up.railway.app
Proxy: ✅ Proxied (Turuncu)
TTL: Auto
---
Type: CNAME
Name: www
Content: okandemir.org
Proxy: ✅ Proxied (Turuncu)
TTL: Auto
```

**Railway domain'i buraya yapıştırın:** ____________________________

---

## 🔒 3. CLOUDFLARE SSL AYARLARI

### SSL/TLS > Overview
```
Encryption mode: Full (strict) ✅
```

### SSL/TLS > Edge Certificates
```
✅ Always Use HTTPS: ON
✅ Automatic HTTPS Rewrites: ON
✅ Minimum TLS Version: 1.2
✅ TLS 1.3: ON
✅ Opportunistic Encryption: ON
```

---

## ⚡ 4. CLOUDFLARE SPEED AYARLARI

### Speed > Optimization
```
✅ Auto Minify:
   ☑ JavaScript
   ☑ CSS
   ☑ HTML

✅ Brotli: ON
✅ Early Hints: ON
✅ Rocket Loader: OFF (Next.js ile çakışır)
```

### Caching > Configuration
```
Caching Level: Standard
Browser Cache TTL: 4 hours
```

---

## 🛡️ 5. CLOUDFLARE GÜVENLİK AYARLARI

### Security > Settings
```
Security Level: Medium
Challenge Passage: 30 minutes
```

### Security > Bots
```
✅ Bot Fight Mode: ON
✅ Super Bot Fight Mode: OFF (ücretli)
```

---

## 🔄 6. CLOUDFLARE PAGE RULES (OPSİYONEL)

### www → non-www Redirect
```
URL pattern: www.okandemir.org/*
Setting: Forwarding URL
Status code: 301 - Permanent Redirect
Destination: https://okandemir.org/$1
```

---

## 📊 7. RAILWAY ENVIRONMENT VARIABLES

```env
NEXT_PUBLIC_SITE_URL=https://okandemir.org
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

**Mevcut variables'ları koruyun, sadekle yukarıdakileri ekleyin!**

---

## ✅ 8. TEST KONTROL LİSTESİ

### DNS Test
```
nslookup okandemir.org
# Result: Railway IP veya CNAME görünmeli
```

### Site Test
```
✅ https://okandemir.org
✅ https://www.okandemir.org
✅ http://okandemir.org (HTTPS'e redirect)
✅ http://www.okandemir.org (HTTPS'e redirect)
```

### SSL Test
```
https://www.ssllabs.com/ssltest/analyze.html?d=okandemir.org
Rating: A veya A+
```

### Speed Test
```
https://pagespeed.web.dev/
URL: https://okandemir.org
Score: 90+ olmalı
```

---

## ⏱️ BEKLEME SÜRELERİ

- **Railway Custom Domain:** 2-5 dakika
- **Cloudflare DNS:** 5-30 dakika
- **SSL Sertifika:** 5-15 dakika
- **Full Propagation:** 24 saat (genelde 1 saat)

---

## 🚨 ACİL SORUN GİDERME

### Site Açılmıyor
1. Railway deployment çalışıyor mu? ✅
2. Cloudflare DNS doğru mu? ✅
3. SSL mode Full (strict) mi? ✅
4. 15 dakika bekledin mi? ✅

### SSL Hatası
1. Cloudflare SSL: Full (strict) ✅
2. Railway SSL: Active ✅
3. 15 dakika bekle

### 521/522 Error
1. Railway logs kontrol et
2. Environment variables kontrol et
3. Redeploy yap

---

**Hızlı ve Kolay! 🎉**

