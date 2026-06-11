# 🎯 N8N İçin İlk Adımlar - Sıfırdan Başlayanlar İçin

**Durum:** N8N konusunda hiçbir şey bilmiyorum ve ne yapacağımı bilmiyorum.

---

## ❓ N8N Nedir? (Basit Açıklama)

**N8N = Otomasyon Aracı**

Şöyle düşün:
- **Eğer** bir şey olursa → **O zaman** başka bir şey yap
- Örnek: Eğer Google Ads'de kampanya kötü performans gösterirse → O zaman bana WhatsApp'tan bildir

**Neden İhtiyacımız Var?**
- Reklam kampanyalarını otomatik kontrol et
- Sorun olduğunda haber ver
- Raporları otomatik gönder
- Manuel işleri azalt

---

## ✅ Şu Anda Ne Var? (Mevcut Durum)

1. ✅ **Website** (okandemir.org) - Railway'de çalışıyor
2. ✅ **MySQL Database** - Railway'de hazır
3. ✅ **N8N için hazırlıklar** - API route'ları hazır
4. ❌ **N8N Kurulu değil** - Bunu şimdi yapacağız

---

## 🚀 ADIM 1: N8N'i Railway'de Kur (En Basit Yol)

### Seçenek A: Railway One-Click Deploy (Önerilen)

1. **Railway'ye Git**
   - https://railway.app adresine git
   - Giriş yap

2. **Yeni Proje Oluştur**
   - "New Project" butonuna tıkla
   - "Deploy from GitHub repo" yerine **"Deploy a Template"** seç
   - Arama kutusuna `n8n` yaz
   - **"n8n"** template'ini seç

3. **Otomatik Kurulum**
   - Railway otomatik olarak n8n'i kuracak
   - 2-3 dakika bekle
   - Hazır!

### Seçenek B: Manuel Docker Deploy

Eğer template yoksa:

1. Railway'de "New Project" > "Empty Project"
2. "Add Service" > "Database" > **GEREKMİYOR** (N8N kendi içinde çalışır)
3. "Add Service" > "GitHub Repo" 
4. Yeni bir repo oluştur veya mevcut reponu bağla
5. `Dockerfile` ekle:

```dockerfile
FROM n8nio/n8n:latest

ENV N8N_BASIC_AUTH_ACTIVE=true
ENV N8N_BASIC_AUTH_USER=admin
ENV N8N_HOST=0.0.0.0
ENV N8N_PORT=5678
ENV N8N_PROTOCOL=https
ENV WEBHOOK_URL=https://n8n-xxxx.up.railway.app
```

6. Deploy et

---

## 🔐 ADIM 2: N8N Giriş Bilgilerini Ayarla

Railway'de n8n servisine git:

1. **Settings** > **Variables** sekmesine git
2. Şu değişkenleri ekle:

```
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=istediğin-güçlü-şifre
```

3. **Redeploy** butonuna tıkla (değişiklikler için)

---

## 🌐 ADIM 3: N8N'e Eriş

1. Railway'de n8n servisine git
2. **"Generate Domain"** butonuna tıkla
3. Şöyle bir URL alırsın: `https://n8n-xxxx.up.railway.app`
4. Bu URL'e git
5. **Kullanıcı adı:** admin
6. **Şifre:** az önce ayarladığın şifre

---

## 🧪 ADIM 4: İlk Test (Basit Workflow)

N8N'e giriş yaptın, şimdi ilk test workflow'unu yap:

### Test 1: Basit Webhook Test

1. N8N'de **"New Workflow"** butonuna tıkla
2. Sol taraftan **"Webhook"** node'unu sürükle-bırak
3. **"Webhook"** node'una tıkla
4. **"HTTP Method"** seç: `POST`
5. **"Path"** yaz: `test`
6. Sağ üstte **"Save"** tıkla
7. **"Execute Workflow"** butonuna tıkla (veya CTRL+R)
8. Bir URL görünecek, kopyala: `https://n8n-xxxx.up.railway.app/webhook/test`

