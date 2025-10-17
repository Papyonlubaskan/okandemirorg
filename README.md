# OkanDemir E-Ticaret Sitesi

Next.js, TypeScript, MySQL2 ile geliştirilmiş modern e-ticaret platformu.

## Teknolojiler

- **Next.js 15.5** - React framework
- **TypeScript** - Tip güvenliği
- **MySQL2** - Veritabanı driver
- **MySQL 8.0+** - Veritabanı
- **Tailwind CSS** - Styling
- **NextAuth.js** - Authentication
- **Lucide React** - Icons

## Gereksinimler

- Node.js 18.0.0 veya üzeri
- MySQL 8.0 veya üzeri
- npm 8.0.0 veya üzeri

## Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Veritabanını Oluşturun

```bash
mysql -u root -p
CREATE DATABASE okandemirorg CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

### 3. .env Dosyası Oluşturun

Proje kök dizininde `.env` dosyası oluşturun:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=okandemirorg
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-in-production
```

### 4. Veritabanı Tablolarını Oluşturun

Manuel olarak SQL'i çalıştırın:

```bash
mysql -u root -p < scripts/init-db.sql
```

Veya MySQL'e bağlanıp script'i çalıştırın:

```bash
mysql -u root -p
SOURCE scripts/init-db.sql;
exit;
```

### 5. Test Verisi Ekleyin (Opsiyonel)

```bash
npm run db:seed
```

### 6. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Tarayıcınızda http://localhost:3000 adresini açın.

## Komutlar

```bash
# Geliştirme sunucusu
npm run dev

# Production build
npm run build

# Production sunucusu
npm start

# Linting
npm run lint

# Veritabanı tablolarını oluştur
npm run db:init  # veya manuel: mysql -u root < scripts/init-db.sql

# Test verisi ekle
npm run db:seed
```

## Özellikler

- ✅ Modern, responsive tasarım
- ✅ Ürün listeleme ve detay sayfaları
- ✅ Kategori yönetimi
- ✅ Alışveriş sepeti
- ✅ Kullanıcı yönetimi
- ✅ Sipariş yönetimi
- ✅ Ürün yorumları ve değerlendirmeleri
- ✅ Stok takibi
- ✅ İndirim sistemi
- ✅ Çoklu resim desteği

## Veritabanı Tabloları

- **users** - Kullanıcılar
- **products** - Ürünler
- **categories** - Kategoriler
- **orders** - Siparişler
- **order_items** - Sipariş kalemleri
- **addresses** - Adresler
- **reviews** - Ürün yorumları
- **product_images** - Ürün resimleri
- **product_categories** - Ürün-kategori ilişkisi

## WordPress'ten Geçiş

WordPress sitenizi Next.js'e geçirmek için `scripts/migrate-wordpress.md` dosyasına bakın.

## Proje Yapısı

```
├── app/                  # Next.js app router
│   ├── page.tsx         # Ana sayfa
│   ├── products/        # Ürün listesi
│   ├── product/[slug]/  # Ürün detay
│   ├── category/[slug]/ # Kategori sayfası
│   └── cart/            # Sepet
├── components/          # React bileşenleri
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ProductCard.tsx
├── lib/                 # Utilities
│   ├── db.ts           # MySQL2 connection
│   └── utils.ts        # Yardımcı fonksiyonlar
└── scripts/            # Utility scripts
    ├── init-db.sql     # Veritabanı şeması
    ├── seed.ts         # Test verisi
    └── migrate-wordpress.md
```

## Lisans

MIT

## İletişim

Sorularınız için: admin@okandemir.org
