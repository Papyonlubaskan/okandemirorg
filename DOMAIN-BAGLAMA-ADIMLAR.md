# 🌐 okandemir.org Domain Bağlama - Adım Adım Kılavuz

## 📋 ÖN HAZIRLIK

### Elinizde Olması Gerekenler:
- ✅ Railway hesabı ve deploy edilmiş proje
- ✅ Cloudflare hesabı
- ✅ okandemir.org domain Cloudflare'de kayıtlı
- ✅ MySQL database bilgileri
- ✅ Email şifresi (info@okandemir.org)

---

## 🚀 ADIM 1: RAILWAY'DE DEPLOYMENT KONTROL

### 1.1 Railway Dashboard
```
1. https://railway.app/dashboard açın
2. "okandemirorg" projenizi seçin
3. Son deployment başarılı mı kontrol edin (yeşil ✓)
```

### 1.2 Logs Kontrol
```
1. Projeniz > "Deployments" sekmesi
2. En son deployment'a tıklayın
3. "View Logs" ile hata var mı kontrol edin
```

### 1.3 Railway URL'i Test Edin
```
1. Projeniz > "Settings" > "Domains"
2. Railway otomatik domain'i göreceksiniz:
   Örnek: okandemirorg-production-XXXX.up.railway.app
3. Bu URL'i tarayıcıda açın
4. Site çalışıyor mu kontrol edin ✅
```

**⚠️ ÖNEMLI:** Railway URL çalışmıyorsa, domain bağlamaya geçmeyin!

---

## 🌐 ADIM 2: RAILWAY'DE CUSTOM DOMAIN EKLEME

### 2.1 Custom Domain Ekle
```
1. Railway Dashboard > Projeniz > "Settings"
2. "Domains" bölümüne inin
3. "+ Custom Domain" butonuna tıklayın
4. "okandemir.org" yazın
5. "Add Domain" tıklayın
```

### 2.2 DNS Kayıt Bilgilerini Alın
Railway size gösterecek:
```
✅ CNAME Record
   Host: @
   Value: okandemirorg-production-XXXX.up.railway.app
```

**Bu bilgiyi not alın! Cloudflare'de kullanacaksınız.**

---

## ☁️ ADIM 3: CLOUDFLARE DNS AYARLARI

### 3.1 Cloudflare Dashboard
```
1. https://dash.cloudflare.com açın
2. "okandemir.org" domain'ine tıklayın
3. Sol menüden "DNS" > "Records" seçin
```

### 3.2 Eski Kayıtları Temizle (Varsa)
```
1. "@" veya "okandemir.org" için olan A/CNAME kayıtlarını bulun
2. Yanındaki "..." > "Delete" ile silin
3. "www" için olan kayıtları da silin (varsa)
```

### 3.3 Yeni CNAME Kayıtları Ekle

#### Root Domain (@)
```
Type: CNAME
Name: @ 
Content: okandemirorg-production-XXXX.up.railway.app
         (Railway'den kopyaladığınız domain)
Proxy status: ✅ Proxied (turuncu bulut)
TTL: Auto
```

**"Save" tıklayın**

#### www Subdomain
```
Type: CNAME
Name: www
Content: okandemir.org
Proxy status: ✅ Proxied (turuncu bulut)
TTL: Auto
```

**"Save" tıklayın**

### 3.4 DNS Kayıtları Kontrol
Şu kayıtları görmelisiniz:
```
✅ CNAME | @ | okandemirorg-production-XXXX.up.railway.app | Proxied
✅ CNAME | www | okandemir.org | Proxied
```

---

## 🔒 ADIM 4: CLOUDFLARE SSL/TLS AYARLARI

### 4.1 SSL/TLS Mode
```
1. Sol menü > "SSL/TLS" > "Overview"
2. Encryption mode seçin: "Full (strict)" ✅
```

**⚠️ DİKKAT:** 
- "Flexible" seçmeyin (güvensiz)
- "Full (strict)" en güvenli seçenek

