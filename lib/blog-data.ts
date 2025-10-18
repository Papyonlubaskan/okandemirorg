// Blog Kategorileri ve SEO İçerikleri
export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  city?: string
  industry?: string
  keywords: string[]
  content: string
  author: string
  date: string
  image: string
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string
  count: number
}

// Ana Kategoriler
export const blogCategories: BlogCategory[] = [
  {
    id: '1',
    name: 'Dijital Pazarlama',
    slug: 'dijital-pazarlama',
    description: 'Dijital pazarlama stratejileri, ipuçları ve güncel trendler',
    count: 500
  },
  {
    id: '2',
    name: 'SEO Optimizasyonu',
    slug: 'seo-optimizasyonu',
    description: 'Arama motoru optimizasyonu rehberleri ve teknikleri',
    count: 400
  },
  {
    id: '3',
    name: 'Web Tasarım',
    slug: 'web-tasarim',
    description: 'Modern web tasarım trendleri ve UX/UI ipuçları',
    count: 300
  },
  {
    id: '4',
    name: 'Sosyal Medya',
    slug: 'sosyal-medya',
    description: 'Sosyal medya stratejileri ve platform rehberleri',
    count: 350
  },
  {
    id: '5',
    name: 'Google Ads',
    slug: 'google-ads',
    description: 'Google reklamcılık stratejileri ve kampanya yönetimi',
    count: 250
  },
  {
    id: '6',
    name: 'Meta Business',
    slug: 'meta-business',
    description: 'Facebook ve Instagram reklam yönetimi',
    count: 250
  },
  {
    id: '7',
    name: 'E-Ticaret',
    slug: 'e-ticaret',
    description: 'E-ticaret stratejileri ve online satış artırma',
    count: 200
  },
  {
    id: '8',
    name: 'İçerik Pazarlama',
    slug: 'icerik-pazarlama',
    description: 'İçerik stratejileri ve blog yazımı teknikleri',
    count: 200
  },
  {
    id: '9',
    name: 'Dijital Dönüşüm',
    slug: 'dijital-donusum',
    description: 'İşletmelerde dijital dönüşüm süreçleri',
    count: 150
  },
  {
    id: '10',
    name: 'Marka Kimliği',
    slug: 'marka-kimligi',
    description: 'Marka oluşturma ve kimlik tasarımı',
    count: 150
  }
]

// Türkiye Şehirleri (81 il)
export const cities = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan', 'Artvin',
  'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur',
  'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan',
  'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul',
  'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kırıkkale', 'Kırklareli', 'Kırşehir',
  'Kilis', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş',
  'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas',
  'Şanlıurfa', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
]

// Sektörler
export const industries = [
  'Turizm', 'Otel', 'Restoran', 'Cafe', 'Sağlık', 'Eğitim', 'Gayrimenkul', 'Otomotiv', 'Perakende',
  'Finans', 'Sigorta', 'Teknoloji', 'Yazılım', 'Yapı', 'İnşaat', 'Mobilya', 'Tekstil', 'Kozmetik',
  'Moda', 'Spor', 'Eğlence', 'Medya', 'Danışmanlık', 'Hukuk', 'Muhasebe', 'Nakliye', 'Lojistik',
  'Üretim', 'Gıda', 'İçecek', 'Enerji', 'Tarım', 'Hayvancılık', 'Su Ürünleri', 'Orman', 'Maden',
  'Kimya', 'Plastik', 'Kağıt', 'Ambalaj', 'Baskı', 'Reklam', 'Organizasyon', 'Etkinlik', 'Düğün',
  'Fotoğrafçılık', 'Video Prodüksiyon', 'Müzik', 'Sanat', 'Tasarım', 'Mimarlık', 'İç Mimarlık',
  'Peyzaj', 'Güvenlik', 'Temizlik', 'Bakım', 'Onarım', 'Servis', 'Danışmanlık', 'Eğitim', 'Kurs'
]

