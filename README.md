# 🚀 Okan Demir - Profesyonel Portfolio & Dijital Pazarlama Platformu

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

- **Next.js 15.5** - React framework with App Router
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **SQLite** - Development database
- **Tailwind CSS 3.4** - Styling
- **Poppins Font** - Custom typography
- **Nodemailer** - Email service

## 🚀 Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Prisma Setup

```bash
npx prisma generate
npx prisma migrate dev
```

### 3. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Tarayıcınızda http://localhost:3000 adresini açın.

### 4. Production Build

```bash
npm run build
npm start
```

## 📦 Environment Variables

Railway'de şu environment variables'ları ayarlayın:

```env
DATABASE_URL=file:./dev.db
NEXT_TELEMETRY_DISABLED=1
NODE_ENV=production
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 📁 Admin Dashboards

Tüm admin panellerine `/admin` üzerinden erişebilirsiniz:

- **[/admin](/admin)** - Ana kontrol paneli
- **[/admin/dashboard](/admin/dashboard)** - AI Müşteri Analizi
- **[/admin/analytics](/admin/analytics)** - Canlı Performans
- **[/admin/seo](/admin/seo)** - SEO Analiz Aracı
- **[/admin/surveys](/admin/surveys)** - Anket Sonuçları
- **[/admin/projects](/admin/projects)** - Proje Yönetimi
- **[/admin/builder](/admin/builder)** - Landing Page Builder

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

1. GitHub'a push edin (✅ Tamamlandı)
2. Railway'de projeyi GitHub'dan import edin
3. Environment variables ekleyin
4. Otomatik deploy başlayacak

## 📱 WhatsApp İletişim

Site genelinde floating WhatsApp chatbot aktif:
- **Telefon:** +905552677739
- **Otomatik mesaj şablonları**
- **Hızlı hizmet seçimi**

## 📄 Lisans

© 2025 Okan Demir - Tüm hakları saklıdır.

## 📞 İletişim

- **Website:** https://okandemir.org
- **Email:** info@okandemir.org
- **WhatsApp:** +905552677739
- **LinkedIn:** https://www.linkedin.com/in/okandemirorg/
