/** Gelir hunisi ürün katalogu — IBAN public yok; WhatsApp ödeme */

export type ProductKind = 'digital_download' | 'service'

export type DigitalProduct = {
  slug: string
  name: string
  priceTry: number
  kind: ProductKind
  shortDescription: string
  description: string
  includes: string[]
  /** digital_download için content/digital-products altı */
  contentFile?: string
  href: string
}

export const FUNNEL = {
  leadHref: '/hizmetler/ucretsiz-seo-rehberi',
  kitHref: '/hizmetler/dijital-baslangic-kiti',
  auditHref: '/hizmetler/dijital-isletme-denetimi',
  careHref: '/hizmetler/dijital-bakim',
} as const

export const DIGITAL_PRODUCTS: DigitalProduct[] = [
  {
    slug: 'kobi-dijital-baslangic-kiti',
    name: 'KOBİ Dijital Başlangıç Kiti',
    priceTry: 890,
    kind: 'digital_download',
    href: FUNNEL.kitHref,
    shortDescription:
      'SEO, Google İşletme, Instagram, Ads ve AI prompt kontrol listeleri — hazır dijital paket.',
    description:
      'Ödeme onayı sonrası e-posta ile teslim. Küçük işletmeler için uygulanabilir kontrol listeleri ve şablonlar.',
    includes: [
      'SEO kontrol listesi',
      'Google İşletme Profili kontrol listesi',
      'Instagram işletme kontrol listesi',
      'Meta Business kurulum adımları',
      'Google Ads başlangıç şablonu',
      'Web sitesi SEO kontrol listesi',
      'ChatGPT prompt paketi',
      '30 günlük içerik takvimi',
      'Teklif ve fiyatlandırma şablonları',
    ],
    contentFile: 'kobi-dijital-baslangic-kiti.md',
  },
  {
    slug: 'dijital-isletme-denetimi',
    name: 'Dijital İşletme Denetimi',
    priceTry: 3900,
    kind: 'service',
    href: FUNNEL.auditHref,
    shortDescription:
      'Site, SEO, Google, Instagram, reklam ve dönüşüm odaklı yazılı denetim + öneriler.',
    description:
      'Form ile başvurursunuz. Ödeme sonrası işletmeniz incelenir; size özel rapor ve aksiyon listesi teslim edilir.',
    includes: [
      'Web sitesi ve teknik SEO özeti',
      'Google İşletme / arama görünürlüğü',
      'Instagram / sosyal varlık kontrolü',
      'Reklam ve dönüşüm fırsatları',
      'Rakip notları (özet)',
      'Öncelikli aksiyon listesi',
    ],
  },
  {
    slug: 'dijital-bakim-light',
    name: 'Dijital Bakım — Light',
    priceTry: 4900,
    kind: 'service',
    href: FUNNEL.careHref,
    shortDescription: 'Aylık SEO + Google İşletme kontrolü, kısa rapor ve 1 görüşme.',
    description:
      'Tekrarlayan aylık paket. Teknik kontrol, görünürlük takibi ve yönlendirme.',
    includes: [
      'Aylık SEO kontrolü',
      'Google İşletme kontrolü',
      'Kısa yazılı rapor',
      '1 online görüşme',
    ],
  },
  {
    slug: 'dijital-bakim-standart',
    name: 'Dijital Bakım — Standart',
    priceTry: 7900,
    kind: 'service',
    href: FUNNEL.careHref,
    shortDescription:
      'Light + içerik yönlendirmesi ve daha geniş aylık takip.',
    description:
      'Aylık bakımın geniş paketi. İçerik yönü ve temel reklam/görünürlük notları dahil.',
    includes: [
      'Light paketin tümü',
      'İçerik yönlendirmesi',
      'Genişletilmiş rapor',
      'Öncelik planı (30 gün)',
    ],
  },
]

export function getProductBySlug(slug: string): DigitalProduct | undefined {
  return DIGITAL_PRODUCTS.find((p) => p.slug === slug)
}

export function formatTry(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(amount)
}