// Hizmet Tipleri
export const serviceTypes = [
  'Dijital Pazarlama Hizmeti',
  'SEO Hizmeti',
  'Google Ads Yönetimi',
  'Meta Ads Yönetimi',
  'Sosyal Medya Yönetimi',
  'Web Tasarım Hizmeti',
  'WordPress Tasarım',
  'E-Ticaret Sitesi',
  'Kurumsal Web Sitesi',
  'Kişisel Web Sitesi',
  'Blog Tasarımı',
  'Landing Page Tasarımı',
  'Logo Tasarımı',
  'Marka Kimliği Tasarımı',
  'Grafik Tasarım',
  'İçerik Yazımı',
  'Copywriting',
  'Video Prodüksiyon',
  'Fotoğraf Çekimi',
  'Dijital Dönüşüm Danışmanlığı'
]

// SEO Anahtar Kelime Kombinasyonları
export const seoKeywordCombinations = [
  'nasıl yapılır',
  'nedir',
  'ne demek',
  'fiyatları',
  'örnekleri',
  'stratejileri',
  'ipuçları',
  'teknikleri',
  'rehberi',
  'eğitimi',
  'danışmanlığı',
  'uzmanı',
  'ajansı',
  'şirketi',
  'hizmeti',
  'çözümleri',
  'kampanyası',
  'yönetimi',
  'optimizasyonu',
  'analizi',
  'raporu',
  'araçları',
  'yazılımı',
  'uygulaması',
  'platformu'
]

// Blog Post Generator
export function generateBlogPosts(): BlogPost[] {
  const posts: BlogPost[] = []
  let idCounter = 1

  // 1. Kategori bazlı blog postları
  blogCategories.forEach((category) => {
    for (let i = 0; i < 50; i++) {
      posts.push({
        id: `${idCounter++}`,
        slug: `${category.slug}-${i + 1}`,
        title: `${category.name} - ${seoKeywordCombinations[i % seoKeywordCombinations.length]}`,
        excerpt: `${category.description} hakkında detaylı bilgiler ve ipuçları.`,
        category: category.name,
        keywords: [category.slug, seoKeywordCombinations[i % seoKeywordCombinations.length]],
        content: `${category.description} konusunda detaylı rehber.`,
        author: 'Okan Demir',
        date: new Date().toISOString(),
        image: '/blog-default.jpg'
      })
    }
  })

  // 2. Şehir bazlı hizmet sayfaları
  cities.forEach(city => {
    serviceTypes.slice(0, 10).forEach(service => {
      posts.push({
        id: `${idCounter++}`,
        slug: `${city.toLowerCase().replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o')}-${service.toLowerCase().replace(/\s+/g, '-')}`,
        title: `${city} ${service}`,
        excerpt: `${city} için profesyonel ${service.toLowerCase()} hizmeti.`,
        category: 'Şehir Bazlı Hizmetler',
        city: city,
        keywords: [city, service, 'dijital pazarlama'],
        content: `${city} bölgesinde ${service.toLowerCase()} arıyorsanız doğru yerdesiniz.`,
        author: 'Okan Demir',
        date: new Date().toISOString(),
        image: '/blog-default.jpg'
      })
    })
  })

  // 3. Sektör bazlı çözümler
  industries.forEach(industry => {
    serviceTypes.slice(0, 5).forEach(service => {
      posts.push({
        id: `${idCounter++}`,
        slug: `${industry.toLowerCase().replace(/\s+/g, '-')}-${service.toLowerCase().replace(/\s+/g, '-')}`,
        title: `${industry} Sektörü İçin ${service}`,
        excerpt: `${industry} sektörüne özel ${service.toLowerCase()} çözümleri.`,
        category: 'Sektör Çözümleri',
        industry: industry,
        keywords: [industry, service, 'dijital çözümler'],
        content: `${industry} sektöründe ${service.toLowerCase()} ile fark yaratın.`,
        author: 'Okan Demir',
        date: new Date().toISOString(),
        image: '/blog-default.jpg'
      })
    })
  })

  return posts
}

// Toplam sayfa sayısını hesapla
export function getTotalPageCount(): number {
  const categoryPosts = blogCategories.reduce((sum) => sum + 50, 0) // 500
  const cityPosts = cities.length * 10 // 810
  const industryPosts = industries.length * 5 // 315
  return categoryPosts + cityPosts + industryPosts // 1625+ 
}

