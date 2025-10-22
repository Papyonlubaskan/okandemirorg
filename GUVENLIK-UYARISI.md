# 🚨 GÜVENLİK UYARISI - ACİL!

## Kritik Güvenlik Sorunu Düzeltildi

### ✅ YAPILAN DEĞİŞİKLİKLER

1. **lib/mysql.ts** - Hardcoded credentials kaldırıldı
   - Artık environment variables kullanıyor
   - Güvenlik açığı kapatıldı

### ⚠️ YAPMANIZ GEREKENLER

#### 1. Environment Dosyalarını Oluşturun

Aşağıdaki dosyaları **manuel olarak** oluşturun:

**`.env.local`** dosyası:
```env
# Next.js
NEXT_PUBLIC_SITE_URL=https://okandemir.org
NEXT_PUBLIC_SITE_NAME=Okan Demir - Dijital Pazarlama Uzmanı
NEXT_PUBLIC_SITE_DESCRIPTION=Dijital Pazarlama Uzmanı, Web Tasarım, SEO, Google Ads
NEXT_TELEMETRY_DISABLED=1

# MySQL Database
MYSQL_HOST=tramway.proxy.rlwy.net
MYSQL_PORT=32383
MYSQL_USER=root
MYSQL_PASSWORD=dFTGoNAsywbEMGsQoojVBRnQYZsxIwUz
MYSQL_DATABASE=railway

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com

# YouTube API
YOUTUBE_API_KEY=your-youtube-api-key
YOUTUBE_CHANNEL_ID=your-channel-id

# Instagram API
INSTAGRAM_ACCESS_TOKEN=your-instagram-token
```

**`.env.example`** dosyası:
```env
# Next.js
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME=Your Site Name
NEXT_PUBLIC_SITE_DESCRIPTION=Your Site Description
NEXT_TELEMETRY_DISABLED=1

# MySQL Database
MYSQL_HOST=your-mysql-host
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your-mysql-password
MYSQL_DATABASE=railway

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=your-email@gmail.com

# YouTube API
YOUTUBE_API_KEY=your-youtube-api-key
YOUTUBE_CHANNEL_ID=your-youtube-channel-id

# Instagram API
INSTAGRAM_ACCESS_TOKEN=your-instagram-access-token
```

#### 2. Git Geçmişini Temizleyin (ÖNEMLİ!)

MySQL şifreleri Git geçmişinde olabilir:

```bash
# 1. Hassas bilgileri geçmişten kaldırın
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch lib/mysql.ts" \
  --prune-empty --tag-name-filter cat -- --all

# 2. Railway şifrelerini değiştirin
# Railway dashboard > Database > Settings > Generate New Password

# 3. Force push (UYARI: Tehlikeli, yedek alın!)
git push origin --force --all
```

#### 3. Railway Environment Variables

Railway dashboard'da bu değişkenleri ayarlayın:
- `MYSQL_HOST`
- `MYSQL_PORT`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`
- `EMAIL_*`
- `YOUTUBE_*`
- `INSTAGRAM_*`

#### 4. .gitignore Kontrolü

`.gitignore` dosyasında şunlar olmalı:
```
.env*
!.env.example
```

### 📋 Kontrol Listesi

- [ ] `.env.local` dosyası oluşturuldu
- [ ] `.env.example` dosyası oluşturuldu
- [ ] Railway environment variables ayarlandı
- [ ] MySQL şifresi değiştirildi
- [ ] Git geçmişi temizlendi
- [ ] Yeni commit yapıldı
- [ ] Railway'de redeploy yapıldı

### 🔒 Güvenlik En İyi Pratikleri

1. **Asla** şifreleri kodda yazmayın
2. **Asla** `.env.local` dosyasını commit etmeyin
3. **Her zaman** `.env.example` dosyası kullanın
4. **Düzenli olarak** API keylerini yenileyin
5. **2FA** aktif edin (GitHub, Railway, vb.)

---

**Son Güncelleme:** 19 Ekim 2025
**Durum:** 🚨 Acil Düzeltme Gerekli

