# 🚀 GitHub Actions Setup

Projeye otomatik CI/CD pipeline'ı ekleyin.

---

## 📋 Workflow Dosyaları

### 1. Lint & Test

`.github/workflows/test.yml`:

```yaml
name: Lint & Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Generate coverage report
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella
```

---

### 2. Build Check

`.github/workflows/build.yml`:

```yaml
name: Build Check

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build
        env:
          NEXT_PUBLIC_SITE_URL: https://okandemir.org
          NEXT_PUBLIC_GA_ID: ${{ secrets.NEXT_PUBLIC_GA_ID }}

      - name: Check build size
        run: |
          du -sh .next
          echo "Build size check completed"
```

---

### 3. Deploy to Railway

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: okandemirorg

      - name: Deployment notification
        if: success()
        run: echo "✅ Deployed successfully to Railway!"

      - name: Deployment failed
        if: failure()
        run: echo "❌ Deployment failed!"
```

---

### 4. Dependency Update

`.github/workflows/dependency-update.yml`:

```yaml
name: Dependency Update

on:
  schedule:
    # Her Pazartesi saat 09:00'da çalışır
    - cron: '0 9 * * 1'
  workflow_dispatch:

jobs:
  update-dependencies:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Update dependencies
        run: |
          npm update
          npm audit fix

      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v5
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: 'chore: update dependencies'
          title: 'chore: Weekly dependency update'
          body: 'Automated dependency update'
          branch: dependency-updates
```

---

## 🔐 GitHub Secrets

GitHub repo > Settings > Secrets and variables > Actions

### Required Secrets:

```
RAILWAY_TOKEN          # Railway API token
NEXT_PUBLIC_GA_ID      # Google Analytics ID (public)
CODECOV_TOKEN          # Codecov token (optional)
```

### Railway Token Nasıl Alınır:

1. [railway.app](https://railway.app) > Account Settings
2. Tokens > Create New Token
3. Token'ı kopyala
4. GitHub Secrets'a ekle

---

## 📊 Badge'ler

README.md'ye ekleyin:

```markdown
![Tests](https://github.com/username/okandemirorg/workflows/Lint%20&%20Test/badge.svg)
![Build](https://github.com/username/okandemirorg/workflows/Build%20Check/badge.svg)
![Coverage](https://codecov.io/gh/username/okandemirorg/branch/main/graph/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
```

---

## ✅ Kontrol Listesi

- [ ] `.github/workflows/` klasörü oluştur
- [ ] Test workflow'u ekle
- [ ] Build workflow'u ekle
- [ ] Deploy workflow'u ekle
- [ ] GitHub Secrets ayarla
- [ ] README'ye badge ekle
- [ ] İlk commit ve test et

---

## 🔄 Workflow Tetikleme

```bash
# Push ile otomatik
git push origin main

# Manuel tetikleme
# GitHub > Actions > Workflow seç > Run workflow
```

---

**Daha Fazla:** [GitHub Actions Docs](https://docs.github.com/en/actions)

