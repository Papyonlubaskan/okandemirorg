# 🧪 Testing Kılavuzu

## Test Setup

Jest ve React Testing Library ile test ortamı kuruldu.

### Test Çalıştırma

```bash
# Tüm testleri çalıştır
npm test

# Watch mode (değişiklikleri izle)
npm run test:watch

# Coverage raporu
npm run test:coverage
```

---

## Test Yapısı

```
__tests__/
├── components/          # Component testleri
│   └── Header.test.tsx
├── lib/                 # Utility testleri
│   └── utils.test.ts
└── api/                 # API testleri (gelecek)
```

---

## Örnek Test: Component

```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import Button from '@/components/ui/Button'

describe('Button Component', () => {
  it('renders with text', () => {
    render(<Button>Click Me</Button>)
    expect(screen.getByText('Click Me')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    
    fireEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies variant styles', () => {
    render(<Button variant="primary">Primary</Button>)
    const button = screen.getByText('Primary')
    expect(button).toHaveClass('bg-primary')
  })
})
```

---

## Örnek Test: API Route

```typescript
// __tests__/api/newsletter.test.ts
import { POST } from '@/app/api/newsletter/route'
import { NextRequest } from 'next/server'

describe('/api/newsletter', () => {
  it('subscribes email successfully', async () => {
    const request = new NextRequest('http://localhost:3000/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
  })

  it('validates email format', async () => {
    const request = new NextRequest('http://localhost:3000/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email: 'invalid-email' })
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })
})
```

---

## Örnek Test: Utility Function

```typescript
// __tests__/lib/formValidation.test.ts
import { validateEmail, validatePhone } from '@/lib/formValidation'

describe('Form Validation', () => {
  describe('validateEmail', () => {
    it('accepts valid emails', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user+tag@domain.co.uk')).toBe(true)
    })

    it('rejects invalid emails', () => {
      expect(validateEmail('invalid')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
    })
  })

  describe('validatePhone', () => {
    it('accepts Turkish phone numbers', () => {
      expect(validatePhone('05551234567')).toBe(true)
      expect(validatePhone('+905551234567')).toBe(true)
    })

    it('rejects invalid phone numbers', () => {
      expect(validatePhone('123')).toBe(false)
      expect(validatePhone('abc')).toBe(false)
    })
  })
})
```

---

## Coverage Hedefleri

| Kategori | Hedef | Mevcut |
|----------|-------|--------|
| Statements | 80% | - |
| Branches | 75% | - |
| Functions | 80% | - |
| Lines | 80% | - |

---

## Best Practices

### 1. Test İsimlendirme
```typescript
// ✅ İyi
it('renders error message when email is invalid', () => {})

// ❌ Kötü
it('test 1', () => {})
```

### 2. Arrange-Act-Assert Pattern
```typescript
it('updates user name', () => {
  // Arrange (Hazırlık)
  const user = { name: 'Old Name' }
  
  // Act (Aksiyon)
  updateUserName(user, 'New Name')
  
  // Assert (Doğrulama)
  expect(user.name).toBe('New Name')
})
```

### 3. Mock External Dependencies
```typescript
// API çağrılarını mock'layın
jest.mock('@/lib/api', () => ({
  fetchData: jest.fn(() => Promise.resolve({ data: 'mock' }))
}))
```

### 4. Test Isolation
```typescript
// Her test bağımsız olmalı
beforeEach(() => {
  // Test state'ini sıfırla
  cleanup()
})
```

---

## Yararlı Matcher'lar

```typescript
// Boolean
expect(true).toBeTruthy()
expect(false).toBeFalsy()

// Numbers
expect(4).toBeGreaterThan(3)
expect(4).toBeLessThan(5)
expect(0.1 + 0.2).toBeCloseTo(0.3)

// Strings
expect('team').toMatch(/tea/)
expect('Christoph').toContain('stop')

// Arrays
expect(['apple', 'banana']).toContain('apple')
expect([1, 2, 3]).toHaveLength(3)

// Objects
expect({ name: 'John' }).toHaveProperty('name')
expect({ name: 'John' }).toMatchObject({ name: 'John' })

// Exceptions
expect(() => throwError()).toThrow()
expect(() => throwError()).toThrow('error message')

// Async
await expect(fetchData()).resolves.toEqual({ data: 'ok' })
await expect(fetchData()).rejects.toThrow()

// DOM (Testing Library)
expect(element).toBeInTheDocument()
expect(element).toHaveClass('active')
expect(element).toHaveAttribute('href', '/home')
```

---

## Debug İpuçları

### 1. Screen Debug
```typescript
import { screen } from '@testing-library/react'

// Tüm DOM'u göster
screen.debug()

// Belirli elementi göster
screen.debug(screen.getByTestId('my-element'))
```

### 2. Testing Playground
```typescript
import { screen } from '@testing-library/react'

// Doğru query'leri bulmak için
screen.logTestingPlaygroundURL()
```

### 3. Act Warnings
```typescript
import { act } from '@testing-library/react'

// State güncellemelerini wrap edin
await act(async () => {
  await updateState()
})
```

---

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
```

---

## Gelecek Testler

- [ ] API routes testleri
- [ ] Form validation testleri
- [ ] SEO analyzer testleri
- [ ] Email sending testleri
- [ ] Database operations testleri
- [ ] E2E tests (Playwright/Cypress)

---

**Test Coverage Raporu:**
```bash
npm run test:coverage
```

Coverage raporu `coverage/` klasöründe oluşturulur.
HTML rapor: `coverage/lcov-report/index.html`