### Test 2: Webhook'u Çalıştır

Tarayıcıda veya terminal'de:

```bash
curl -X POST https://n8n-xxxx.up.railway.app/webhook/test \
  -H "Content-Type: application/json" \
  -d '{"test": "merhaba"}'
```

**Beklenen Sonuç:**
- N8N'de webhook node'u yeşil olur (çalıştı demek)
- Node'a tıklayıp gelen veriyi görebilirsin

✅ **Tebrikler! İlk workflow çalıştı!**

---

## 🔐 ADIM 5: INTERNAL_API_KEY (okandemir.org + n8n)

1. **okandemir.org Railway servisi** → Variables → `INTERNAL_API_KEY` ekle  
   (Proje kökündeki `railway.env` dosyasından kopyalayabilirsin — git'e gitmez)
2. **n8n Railway servisi** → Variables → **aynı** `INTERNAL_API_KEY` değerini ekle
3. n8n'de workflow import et: `N8N-WORKFLOW-ORNEKLERI.json`  
   WhatsApp node'u otomatik `x-api-key: {{$env.INTERNAL_API_KEY}}` header'ı gönderir

---

## 📊 ADIM 6: Database Bağlantısı (Opsiyonel - Sonra Yapabilirsin)

Şimdilik gerek yok. İlk önce N8N'in çalıştığından emin ol.

**Sonra yapacağın:**
- MySQL credentials ekle
- Database'e veri yazma workflow'u yap
- Daha karmaşık otomasyonlar ekle

---

## 🎯 Şimdi Ne Yapmalısın? (Sıralı Liste)

1. ✅ **ADIM 1'i Yap** - Railway'de N8N'i kur (10 dakika)
2. ✅ **ADIM 2'yi Yap** - Giriş bilgilerini ayarla (2 dakika)
3. ✅ **ADIM 3'ü Yap** - N8N'e eriş ve giriş yap (1 dakika)
4. ✅ **ADIM 4'ü Yap** - İlk test workflow'unu yap (5 dakika)
5. ⏸️ **DUR!** - Şimdilik yeter. N8N çalışıyor mu kontrol et.

---

## ❓ Sorun Mu Var?

### N8N Açılmıyor
- Railway'de servis çalışıyor mu kontrol et (Logs sekmesi)
- Domain oluşturulmuş mu kontrol et
- Environment variables doğru mu kontrol et

### Webhook Çalışmıyor
- Workflow aktif mi? (Sağ üstte "Active" switch)
- URL doğru mu kopyaladın?
- Railway'de n8n servisi çalışıyor mu?

### Hata Mesajı Alıyorum
- Railway logs'a bak (Settings > Logs)
- N8N içinde Execution sekmesinde hata var mı bak
- Environment variables eksik olabilir

---

## 📞 Yardım Lazımsa

1. **Railway Logs** - Hata mesajlarını gösterir
2. **N8N Execution Logs** - Workflow hatalarını gösterir
3. **Basit tut** - İlk başta karmaşık workflow'lar yapma

---

## 🎓 Sonraki Adımlar (Şimdilik YAPMA)

Bunları şimdi yapmana gerek yok. İlk önce N8N'in çalıştığından emin ol:

- ❌ Google Ads API entegrasyonu
- ❌ Meta Ads API entegrasyonu  
- ❌ Karmaşık workflow'lar
- ❌ Database entegrasyonu

**Önce temel çalışmalı, sonra geliştiririz.**

---

## ✅ Başarı Kriteri

Eğer şunlar çalışıyorsa başarılısın:
- ✅ N8N'e giriş yapabiliyorum
- ✅ Basit bir workflow oluşturabiliyorum
- ✅ Webhook test edip çalıştırabiliyorum

**Bu kadar! Gerisi kolay.**

---

**Sonraki Sefer:** Çalışıyorsa, basit bir otomasyon ekleriz (örnek: Email gönderme)



