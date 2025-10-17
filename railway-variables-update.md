# Railway Environment Variables Güncelleme Rehberi

## 📧 Email Ayarları (Güncellenmiş)
```
EMAIL_HOST = okandemir.org
EMAIL_PORT = 465
EMAIL_USER = info@okandemir.org
EMAIL_PASS = Okan- 1881@ 
EMAIL_FROM = info@okandemir.org
EMAIL_PASSWORD = Okan- 1881@ 
```

## 🎬 YouTube API Ayarları
```
YOUTUBE_API_KEY = AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (Google Cloud'dan alacaksınız)
YOUTUBE_CHANNEL_ID = UCxxxxxxxxxxxxxxxxxxxxx (YouTube kanalınızdan alacaksınız)
```

## 📱 Instagram API (Opsiyonel)
```
INSTAGRAM_ACCESS_TOKEN = your-instagram-token (şimdilik boş bırakabilirsiniz)
```

## 🗄️ Database (Railway Otomatik Oluşturur)
```
DATABASE_URL = (Railway PostgreSQL addon eklendikten sonra otomatik oluşur)
```

## 🌐 Site Ayarları (Zaten Doğru)
```
NEXT_PUBLIC_SITE_URL = https://okandemir.org
NEXT_PUBLIC_SITE_NAME = Dijital Pazarlama Uzmanı | Okan Demir
NEXT_PUBLIC_SITE_DESCRIPTION = Dijital Pazarlama Uzmanı, Web Tasarım, SEO, Google Ads, Meta Business, Sosyal Medya Yönetimi
NEXT_TELEMETRY_DISABLED = 1
NODE_ENV = production
```

## 🔧 Railway'de Yapılacaklar:

### 1. Mevcut Variables'ları Güncelle:
- EMAIL_HOST → okandemir.org
- EMAIL_PORT → 465
- EMAIL_USER → info@okandemir.org
- EMAIL_PASS → Okan- 1881@ 
- EMAIL_FROM → info@okandemir.org

### 2. Yeni Variables Ekle:
- EMAIL_PASSWORD → Okan- 1881@ 
- YOUTUBE_API_KEY → (Google Cloud'dan alacaksınız)
- YOUTUBE_CHANNEL_ID → (YouTube kanalınızdan alacaksınız)

### 3. PostgreSQL Addon Ekle:
- Railway Dashboard → Add Service → Database → PostgreSQL
- DATABASE_URL otomatik oluşur

### 4. Deploy:
- Variables güncellendikten sonra otomatik redeploy başlar
- Build süreci tamamlanana kadar bekleyin
