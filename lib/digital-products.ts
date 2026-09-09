/** Havale ile satılan dijital ürün kataloğu — tek kaynak */

export type DigitalProduct = {
  slug: string
  name: string
  priceTry: number
  shortDescription: string
  description: string
  includes: string[]
  /** private/content altında dosya adı */
  contentFile: string
}

export const DIGITAL_PRODUCTS: DigitalProduct[] = [
  {
    slug: 'kobi-dijital-baslangic-kiti',
    name: 'KOBİ Dijital Başlangıç Kiti',
    priceTry: 399,
    shortDescription:
      'Küçük işletmeler için SEO, Google İşletme, Instagram, Ads ve AI prompt kontrol listeleri.',
    description:
      'Bir kez hazırlanan, havale sonrası anında (ödeme onayıyla) teslim edilen dijital ürün. Hastanede çalışırken bile sipariş alıp onaylayabilirsiniz.',
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
