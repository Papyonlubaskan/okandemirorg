# Okan Demir — Portfolio & Dijital Pazarlama Sitesi

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Railway](https://img.shields.io/badge/Deploy-Railway-blueviolet?style=flat&logo=railway)](https://railway.app)

Next.js 15 App Router ile geliştirilmiş profesyonel portfolio ve dijital pazarlama sitesi.

## Özellikler

- SEO: sitemap, robots, yapılandırılmış veri (Person, Organization, WebSite)
- İletişim formu ve e-posta bildirimi
- WhatsApp chatbot (lazy load)
- Blog ve hizmet sayfaları
- Google Analytics GA4 + SPA route tracking
- MySQL (Railway) entegrasyonu
- API rate limiting ve dahili endpoint koruması

## Teknolojiler

- **Next.js 15** — App Router
- **TypeScript** — Tip güvenliği
- **Tailwind CSS** — Stil
- **MySQL** — Veritabanı (Railway)
- **Nodemailer** — E-posta

## Kurulum

```bash
git clone https://github.com/yourusername/okandemirorg.git
cd okandemirorg
npm install
cp .env.example .env.local
# .env.local dosyasını düzenleyin
npm run dev
```

Tarayıcı: [http://localhost:3000](http://localhost:3000)

### Production build

```bash
npm run build
npm start
```

## Environment Variables

`.env.example` dosyasındaki değişkenleri `.env.local` (geliştirme) veya Railway ortam değişkenlerine kopyalayın.

Önemli:
- `INTERNAL_API_KEY` — WhatsApp send ve admin API'leri için önerilir
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — GA4 ölçüm kimliği

## Proje Yapısı

```
├── app/              # Sayfalar ve API route'ları
├── components/       # React bileşenleri
├── lib/              # SEO, blog, güvenlik yardımcıları
└── public/           # Statik dosyalar
```

## Railway Deployment

1. GitHub'a push
2. Railway'de projeyi import et
3. MySQL ekle, environment variables ayarla
4. Domain bağla (okandemir.org)

## İletişim

- **Website:** https://okandemir.org
- **Email:** info@okandemir.org
- **WhatsApp:** +905552677739

© 2025 Okan Demir
