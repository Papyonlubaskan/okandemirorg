# 🌐 Cloudflare + Railway Domain Kurulum Kılavuzu

## 📋 Genel Bakış
Bu kılavuz, Railway'de deploy edilmiş Next.js projenizi Cloudflare üzerinden `okandemir.org` domain'ine nasıl bağlayacağınızı gösterir.

---

## 🚀 ADIM 1: Railway'de Proje Hazırlığı

### 1.1 Railway Dashboard'a Giriş
1. https://railway.app adresine git
2. Projenizi seç (`okandemirorg`)

### 1.2 Railway Domain Bilgisini Al
1. Proje > **Settings** > **Domains**
2. Railway'in size verdiği domain'i not al (örn: `your-project.up.railway.app`)
3. Bu domain'i test et (açılıyor mu kontrol et)

### 1.3 Environment Variables Kontrol
```
✅ DATABASE_URL
✅ MYSQL_HOST
✅ MYSQL_PORT
✅ MYSQL_USER
✅ MYSQL_PASSWORD
✅ MYSQL_DATABASE
✅ EMAIL_PASSWORD
✅ YOUTUBE_API_KEY (opsiyonel)
✅ YOUTUBE_CHANNEL_ID (opsiyonel)
```

**ÖNEMLİ:** Şu değişkeni ekle:
```
NEXT_PUBLIC_SITE_URL=https://okandemir.org
```

---

## 🌐 ADIM 2: Cloudflare DNS Ayarları

### 2.1 Cloudflare Dashboard'a Giriş
1. https://dash.cloudflare.com adresine git
2. `okandemir.org` domain'ini seç

### 2.2 DNS Kayıtlarını Ekle

#### A) CNAME Kaydı (ÖNERİLEN)
```
Type: CNAME
Name: @ (veya root)
Target: your-project.up.railway.app
Proxy status: Proxied (Turuncu bulut - ✅)
TTL: Auto
```

#### B) www CNAME Kaydı
```
Type: CNAME
Name: www
Target: your-project.up.railway.app
Proxy status: Proxied (Turuncu bulut - ✅)
TTL: Auto
```

**NOT:** Eğer CNAME @ çalışmazsa, aşağıdaki A Record yöntemini kullan.

---

## 🔧 ADIM 3: Railway'de Custom Domain Ekleme

### 3.1 Custom Domain Ekle
1. Railway Dashboard > Projeniz > **Settings**
2. **Domains** bölümüne git
3. **+ Custom Domain** butonuna tıkla
4. `okandemir.org` yaz
5. **Add Domain** tıkla

### 3.2 www Alt Domain Ekle
1. Aynı şekilde `www.okandemir.org` ekle
2. Railway otomatik SSL sertifikası oluşturacak

### 3.3 Doğrulama
Railway size DNS kayıtlarını gösterecek:
```
CNAME: okandemir.org → your-project.up.railway.app
CNAME: www.okandemir.org → your-project.up.railway.app
```

---

## ⚙️ ADIM 4: Cloudflare SSL/TLS Ayarları

### 4.1 SSL/TLS Encryption Mode
1. Cloudflare > **SSL/TLS** > **Overview**
2. Encryption mode: **Full (strict)** seç
   - ❌ Flexible (güvensiz)
   - ❌ Full (orta)
   - ✅ **Full (strict)** (en güvenli)

### 4.2 Edge Certificates
1. **SSL/TLS** > **Edge Certificates**
2. **Always Use HTTPS**: ON
3. **Automatic HTTPS Rewrites**: ON
4. **Minimum TLS Version**: TLS 1.2

---

## 🔄 ADIM 5: Cloudflare Page Rules (Opsiyonel)

### 5.1 www → non-www Redirect
1. **Rules** > **Page Rules**
2. **Create Page Rule**
```
URL: www.okandemir.org/*
Setting: Forwarding URL
Status Code: 301 (Permanent Redirect)
Destination: https://okandemir.org/$1
```

---

## ⚡ ADIM 6: Cloudflare Performance Ayarları

### 6.1 Speed Optimizations
1. **Speed** > **Optimization**
2. **Auto Minify**:
   - ✅ JavaScript
   - ✅ CSS
   - ✅ HTML
3. **Brotli**: ON
4. **Early Hints**: ON

### 6.2 Caching
1. **Caching** > **Configuration**
2. **Caching Level**: Standard
3. **Browser Cache TTL**: 4 hours

---

## 🛡️ ADIM 7: Cloudflare Güvenlik Ayarları

### 7.1 Security Level
1. **Security** > **Settings**
2. **Security Level**: Medium
3. **Challenge Passage**: 30 minutes

### 7.2 Bot Fight Mode
1. **Security** > **Bots**
2. **Bot Fight Mode**: ON

---

## ✅ ADIM 8: Doğrulama ve Test

### 8.1 DNS Propagation Kontrol
```bash
# Terminal'de test et:
nslookup okandemir.org
nslookup www.okandemir.org
```

Veya online araç:
- https://dnschecker.org

### 8.2 Site Testi
1. `https://okandemir.org` → Açılmalı ✅
2. `https://www.okandemir.org` → Redirect veya açılmalı ✅
3. `http://okandemir.org` → HTTPS'e redirect olmalı ✅

### 8.3 SSL Testi
- https://www.ssllabs.com/ssltest/analyze.html?d=okandemir.org
- A+ rating almalısınız

---

## 🔧 Sorun Giderme

### DNS Yayılmadı
- **Süre:** 5 dakika - 48 saat arası
- **Çözüm:** Bekleyin veya DNS cache temizleyin:
  ```bash
  ipconfig /flushdns  # Windows
  ```

### 521 Error (Web server is down)
- Railway projesi çalışmıyor
- Railway logs kontrol et
- Deployment başarılı mı kontrol et

### 522 Error (Connection timed out)
- Railway server yanıt vermiyor
- Environment variables kontrol et
- Database bağlantısı çalışıyor mu kontrol et

### 525 Error (SSL Handshake Failed)
- Cloudflare SSL/TLS mode: **Full (strict)** olmalı
- Railway SSL sertifikası hazır olmalı (birkaç dakika bekle)

---

## 📊 Cloudflare Analytics

### Aktif Et
1. **Analytics & Logs** > **Web Analytics**
2. JavaScript snippet ekle (opsiyonel)
3. Ziyaretçi istatistiklerini görüntüle

---

## 🎯 Railway'den Çıkış (İleride)

Eğer Railway'den tamamen çıkmak isterseniz:

### Seçenek 1: Vercel'e Geçiş
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Seçenek 2: Kendi Sunucunuz
1. VPS/Sunucu kiralayın (DigitalOcean, AWS, Hetzner)
2. Docker ile deploy edin
3. Nginx reverse proxy kurun

### Seçenek 3: Netlify
- Sadece static export için
- `next.config.ts` → `output: 'export'`

---

## ✅ Checklist

- [ ] Railway deployment çalışıyor
- [ ] Railway custom domain eklendi
- [ ] Cloudflare DNS CNAME kayıtları eklendi
- [ ] Cloudflare SSL Full (strict) mode
- [ ] Environment variables güncellendi
- [ ] https://okandemir.org açılıyor
- [ ] SSL sertifikası geçerli
- [ ] HTTP → HTTPS redirect çalışıyor
- [ ] www → non-www redirect çalışıyor (opsiyonel)

---

## 🆘 Yardım

Sorun yaşarsanız:
1. Railway Logs: `railway logs`
2. Cloudflare Support
3. DNS Checker: https://dnschecker.org

---

**Başarılar! 🚀**

