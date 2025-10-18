# 🚨 ACİL DNS DEĞİŞİKLİKLERİ - WordPress'ten Railway'e Geçiş

## ⚠️ ÖNEMLİ UYARI
WordPress sitenizi **ŞİMDİLİK KAPATMAYIN!** Geçiş tamamlanana kadar açık bırakın.

---

## 🔄 CLOUDFLARE DNS DEĞİŞİKLİKLERİ

### 1. A Record'u CNAME'e Çevir
```
MEVCUT: A | @ | 104.247.168.227
YENİ:   CNAME | @ | stcy53q8.up.railway.app
```

**Adımlar:**
1. Cloudflare > DNS > Records
2. A record'u bul (104.247.168.227)
3. "Edit" tıkla
4. Type: CNAME olarak değiştir
5. Content: `stcy53q8.up.railway.app` yaz
6. Proxy: ✅ Proxied (Turuncu)
7. Save

### 2. CNAME Record'u Güncelle
```
MEVCUT: CNAME | www | okandemir.org
YENİ:   CNAME | www | stcy53q8.up.railway.app
```

**Adımlar:**
1. CNAME www kaydını bul
2. "Edit" tıkla
3. Content: `stcy53q8.up.railway.app` yaz
4. Proxy: ✅ Proxied (Turuncu)
5. Save

---

## ⚡ CLOUDFLARE AYARLARI

### SSL/TLS Mode
1. SSL/TLS > Overview
2. Encryption mode: **Full (strict)** seç ✅

### Edge Certificates
1. SSL/TLS > Edge Certificates
2. **Always Use HTTPS**: ON ✅
3. **Automatic HTTPS Rewrites**: ON ✅

---

## ⏱️ BEKLEME SÜRELERİ

- **DNS Propagation**: 5-30 dakika
- **SSL Sertifika**: 5-15 dakika
- **Full Geçiş**: 1-2 saat

---

## ✅ TEST KONTROL LİSTESİ

### 1. DNS Test (5 dakika sonra)
```bash
nslookup okandemir.org
# Sonuç: stcy53q8.up.railway.app görünmeli
```

### 2. Site Test (15 dakika sonra)
```
✅ https://okandemir.org → Railway sitesi açılmalı
✅ https://www.okandemir.org → Railway sitesi açılmalı
```

### 3. SSL Test (30 dakika sonra)
```
https://www.ssllabs.com/ssltest/analyze.html?d=okandemir.org
Rating: A veya A+ olmalı
```

---

## 🚨 SORUN GİDERME

### Site Açılmıyor
1. **15 dakika bekle** (DNS propagation)
2. Railway deployment çalışıyor mu kontrol et
3. Cloudflare SSL: Full (strict) mi?

### WordPress Hala Açılıyor
1. DNS henüz yayılmamış
2. Browser cache temizle: `Ctrl+F5`
3. Farklı browser dene

### SSL Hatası
1. Cloudflare SSL: Full (strict) ✅
2. 15 dakika bekle
3. Railway SSL sertifikası hazır olmalı

---

## 🎯 BAŞARILI GEÇİŞ SONRASI

### WordPress'i Kapat
1. WordPress hosting'i durdur
2. Domain'i tamamen Railway'e yönlendir
3. WordPress backup'ını al (güvenlik için)

### Railway Environment Variables
```
NEXT_PUBLIC_SITE_URL=https://okandemir.org
```

---

**Hazır mısınız? Cloudflare'e gidip DNS kayıtlarını değiştirin!** 🚀
