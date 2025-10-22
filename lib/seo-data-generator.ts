// SEO İçerik Üretici - 1000+ Ek Sayfa

export interface SEOPage {
  id: string
  slug: string
  title: string
  description: string
  category: string
  keywords: string[]
  h1: string
  h2s: string[]
  faqs: Array<{ question: string; answer: string }>
}

// Ana konular
const mainTopics = [
  'Dijital Pazarlama',
  'SEO Optimizasyonu',
  'Google Ads',
  'Meta Business',
  'Sosyal Medya Yönetimi',
  'Web Tasarım',
  'E-Ticaret',
  'İçerik Pazarlama',
  'Email Marketing',
  'Video Marketing',
  'Marka Kimliği',
  'Dijital Dönüşüm',
]

// Soru tipleri
const questionTypes = [
  'nedir',
  'nasıl yapılır',
  'ne demek',
  'örnekleri',
  'ipuçları',
  'stratejileri',
  'teknikleri',
  'rehberi',
  'fiyatları',
  'avantajları',
  'dezavantajları',
  'neden önemli',
  'faydaları',
  'zararları',
  'öğrenmek',
  'başlamak',
  'kullanmak',
  'optimize etmek',
  'artırmak',
  'geliştirmek',
  'yönetmek',
  'ölçmek',
  'analiz etmek',
  'raporlamak',
]

// Yıl/Tarih bazlı
const years = ['2024', '2025']

// Platform bazlı
const platforms = [
  'Instagram',
  'Facebook',
  'Twitter',
  'LinkedIn',
  'TikTok',
  'YouTube',
  'Google',
  'Meta',
  'Pinterest',
  'Snapchat',
]

// Hedef kitle bazlı
const targetAudiences = [
  'Küçük İşletmeler',
  'Girişimciler',
  'E-Ticaret Siteleri',
  'Kurumsal Firmalar',
  'Freelancerlar',
  'Ajanslar',
  'Startuplar',
  'KOBİler',
  'Yeni Başlayanlar',
  'Profesyoneller',
]

// Bütçe bazlı
const budgets = [
  'Düşük Bütçe',
  'Orta Bütçe',
  'Yüksek Bütçe',
  'Sıfır Bütçe',
  'Ücretsiz',
]


