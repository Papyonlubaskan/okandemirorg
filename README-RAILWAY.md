# Railway Deployment Guide - Okan Demir Website

## 🚀 Railway'de Deploy Etme

### 1. Railway Hesabı Oluşturma
- [Railway.app](https://railway.app) adresine gidin
- GitHub hesabınızla giriş yapın

### 2. Proje Deploy Etme
1. Railway dashboard'da "New Project" butonuna tıklayın
2. "Deploy from GitHub repo" seçin
3. Bu repository'yi seçin
4. Railway otomatik olarak Next.js projesini tanıyacak

### 3. Environment Variables
Railway dashboard'da Settings > Variables bölümünde şu değişkenleri ekleyin:

```bash
NODE_ENV=production
PORT=3000
NEXTAUTH_URL=https://okandemir.org
NEXTAUTH_SECRET=your-secret-key-change-in-production
DB_HOST=your-mysql-host
DB_USER=your-mysql-user
DB_PASSWORD=your-mysql-password
DB_NAME=okandemirorg
EMAIL_USER=info@okandemir.org
EMAIL_PASSWORD=your-email-password
```

### 4. Domain Ayarları
1. Railway dashboard'da Settings > Domains bölümüne gidin
2. "Custom Domain" ekleyin
3. `okandemir.org` domain'ini ekleyin
4. DNS ayarlarını Railway'in verdiği CNAME ile güncelleyin

### 5. Database Bağlantısı
- Railway'de MySQL addon'u ekleyin
- Connection string'i environment variables'a ekleyin

### 6. Build Ayarları
Railway otomatik olarak:
- `npm install` çalıştırır
- `npm run build` çalıştırır
- `npm run start` ile uygulamayı başlatır

### 7. Monitoring
- Railway dashboard'da logs ve metrics görüntüleyebilirsiniz
- Uptime monitoring otomatik olarak aktif

## 🔧 Troubleshooting

### Build Hatası
- `package.json` dosyasında `engines` field'ını kontrol edin
- Node.js versiyonunu 18+ olarak ayarlayın

### Database Bağlantı Hatası
- Environment variables'ları kontrol edin
- MySQL service'inin çalıştığından emin olun

### Domain Hatası
- DNS propagation'ın tamamlanmasını bekleyin (24-48 saat)
- SSL sertifikası otomatik olarak oluşturulur

## 📊 Performance
- Railway otomatik olarak CDN sağlar
- Global edge locations'da cache
- Automatic scaling

## 🔒 Security
- HTTPS otomatik olarak aktif
- Environment variables güvenli
- Database bağlantıları şifrelenmiş

## 📈 Monitoring
- Real-time logs
- Performance metrics
- Error tracking
- Uptime monitoring

## 🚀 Production Checklist
- [ ] Environment variables ayarlandı
- [ ] Database bağlantısı test edildi
- [ ] Domain DNS ayarları yapıldı
- [ ] SSL sertifikası aktif
- [ ] Performance test edildi
- [ ] SEO meta tags kontrol edildi
- [ ] Mobile responsiveness test edildi
