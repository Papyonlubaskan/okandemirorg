# 🌐 Domain Konfigürasyonu - okandemir.org

## 📋 DNS Ayarları

### 1. Domain Provider'da Ayarlar
Domain sağlayıcınızda (GoDaddy, Namecheap, vs.) şu DNS kayıtlarını ekleyin:

```
Type: A
Name: @
Value: [Railway IP Address]
TTL: 300

Type: CNAME
Name: www
Value: [Railway Domain]
TTL: 300

Type: CNAME
Name: api
Value: [Railway Domain]
TTL: 300
```

### 2. Railway'de Domain Ayarları
1. Railway dashboard'da projenizi seçin
2. Settings > Domains bölümüne gidin
3. "Custom Domain" ekleyin
4. `okandemir.org` domain'ini ekleyin
5. `www.okandemir.org` subdomain'ini ekleyin

### 3. SSL Sertifikası
Railway otomatik olarak Let's Encrypt SSL sertifikası sağlar:
- HTTPS otomatik olarak aktif
- HTTP'den HTTPS'e yönlendirme
- HSTS headers otomatik

### 4. Email Konfigürasyonu
Email ayarları için environment variables:

```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=info@okandemir.org
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=info@okandemir.org
```

### 5. Google Search Console
1. [Google Search Console](https://search.google.com/search-console) hesabı oluşturun
2. `okandemir.org` domain'ini ekleyin
3. DNS verification yapın
4. Sitemap'i submit edin: `https://okandemir.org/sitemap.xml`

### 6. Google Analytics
1. [Google Analytics](https://analytics.google.com) hesabı oluşturun
2. Property oluşturun: `okandemir.org`
3. Tracking ID'yi environment variables'a ekleyin:

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 7. Social Media Meta Tags
Tüm sosyal medya platformları için optimize edilmiş meta tags:

- **Facebook/Meta**: Open Graph tags
- **Twitter**: Twitter Card tags
- **LinkedIn**: Professional sharing
- **WhatsApp**: Link preview

### 8. Performance Monitoring
Railway dashboard'da:
- Response time monitoring
- Error rate tracking
- Uptime monitoring
- Resource usage

### 9. Backup Strategy
- Database backup (Railway otomatik)
- Code backup (GitHub)
- Environment variables backup
- SSL certificate backup (otomatik)

### 10. Security Headers
Next.js otomatik olarak şu security headers'ları sağlar:
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

## 🔧 Troubleshooting

### DNS Propagation
- DNS değişiklikleri 24-48 saat sürebilir
- `nslookup okandemir.org` ile kontrol edin
- `dig okandemir.org` ile DNS kayıtlarını kontrol edin

### SSL Sertifika Sorunu
- Railway otomatik olarak SSL sağlar
- Domain verification tamamlanana kadar bekleyin
- Browser cache'i temizleyin

### Email Gönderim Sorunu
- Gmail App Password kullanın
- SMTP ayarlarını kontrol edin
- Firewall ayarlarını kontrol edin

### Performance Sorunları
- Railway dashboard'da metrics kontrol edin
- Database connection pool ayarlarını kontrol edin
- CDN cache ayarlarını kontrol edin

## 📊 Monitoring Checklist

- [ ] Domain DNS ayarları yapıldı
- [ ] SSL sertifikası aktif
- [ ] Google Search Console eklendi
- [ ] Google Analytics eklendi
- [ ] Social media meta tags test edildi
- [ ] Email gönderimi test edildi
- [ ] Performance monitoring aktif
- [ ] Backup strategy uygulandı
- [ ] Security headers kontrol edildi
- [ ] Mobile responsiveness test edildi

## 🚀 Go-Live Checklist

- [ ] Production environment variables ayarlandı
- [ ] Database production'a migrate edildi
- [ ] Domain DNS ayarları yapıldı
- [ ] SSL sertifikası aktif
- [ ] Google services entegre edildi
- [ ] Performance test edildi
- [ ] Security test edildi
- [ ] Backup strategy uygulandı
- [ ] Monitoring aktif
- [ ] Go-live! 🎉