### 4.2 Edge Certificates
```
1. "SSL/TLS" > "Edge Certificates"
2. Aşağıdaki ayarları AÇIN:
   ✅ Always Use HTTPS
   ✅ Automatic HTTPS Rewrites
   ✅ Minimum TLS Version: 1.2
   ✅ Opportunistic Encryption
   ✅ TLS 1.3
```

### 4.3 Universal SSL
```
1. "SSL/TLS" > "Edge Certificates"
2. "Universal SSL" altında:
   Status: Active ✅ (yeşil)
```

**Eğer "Initializing" görüyorsanız, 15 dakika bekleyin.**

---

## ⚙️ ADIM 5: RAILWAY ENVIRONMENT VARIABLES

### 5.1 Variables Güncelle
```
1. Railway Dashboard > Projeniz > "Variables"
2. Şu değişkeni ekleyin/güncelleyin:

NEXT_PUBLIC_SITE_URL=https://okandemir.org
```

### 5.2 Tüm Variables Listesi
```env
DATABASE_URL=mysql://root:PASSWORD@HOST:PORT/railway
MYSQL_HOST=tramway.proxy.rlwy.net
MYSQL_PORT=32383
MYSQL_USER=root
MYSQL_PASSWORD=dFTGoNAsywbEMGsQoojVBRnQYZsxIwUz
MYSQL_DATABASE=railway
EMAIL_HOST=okandemir.org
EMAIL_PORT=465
EMAIL_USER=info@okandemir.org
EMAIL_PASSWORD=Okan- 1881@ 
YOUTUBE_CHANNEL_ID=UCITScioEO2DHLU5tvy01IzA
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_SITE_URL=https://okandemir.org
```

### 5.3 Redeploy
```
1. Variables değiştirdikten sonra
2. Railway otomatik redeploy yapacak
3. Deployment logs takip edin
4. Başarılı olması gerekiyor ✅
```

---

## 🔄 ADIM 6: CLOUDFLARE PAGE RULES (OPSİYONEL)

### 6.1 www Redirect Oluştur
```
1. Cloudflare > "Rules" > "Page Rules"
2. "Create Page Rule" tıklayın
3. Ayarlar:
   URL pattern: www.okandemir.org/*
   Setting: Forwarding URL
   Status code: 301 - Permanent Redirect
   Destination URL: https://okandemir.org/$1
4. "Save and Deploy"
```

**Sonuç:** www.okandemir.org → okandemir.org redirect

---

## ⚡ ADIM 7: CLOUDFLARE PERFORMANS ARTIRMA

### 7.1 Auto Minify
```
1. "Speed" > "Optimization"
2. Auto Minify aktif et:
   ✅ JavaScript
   ✅ CSS
   ✅ HTML
```

### 7.2 Brotli Compression
```
1. "Speed" > "Optimization"
2. "Brotli": ON ✅
```

### 7.3 Early Hints
```
1. "Speed" > "Optimization"
2. "Early Hints": ON ✅
```

### 7.4 Caching Level
```
1. "Caching" > "Configuration"
2. "Caching Level": Standard
3. "Browser Cache TTL": 4 hours
```

---

## 🛡️ ADIM 8: GÜVENLİK AYARLARI

### 8.1 Security Level
```
1. "Security" > "Settings"
2. "Security Level": Medium
```

### 8.2 Bot Protection
```
1. "Security" > "Bots"
2. "Bot Fight Mode": ON ✅
```

### 8.3 Always Use HTTPS
```
1. "SSL/TLS" > "Edge Certificates"
2. "Always Use HTTPS": ON ✅
```

---

## ✅ ADIM 9: TEST VE DOĞRULAMA

### 9.1 DNS Propagation Test
```bash
# Windows Command Prompt veya PowerShell:
nslookup okandemir.org
nslookup www.okandemir.org
```

Veya online:
- https://dnschecker.org
- "okandemir.org" yazın
- Tüm lokasyonlarda Railway IP/domain görünmeli

### 9.2 Site Test
Tarayıcıda test edin:
```
✅ https://okandemir.org → Açılmalı
✅ https://www.okandemir.org → Açılmalı veya redirect
✅ http://okandemir.org → https'e redirect olmalı
✅ http://www.okandemir.org → https'e redirect olmalı
```

