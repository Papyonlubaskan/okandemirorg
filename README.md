# 🚀 Okan Demir - Profesyonel Portfolio & Dijital Pazarlama Platformu

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Railway](https://img.shields.io/badge/Deploy-Railway-blueviolet?style=flat&logo=railway)](https://railway.app)

Next.js 15 ile geliştirilmiş, AI destekli, modern ve özellik dolu profesyonel portfolio sitesi.

## ✨ Özellikler (10/10 TAMAMLANDI)

### 🤖 1. AI Destekli Müşteri Analiz Sistemi
- Otomatik kategori, sentiment, priority tespiti
- Bütçe tahmini ve keyword extraction
- Detaylı müşteri insights dashboard

### 📊 2. Canlı Performans Dashboard
- Gerçek zamanlı analytics tracking
- Page views, unique visitors, conversion rate
- Auto-refresh (10/30/60s intervals)

### 📱 3. Progressive Web App (PWA)
- Offline support & service worker
- App install prompt
- Background sync & push notifications

### ✨ 4. Müşteri Başarı Hikayeleri
- Animated slider (5 success stories)
- Detailed metrics & results
- Auto-advance carousel

### 🔍 5. Gelişmiş SEO Analiz Aracı
- URL-based SEO analysis
- Meta tags, content, technical checks
- SEO score (0-100) with recommendations

### 📋 6. Müşteri Memnuniyet Anketi
- 5-star rating system
- Testimonial collection
- Statistics dashboard

### 🎨 7. 3D Portfolio Galerisi
- 3D perspective transforms
- Category filtering
- Interactive carousel

### 💼 8. Proje Yönetim Paneli
- Project status tracking
- Progress monitoring
- Budget & deadline management

### 🏗️ 9. Landing Page Builder
- Template system
- Live preview mode
- Customizable sections

### 💬 10. WhatsApp Chatbot
- Floating chat widget
- Quick service selection
- Predefined message templates

## 🛠️ Teknolojiler

- **Next.js 15.5** - React framework with App Router & Turbopack
- **TypeScript 5** - Type safety
- **MySQL 8** - Production database (Railway)
- **Tailwind CSS 3.4** - Utility-first CSS
- **Framer Motion** - Animations
- **Lucide React** - Icon library
- **Nodemailer 7** - Email service
- **Google Analytics GA4** - Analytics tracking

## 🚀 Kurulum

### 1. Repository'i Klonlayın

```bash
git clone https://github.com/yourusername/okandemirorg.git
cd okandemirorg
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Environment Dosyasını Oluşturun

```bash
# Template'i kopyalayın
cp .env.local.template .env.local

# Ardından .env.local dosyasını kendi bilgilerinizle güncelleyin
```

### 4. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

### 5. Production Build

```bash
npm run build
npm start
```

📖 **Detaylı kurulum için:** [KURULUM.md](./KURULUM.md)

## 📦 Environment Variables

`.env.local` dosyası oluşturun:

```env
# MySQL Database (Railway)
MYSQL_HOST=your-mysql-host
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your-password
MYSQL_DATABASE=railway

# Email (Gmail App Password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=your-email@gmail.com

# API Keys
YOUTUBE_API_KEY=your-youtube-api-key
YOUTUBE_CHANNEL_ID=your-channel-id
INSTAGRAM_ACCESS_TOKEN=your-instagram-token

# Next.js
NEXT_PUBLIC_SITE_URL=https://okandemir.org
NEXT_TELEMETRY_DISABLED=1
```

⚠️ **GÜVENLİK:** [GUVENLIK-UYARISI.md](./GUVENLIK-UYARISI.md) dosyasını mutlaka okuyun!

## 📧 Otomatik Sistemler

### İletişim Formu
- Tüm mesajlar otomatik olarak **info@okandemir.org** adresine gönderilir
- MySQL database'e kaydedilir
- Anında email bildirimi

### Haber Bülteni
- Otomatik hoş geldin emaili gönderilir
- Aboneler database'e kaydedilir
- Gelecek güncellemeler için hazır sistem

## 📊 Proje İstatistikleri

- ✅ **33 sayfa** - Fully optimized & built
- ✅ **16 API endpoints** - RESTful architecture
- ✅ **20+ components** - Reusable & modular
- ✅ **10 database models** - Prisma ORM
- ✅ **5000+ lines** - Production-ready code
- ✅ **5 admin dashboards** - Comprehensive management
- ✅ **PWA ready** - Installable on mobile/desktop
- ✅ **SEO optimized** - Structured data, meta tags
- ✅ **Analytics tracking** - Real-time monitoring
- ✅ **AI powered** - Smart customer analysis

## 🎨 Proje Yapısı

```
├── app/
│   ├── page.tsx              # Ana sayfa
│   ├── hakkimda/             # Hakkımda sayfası
│   ├── hizmetler/            # Hizmetler
│   ├── projeler/             # 3D Portfolio
│   ├── iletisim/             # İletişim + FAQ
│   ├── survey/               # Müşteri anketi
│   ├── admin/                # Admin dashboards
│   └── api/                  # API routes
├── components/               # React components
│   ├── WhatsAppChatbot.tsx
│   ├── Portfolio3D.tsx
│   ├── SuccessStories.tsx
│   ├── SurveyForm.tsx
│   ├── LandingPageBuilder.tsx
│   └── ...
├── lib/
│   ├── ai-analysis.ts        # AI analysis engine
│   ├── seo-analyzer.ts       # SEO analyzer
│   ├── prisma.ts             # Database client
│   └── utils.ts
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
└── public/                   # Static assets
```

## 🚢 Railway Deployment

1. GitHub'a push edin
2. Railway'de projeyi GitHub'dan import edin
3. MySQL database ekleyin
4. Environment variables'ları ayarlayın
5. Domain bağlayın (okandemir.org)
6. Otomatik deploy başlayacak

📖 **Detaylı deployment:** [RAILWAY-SETUP-GUIDE.md](./RAILWAY-SETUP-GUIDE.md)

## 📱 WhatsApp İletişim

Site genelinde floating WhatsApp chatbot aktif:
- **Telefon:** +905552677739
- **Otomatik mesaj şablonları**
- **Hızlı hizmet seçimi**

## 📚 Dokümantasyon

- 📖 [Kurulum Kılavuzu](./KURULUM.md)
- 🚨 [Güvenlik Uyarısı](./GUVENLIK-UYARISI.md)
- ✅ [Eksiklikler ve Çözümler](./EKSIKLER-COZUM.md)
- 🚀 [Railway Setup](./RAILWAY-SETUP-GUIDE.md)
- 🌐 [Domain Setup](./DOMAIN-SETUP.md)
- ☁️ [Cloudflare Setup](./CLOUDFLARE-SETUP.md)
- 🔍 [SEO Yapısı](./SEO-YAPISI.md)

## 📄 Lisans

MIT License - Detaylar için [LICENSE](./LICENSE) dosyasına bakın.

© 2025 Okan Demir

## 📞 İletişim

- **Website:** https://okandemir.org
- **Email:** info@okandemir.org
- **WhatsApp:** +905552677739
- **LinkedIn:** https://www.linkedin.com/in/okandemirorg/
