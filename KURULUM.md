# 🚀 Kurulum Kılavuzu

## Gereksinimler

- Node.js 20+ 
- npm veya yarn
- MySQL 8.0+

## Hızlı Başlangıç

### 1. Projeyi İndirin

```bash
git clone https://github.com/yourusername/okandemirorg.git
cd okandemirorg
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
# veya
yarn install
```

### 3. Environment Dosyasını Oluşturun

```bash
# Template dosyasını kopyalayın
cp .env.local.template .env.local
```

`.env.local` dosyasını düzenleyin ve kendi bilgilerinizi ekleyin:

```env
# MySQL Database (Railway'den alın)
MYSQL_HOST=your-host
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your-password
MYSQL_DATABASE=railway

# Email (Gmail App Password)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# YouTube API (Google Cloud Console)
YOUTUBE_API_KEY=your-api-key
YOUTUBE_CHANNEL_ID=your-channel-id

# Instagram API (Meta Developers)
INSTAGRAM_ACCESS_TOKEN=your-token
```

### 4. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 📦 Production Build

```bash
npm run build
npm start
```

## 🔒 Güvenlik

- **Asla** `.env.local` dosyasını commit etmeyin
- **Mutlaka** güçlü şifreler kullanın
- **Her zaman** HTTPS kullanın
- **Düzenli** API keylerini yenileyin

## 🛠️ Komutlar

```bash
npm run dev          # Geliştirme sunucusu (Turbopack)
npm run build        # Production build
npm run start        # Production sunucu
npm run lint         # ESLint kontrolü
npm run build:analyze # Bundle analizi
```

## 📚 Daha Fazla Bilgi

- [Railway Setup](./RAILWAY-SETUP-GUIDE.md)
- [Domain Setup](./DOMAIN-SETUP.md)
- [Cloudflare Setup](./CLOUDFLARE-SETUP.md)
- [SEO Yapısı](./SEO-YAPISI.md)
- [Güvenlik Uyarısı](./GUVENLIK-UYARISI.md)

## 💡 Sorun Giderme

### MySQL Bağlantı Hatası

```bash
# .env.local dosyasını kontrol edin
# Railway dashboard'dan credentials alın
```

### Build Hatası

```bash
# node_modules'ı temizleyin
rm -rf node_modules .next
npm install
npm run build
```

## 📞 Destek

Sorun yaşıyorsanız:
1. [Issues](https://github.com/yourusername/okandemirorg/issues) sayfasından yeni issue açın
2. [Güvenlik Uyarısı](./GUVENLIK-UYARISI.md) dosyasını okuyun

