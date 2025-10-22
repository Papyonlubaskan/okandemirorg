# Railway Deployment Kurulum Rehberi

## ✅ Tamamlanan Adımlar:
1. ✅ Git Repository oluşturuldu ve push edildi
2. ✅ PostgreSQL eklendi
3. ✅ Build script'leri hazırlandı

---

## 🚀 Railway'de Yapılacaklar:

### 1️⃣ PostgreSQL DATABASE_URL Kontrolü
Railway PostgreSQL eklediğinizde otomatik olarak `DATABASE_URL` environment variable'ı oluşturur.

**Kontrol:**
- Railway Dashboard → PostgreSQL Service → **Variables** sekmesi
- `DATABASE_URL` değerini göreceksiniz (otomatik)

### 2️⃣ Environment Variables Ayarları

Railway Dashboard → **Projeniz** → **Variables** sekmesine gidin ve aşağıdaki değişkenleri ekleyin:

```bash
# Email Ayarları (ZORUNLU)
EMAIL_HOST=okandemir.org
EMAIL_PORT=465
EMAIL_USER=info@okandemir.org
EMAIL_PASSWORD=Okan- 1881@ 
EMAIL_FROM=info@okandemir.org

# Site Ayarları (ZORUNLU)
NEXT_PUBLIC_SITE_URL=https://okandemir.org
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# YouTube API (OPSIYONEL - RSS fallback mevcut)
# YOUTUBE_API_KEY=your-api-key
# YOUTUBE_CHANNEL_ID=your-channel-id
```

**Önemli Notlar:**
- `EMAIL_PASSWORD` değerinde sonunda boşluk var, dikkat edin!
- YouTube değişkenleri eklemezseniz otomatik RSS feed kullanılacak
- `DATABASE_URL` Railway tarafından otomatik eklenir, elle eklemeyin!

### 3️⃣ Domain Ayarları

**Railway Dashboard → Projeniz → Settings → Networking:**

1. **Custom Domain** kısmına tıklayın
2. `okandemir.org` domain'ini ekleyin
3. Railway size DNS kayıtlarını verecek

**DNS Ayarları (cPanel):**
- cPanel → Zone Editor
- Railway'in verdiği CNAME veya A kaydını ekleyin
- Genellikle şu şekilde olur:
  ```
  Type: CNAME
  Name: @
  Value: xxx.up.railway.app
  ```

### 4️⃣ Build & Deploy

Variables ve domain ayarlandıktan sonra:

1. Railway otomatik olarak deploy'u başlatacak
2. Build sürecinde:
   - ✅ `npm install` - Bağımlılıklar yüklenir
   - ✅ `prisma generate` - Prisma Client oluşturulur
   - ✅ `prisma migrate deploy` - Database migration'ları çalıştırılır
   - ✅ `next build` - Production build oluşturulur

3. Build başarılı olursa:
   - ✅ Site otomatik olarak yayına alınır
   - ✅ PostgreSQL database'e tablolar oluşturulur
   - ✅ Domain'e giderseniz siteyi görürsünüz!

---

## 🔍 Deployment Durumu Kontrolü

### Build Logs:
Railway Dashboard → Projeniz → **Deployments** → Son deployment'e tıklayın → **View Logs**

### Başarılı Build Göstergeleri:
```
✓ Prisma schema loaded
✓ Migrations applied successfully
✓ Compiled successfully
✓ Build completed
```

### Yaygın Hatalar ve Çözümleri:

#### 1. "Prisma migrate failed"
- **Çözüm:** `DATABASE_URL` doğru ayarlanmış mı kontrol edin
- PostgreSQL service başlatıldı mı kontrol edin

#### 2. "Email sending failed"
- **Çözüm:** Email environment variables'ları kontrol edin
- `EMAIL_PASSWORD` sonundaki boşluğu unutmayın!

#### 3. "Build timeout"
- **Çözüm:** Railway free tier'da timeout 10dk
- Genellikle 2-3dk'da tamamlanır, sorun varsa tekrar deploy edin

---

## 📊 Deploy Sonrası Kontroller:

### 1. Ana Sayfa:
- `https://okandemir.org` → Site açılıyor mu?

### 2. İletişim Formu:
- `https://okandemir.org/iletisim` → Form gönderilebiliyor mu?
- Email geliyor mu?

### 3. Admin Dashboard:
- `https://okandemir.org/admin` → Dashboard açılıyor mu?
- `https://okandemir.org/admin/analytics` → Analytics çalışıyor mu?

### 4. YouTube Feed:
- Ana sayfadaki YouTube videoları yükleniyor mu?

### 5. Database:
- Railway Dashboard → PostgreSQL → **Data** sekmesi
- Tablolar oluştu mu? (`ContactSubmission`, `AIAnalyticsLog`, vb.)

---

## 🎉 Deploy Tamamlandı!

Tebrikler! Siteniz artık canlı!

### Yararlı Linkler:
- **Ana Site:** https://okandemir.org
- **Admin Panel:** https://okandemir.org/admin
- **Analytics:** https://okandemir.org/admin/analytics
- **Railway Dashboard:** https://railway.app

### Sonraki Adımlar:
1. ✅ YouTube API key'i ekleyin (opsiyonel)
2. ✅ SSL sertifikası otomatik gelecek (Railway tarafından)
3. ✅ Domain propagation ~30dk sürer
4. ✅ İlk analytics verilerini görmeye başlarsınız

---

## 💡 İpuçları:

- **Değişiklik yaptığınızda:** `git push` yaptığınızda Railway otomatik deploy eder
- **Log'ları görmek için:** Railway Dashboard → Deployments → View Logs
- **Database'i görmek için:** Railway Dashboard → PostgreSQL → Data
- **Variables değiştirmek için:** Railway Dashboard → Variables (deploy gerektirir)

---

**Sorularınız için:** Herhangi bir sorun olursa Railway deployment logs'una bakın!