### 9.3 SSL Test
```
1. https://www.ssllabs.com/ssltest/
2. "okandemir.org" test edin
3. A veya A+ rating almalısınız
```

### 9.4 Performance Test
```
1. https://pagespeed.web.dev/
2. "https://okandemir.org" test edin
3. Mobile ve Desktop skorları kontrol edin
```

### 9.5 Fonksiyonellik Test
```
✅ İletişim formu çalışıyor mu?
✅ Newsletter subscription çalışıyor mu?
✅ WhatsApp butonu çalışıyor mu?
✅ YouTube feed yükleniyor mu?
✅ Tüm sayfalar açılıyor mu?
```

---

## 🎯 ADIM 10: RAILWAY'DEN ÇIKIŞ (İLERİDE)

### Neden Çıkmak İsteyebilirsiniz?
- Daha ucuz alternatif buldunuz
- Daha fazla kontrol istiyorsunuz
- Kendi sunucunuza geçmek istiyorsunuz

### Çıkış Öncesi Yedek Alın
```bash
# 1. Veritabanı yedeği
# Railway MySQL'den export alın

# 2. Kod yedeği (zaten GitHub'da)
git pull origin main

# 3. Environment variables yedeği
# railway-env-template.txt dosyasını kaydedin
```

### Alternatif Platformlar

#### A) Vercel (ÖNERİLEN - Next.js için)
```bash
# Kurulum
npm install -g vercel

# Deploy
vercel login
vercel --prod

# Domain
# Vercel dashboard'da domain ekle
# Cloudflare DNS'i Vercel'e yönlendir
```

#### B) Netlify
```bash
# Static export gerekli
# next.config.ts > output: 'export'
netlify deploy --prod
```

#### C) VPS/Sunucu (Full Control)
```bash
# 1. VPS kiralayın (DigitalOcean, Hetzner)
# 2. Docker ile deploy edin
# 3. Nginx reverse proxy kurun
# 4. PM2 ile process yönetimi
```

#### D) AWS/Azure (Enterprise)
- AWS Amplify
- Azure App Service
- Daha pahalı ama daha güçlü

---

## 🔧 SORUN GİDERME

### Sorun 1: "DNS_PROBE_FINISHED_NXDOMAIN"
**Çözüm:**
- DNS henüz yayılmamış
- 5 dakika - 24 saat bekleyin
- `ipconfig /flushdns` (Windows)

### Sorun 2: "ERR_SSL_VERSION_OR_CIPHER_MISMATCH"
**Çözüm:**
- Cloudflare SSL mode: Full (strict) yapın
- Railway SSL sertifikası hazır olmalı (15 dk bekleyin)

### Sorun 3: "521 Web Server Is Down"
**Çözüm:**
- Railway deployment çalışmıyor
- Railway logs kontrol edin
- Yeniden deploy edin

### Sorun 4: "525 SSL Handshake Failed"
**Çözüm:**
- Cloudflare SSL/TLS mode kontrol edin
- Railway custom domain doğru mu kontrol edin

### Sorun 5: Site Yavaş
**Çözüm:**
- Cloudflare caching aktif mi?
- Auto Minify açık mı?
- Brotli compression aktif mi?

---

## 📊 RAILWAY MALIYET OPTIMIZASYONU

### Free Tier Limitler
- **$5/month** ücretsiz kredi
- **500 saat** çalışma süresi
- Küçük projeler için yeterli

### Maliyet Azaltma
```
1. Kullanılmayan service'leri durdurun
2. Deployment sayısını azaltın
3. Auto-deploy'u gerekmedikçe kapatın
```

---

## 🎉 BAŞARIYLA TAMAMLANDI!

Site artık canlı:
- ✅ https://okandemir.org
- ✅ SSL sertifikası aktif
- ✅ Cloudflare CDN ve güvenlik aktif
- ✅ Railway backend çalışıyor
- ✅ MySQL database bağlı
- ✅ Email sistemi çalışıyor

---

## 📞 DESTEK

Railway Support: https://railway.app/help
Cloudflare Support: https://dash.cloudflare.com

**Kolay gelsin! 🚀**

