# 🤝 Katkıda Bulunma Rehberi

Projeye katkıda bulunmak isterseniz aşağıdaki adımları takip edin.

---

## 🚀 Başlangıç

### 1. Fork & Clone

```bash
# Projeyi fork edin (GitHub'da)
# Ardından fork'unuzu klonlayın
git clone https://github.com/YOUR-USERNAME/okandemirorg.git
cd okandemirorg
```

### 2. Branch Oluşturun

```bash
# Feature branch oluştur
git checkout -b feature/amazing-feature

# Veya bug fix için
git checkout -b fix/bug-description
```

### 3. Geliştirme Yapın

```bash
# Dependencies yükle
npm install

# .env.local oluştur
cp .env.local.template .env.local

# Geliştirme sunucusu başlat
npm run dev
```

---

## 📝 Commit Kuralları

### Conventional Commits

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: Yeni özellik
- `fix`: Bug düzeltme
- `docs`: Dokümantasyon
- `style`: Kod formatı (işlevselliği etkilemez)
- `refactor`: Kod yeniden yapılandırma
- `perf`: Performance iyileştirme
- `test`: Test ekleme/düzeltme
- `chore`: Diğer değişiklikler (build, vb.)

### Örnekler

```bash
# Yeni özellik
git commit -m "feat(newsletter): add email subscription form"

# Bug fix
git commit -m "fix(header): mobile menu not closing on link click"

# Dokümantasyon
git commit -m "docs(readme): update installation instructions"

# Performance
git commit -m "perf(images): optimize hero images with WebP format"
```

---

## 🧪 Test Etme

```bash
# Tests çalıştır
npm test

# Lint kontrol
npm run lint

# Build test
npm run build
```

Tüm testler başarılı olmalı!

---

## 📋 Pull Request Süreci

### 1. Son Değişiklikleri Çek

```bash
git checkout main
git pull upstream main
git checkout feature/amazing-feature
git rebase main
```

### 2. Push Yapın

```bash
git push origin feature/amazing-feature
```

### 3. Pull Request Oluşturun

GitHub'da:
1. "New Pull Request" butonuna tıklayın
2. Template'i doldurun
3. Screenshots ekleyin (UI değişiklikleri için)
4. Testlerin geçtiğini doğrulayın

### PR Template

```markdown
## Açıklama
Bu PR ne yapıyor? Kısa açıklama.

## Değişiklik Tipi
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Test Edildi mi?
- [ ] Evet, tüm testler geçiyor
- [ ] Yeni testler eklendi

## Screenshots (UI değişiklikleri için)
Varsa ekleyin.

## Checklist
- [ ] Kod kendi kendini açıklıyor
- [ ] Dokümantasyon güncellendi
- [ ] Testler eklendi/güncellendi
- [ ] Lint hataları yok
```

---

## 💻 Kod Standartları

### TypeScript

```typescript
// ✅ İyi
interface User {
  id: string
  name: string
  email: string
}

function getUserById(id: string): User | null {
  // ...
}

// ❌ Kötü
function getUser(id: any): any {
  // ...
}
```

### React Components

```tsx
// ✅ İyi - Functional Component
interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  onClick?: () => void
}

export default function Button({ 
  children, 
  variant = 'primary',
  onClick 
}: ButtonProps) {
  return (
    <button 
      className={cn(
        'px-4 py-2 rounded',
        variant === 'primary' ? 'bg-blue-500' : 'bg-gray-500'
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

// ❌ Kötü - Tip yok
export default function Button(props) {
  return <button>{props.children}</button>
}
```

### CSS/Tailwind

```tsx
// ✅ İyi - Tailwind utilities
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md">

// ❌ Kötü - Inline styles
<div style={{ display: 'flex', padding: '24px' }}>
```

---

## 📁 Proje Yapısı

```
app/                    # Next.js App Router
├── api/               # API routes
├── blog/              # Blog sayfaları
├── hizmetler/         # Hizmet sayfaları
└── ...

components/            # React components
├── ui/               # UI primitives (Button, Input, vb.)
└── ...

lib/                   # Utilities & helpers
├── mysql.ts          # Database
├── utils.ts          # Genel utilities
└── ...

public/               # Static files
└── images/

styles/               # Global CSS
```

---

## 🎨 Component Geliştirme

### 1. Component Şablonu

```tsx
// components/MyComponent.tsx
'use client' // Sadece client component'ler için

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface MyComponentProps {
  title: string
  description?: string
  className?: string
}

export default function MyComponent({ 
  title, 
  description,
  className 
}: MyComponentProps) {
  const [isActive, setIsActive] = useState(false)

  return (
    <div className={cn('base-classes', className)}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}
```

### 2. Test Yazın

```tsx
// __tests__/components/MyComponent.test.tsx
import { render, screen } from '@testing-library/react'
import MyComponent from '@/components/MyComponent'

describe('MyComponent', () => {
  it('renders title', () => {
    render(<MyComponent title="Test Title" />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })
})
```

---

## 🐛 Bug Raporu

GitHub Issues'da yeni issue oluşturun:

### Issue Template

```markdown
## Bug Açıklaması
Ne oluyor?

## Beklenen Davranış
Ne olmalıydı?

## Mevcut Davranış
Ne oluyor?

## Adımlar (Reproduce için)
1. '...' git
2. '...' tıkla
3. Aşağı kaydır
4. Hatayı gör

## Ekran Görüntüleri
Varsa ekleyin.

## Ortam
- OS: [e.g. macOS 12.0]
- Browser: [e.g. Chrome 95]
- Node: [e.g. 20.0.0]
```

---

## ✨ Feature İsteği

```markdown
## Özellik Açıklaması
Ne istiyorsunuz?

## Motivasyon
Neden gerekli?

## Alternatifler
Başka çözümler düşündünüz mü?

## Ek Bilgi
Başka detay var mı?
```

---

## 📚 Kaynaklar

- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Testing Library](https://testing-library.com/react)

---

## 💬 İletişim

- **GitHub Issues:** Teknik sorular
- **Email:** info@okandemir.org
- **WhatsApp:** +905552677739

---

## 📜 Code of Conduct

Katkıda bulunanların:
- Saygılı ve profesyonel olması
- Yapıcı geri bildirim vermesi
- Çeşitliliğe saygı göstermesi

beklenir.

---

Teşekkürler! 🙏