// SEO sayfaları oluştur
export function generateSEOPages(): SEOPage[] {
  const pages: SEOPage[] = []
  let idCounter = 1

  // 1. Ana konu + Soru tipi kombinasyonları (300 sayfa)
  mainTopics.forEach(topic => {
    questionTypes.slice(0, 25).forEach(question => {
      const slug = `${topic.toLowerCase().replace(/\s+/g, '-')}-${question.replace(/\s+/g, '-')}`
      pages.push({
        id: `seo-${idCounter++}`,
        slug: slug,
        title: `${topic} ${question.charAt(0).toUpperCase() + question.slice(1)}?`,
        description: `${topic} ${question} hakkında detaylı bilgiler, ipuçları ve profesyonel rehber.`,
        category: topic,
        keywords: [topic, question, 'Okan Demir', 'dijital pazarlama'],
        h1: `${topic} ${question.charAt(0).toUpperCase() + question.slice(1)}`,
        h2s: [
          `${topic} Nedir?`,
          `${topic} Nasıl Yapılır?`,
          `${topic} İpuçları`,
          'Başarı İçin Stratejiler',
          'Sıkça Sorulan Sorular',
        ],
        faqs: [
          {
            question: `${topic} nedir?`,
            answer: `${topic}, dijital pazarlama stratejilerinin önemli bir parçasıdır ve işletmelerin online varlığını güçlendirmek için kullanılır.`,
          },
          {
            question: `${topic} nasıl yapılır?`,
            answer: `${topic} için profesyonel bir strateji geliştirmek, hedef kitle analizi yapmak ve sürekli optimizasyon gereklidir.`,
          },
        ],
      })
    })
  })

  // 2. Platform + Ana konu (120 sayfa)
  platforms.forEach(platform => {
    mainTopics.forEach(topic => {
      const slug = `${platform.toLowerCase()}-${topic.toLowerCase().replace(/\s+/g, '-')}`
      pages.push({
        id: `seo-${idCounter++}`,
        slug: slug,
        title: `${platform} ${topic} | Profesyonel Rehber`,
        description: `${platform} platformunda ${topic.toLowerCase()} stratejileri ve ipuçları.`,
        category: `${platform} ${topic}`,
        keywords: [platform, topic, 'sosyal medya', 'dijital pazarlama'],
        h1: `${platform} ${topic}`,
        h2s: [
          `${platform}'da ${topic}`,
          'Başarılı Stratejiler',
          'En İyi Uygulamalar',
          'Yaygın Hatalar',
        ],
        faqs: [],
      })
    })
  })

  // 3. Hedef kitle + Hizmet (100 sayfa)
  targetAudiences.forEach(audience => {
    mainTopics.slice(0, 10).forEach(topic => {
      const slug = `${audience.toLowerCase().replace(/\s+/g, '-')}-${topic.toLowerCase().replace(/\s+/g, '-')}`
      pages.push({
        id: `seo-${idCounter++}`,
        slug: slug,
        title: `${audience} İçin ${topic}`,
        description: `${audience} için özel ${topic.toLowerCase()} çözümleri ve stratejileri.`,
        category: 'Hedef Kitle Odaklı',
        keywords: [audience, topic, 'çözümler', 'stratejiler'],
        h1: `${audience} İçin ${topic}`,
        h2s: [
          `${audience} Neden ${topic} İhtiyaç Duyar?`,
          'Özel Çözümler',
          'Başarı Hikayeleri',
          'Hemen Başlayın',
        ],
        faqs: [],
      })
    })
  })

  // 4. Bütçe + Hizmet (60 sayfa)
  budgets.forEach(budget => {
    mainTopics.slice(0, 12).forEach(topic => {
      const slug = `${budget.toLowerCase().replace(/\s+/g, '-')}-${topic.toLowerCase().replace(/\s+/g, '-')}`
      pages.push({
        id: `seo-${idCounter++}`,
        slug: slug,
        title: `${budget} ile ${topic}`,
        description: `${budget} ile ${topic.toLowerCase()} nasıl yapılır? Uygun maliyetli stratejiler.`,
        category: 'Bütçe Odaklı',
        keywords: [budget, topic, 'uygun fiyat', 'ekonomik'],
        h1: `${budget} ile ${topic}`,
        h2s: [
          'Bütçe Dostu Stratejiler',
          'Maliyetleri Düşürme',
          'En İyi ROI',
        ],
        faqs: [],
      })
    })
  })

  // 5. Yıl bazlı trendler (50 sayfa)
  years.forEach(year => {
    mainTopics.forEach(topic => {
      const slug = `${year}-${topic.toLowerCase().replace(/\s+/g, '-')}-trendleri`
      pages.push({
        id: `seo-${idCounter++}`,
        slug: slug,
        title: `${year} ${topic} Trendleri`,
        description: `${year} yılında ${topic.toLowerCase()} trendleri, stratejileri ve tahminleri.`,
        category: 'Trendler',
        keywords: [year, topic, 'trendler', 'gelecek'],
        h1: `${year} ${topic} Trendleri`,
        h2s: [
          `${year}'de Neler Değişti?`,
          'Yeni Stratejiler',
          'Gelecek Tahminleri',
        ],
        faqs: [],
      })
    })
  })

  // 6. Karşılaştırma sayfaları (100 sayfa)
  for (let i = 0; i < mainTopics.length - 1; i++) {
    for (let j = i + 1; j < mainTopics.length; j++) {
      if (pages.length >= 1000) break
      const topic1 = mainTopics[i]
      const topic2 = mainTopics[j]
      const slug = `${topic1.toLowerCase().replace(/\s+/g, '-')}-vs-${topic2.toLowerCase().replace(/\s+/g, '-')}`
      pages.push({
        id: `seo-${idCounter++}`,
        slug: slug,
        title: `${topic1} vs ${topic2}: Hangisi Daha İyi?`,
        description: `${topic1} ve ${topic2} karşılaştırması. Avantajlar, dezavantajlar ve hangisini seçmelisiniz?`,
        category: 'Karşılaştırma',
        keywords: [topic1, topic2, 'karşılaştırma', 'fark'],
        h1: `${topic1} vs ${topic2}`,
        h2s: [
          `${topic1} Nedir?`,
          `${topic2} Nedir?`,
          'Avantajlar ve Dezavantajlar',
          'Hangisi Sizin İçin?',
        ],
        faqs: [],
      })
    }
  }

  // 7. "En İyi" listeleri (200 sayfa)
  const listNumbers = [5, 7, 10, 15, 20]
  listNumbers.forEach(num => {
    mainTopics.forEach(topic => {
      const variants = [
        `araç`,
        `strateji`,
        `yöntem`,
        `teknik`,
        `ipucu`,
        `örnek`,
        `kampanya`,
        `uygulama`,
      ]
      variants.forEach(variant => {
        if (pages.length >= 1500) return
        const slug = `en-iyi-${num}-${topic.toLowerCase().replace(/\s+/g, '-')}-${variant}`
        pages.push({
          id: `seo-${idCounter++}`,
          slug: slug,
          title: `En İyi ${num} ${topic} ${variant.charAt(0).toUpperCase() + variant.slice(1)}`,
          description: `2025 için en iyi ${num} ${topic.toLowerCase()} ${variant}ı. Profesyonel öneriler ve incelemeler.`,
          category: 'Listeler',
          keywords: [topic, variant, 'en iyi', 'liste'],
          h1: `En İyi ${num} ${topic} ${variant.charAt(0).toUpperCase() + variant.slice(1)}`,
          h2s: Array.from({ length: Math.min(num, 5) }, (_, i) => `${i + 1}. ${variant.charAt(0).toUpperCase() + variant.slice(1)}`),
          faqs: [],
        })
      })
    })
  })

  return pages.slice(0, 1500) // İlk 1500 sayfayı döndür
}

// Toplam SEO sayfası sayısı
export function getTotalSEOPageCount(): number {
  return generateSEOPages().length
}

