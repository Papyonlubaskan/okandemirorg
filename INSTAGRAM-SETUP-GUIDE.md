# 📸 Instagram Graph API Setup Kılavuzu

Instagram Graph API entegrasyonu için adım adım kurulum.

---

## 🔧 1. Facebook Developer Console Setup

### Adım 1: App Oluşturma
1. [Facebook Developers](https://developers.facebook.com) > Create App
2. **App Type:** Business
3. **App Name:** "Okan Demir Portfolio"
4. **Contact Email:** info@okandemir.org

### Adım 2: Instagram Basic Display Ekleme
1. App Dashboard > Add Product
2. **Instagram Basic Display** > Set Up
3. **Valid OAuth Redirect URIs:**
   ```
   https://okandemir.org/api/instagram/auth
   https://localhost:3000/api/instagram/auth
   ```

### Adım 3: App Review (Production için)
1. **App Review** > Permissions and Features
2. **Request:** `instagram_basic` permission
3. **Use Case:** Portfolio showcase
4. **Test Users:** Instagram hesabınızı ekleyin

---

## 🔑 2. Access Token Alma

### Yöntem 1: Otomatik (Önerilen)
```bash
# Browser'da açın:
https://okandemir.org/api/instagram/auth
```

### Yöntem 2: Manuel
1. Instagram hesabınızda:
   - Settings > Apps and Websites > Tester Invites
   - Test invitation'ı kabul edin

2. Bu URL'i açın:
   ```
   https://api.instagram.com/oauth/authorize?client_id=25354205500863758&redirect_uri=https://okandemir.org/api/instagram/auth&scope=user_profile,user_media&response_type=code
   ```

---

## 📝 3. Environment Variables

### Local Development (.env.local):
```env
INSTAGRAM_APP_ID=25354205500863758
INSTAGRAM_APP_SECRET=ddc77cd5c03c9a417b54a8cdc03419f8
INSTAGRAM_ACCESS_TOKEN=IGQVJ... # Alacağınız token
```

### Railway Production:
```env
INSTAGRAM_APP_ID=25354205500863758
INSTAGRAM_APP_SECRET=ddc77cd5c03c9a417b54a8cdc03419f8
INSTAGRAM_ACCESS_TOKEN=IGQVJ... # Alacağınız token
```

---

## 🧪 4. Test Etme

### API Endpoints:
```bash
# Instagram feed al
GET /api/instagram/feed

# Access token yenile
POST /api/instagram/refresh

# OAuth flow başlat
GET /api/instagram/auth
```

### Component Kullanımı:
```tsx
import InstagramFeed from '@/components/InstagramFeed'

<InstagramFeed maxPosts={6} />
```

---

## ⚠️ 5. Token Yönetimi

### Token Süresi:
- **Short-lived:** 1 saat
- **Long-lived:** 60 gün
- **Refresh:** 60 günde bir yenileme gerekli

### Otomatik Yenileme:
```typescript
// Her 30 günde bir çalıştırın
const refreshToken = async () => {
  const response = await fetch('/api/instagram/refresh', {
    method: 'POST'
  })
  const data = await response.json()
  console.log('New token:', data.accessToken)
}
```

---

## 🚨 6. Troubleshooting

### Yaygın Hatalar:

#### "Invalid redirect_uri"
```
Çözüm: Facebook Developer Console'da redirect URI'yi ekleyin
```

#### "User not authorized"
```
Çözüm: Instagram hesabınızı test user olarak ekleyin
```

#### "Access token expired"
```
Çözüm: Token'ı yenileyin (/api/instagram/refresh)
```

#### "Media not found"
```
Çözüm: Instagram hesabında public post'lar olduğundan emin olun
```

---

## 📊 7. Rate Limits

### Instagram Graph API Limits:
- **User Media:** 200 requests/hour
- **User Profile:** 200 requests/hour
- **Long-lived Token:** 1 request/day

### Öneriler:
- Cache kullanın (1 saat)
- Batch requests yapın
- Error handling ekleyin

---

## 🔄 8. Production Deployment

### Railway Environment Variables:
1. Railway Dashboard > Variables
2. Şu değişkenleri ekleyin:
   ```
   INSTAGRAM_APP_ID=25354205500863758
   INSTAGRAM_APP_SECRET=ddc77cd5c03c9a417b54a8cdc03419f8
   INSTAGRAM_ACCESS_TOKEN=[alacağınız-token]
   ```

### Domain Configuration:
1. Facebook Developer Console > Instagram Basic Display
2. **Valid OAuth Redirect URIs:**
   ```
   https://okandemir.org/api/instagram/auth
   ```

---

## 📱 9. Instagram Feed Component

### Özellikler:
- ✅ Responsive grid layout
- ✅ Video thumbnail support
- ✅ Carousel album support
- ✅ Caption overlay
- ✅ Loading states
- ✅ Error handling
- ✅ Token refresh

### Kullanım:
```tsx
// Ana sayfada
<InstagramFeed maxPosts={6} />

// Blog sayfasında
<InstagramFeed maxPosts={3} />
```

---

## 🎯 10. Sonraki Adımlar

1. ✅ Access token alın
2. ✅ Environment variables ayarlayın
3. ✅ Component'i test edin
4. ✅ Production'a deploy edin
5. ✅ Token refresh otomasyonu ekleyin

---

## 📚 Kaynaklar

- [Instagram Basic Display API](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
- [Facebook Developer Console](https://developers.facebook.com)

---

**Son Güncelleme:** 19 Ekim 2025
