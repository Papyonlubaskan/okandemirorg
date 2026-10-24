import { siteSchema, type SiteSchema, type SiteSection, type SiteTheme } from './schema'

export type SiteBrief = {
  businessName: string
  sector: string
  city?: string
  service?: string
  description?: string
  phone?: string
  whatsapp?: string
  email?: string
  style?: 'modern' | 'luks' | 'samimi' | 'kurumsal' | 'canli'
}

type Preset = {
  key: string
  match: RegExp
  theme: SiteTheme
  services: [string, string][]
  features: [string, string, string][]
  faq: [string, string][]
  heroCta: string
}

const PRESETS: Preset[] = [
  {
    key: 'guzellik',
    match: /kuaf|berber|güzellik|guzellik|salon|estetik|nail|tırnak|spa|makyaj/i,
    theme: { primary: '#be185d', accent: '#f59e0b', mode: 'light', font: 'friendly', radius: 'lg' },
    services: [['Saç Kesimi & Şekillendirme', 'Yüz hattınıza uygun modern kesimler.'], ['Renklendirme', 'Boya, röfle ve ombre uygulamaları.'], ['Bakım', 'Keratin ve nem bakımları.'], ['Özel Gün', 'Gelin ve davet saç & makyajı.']],
    features: [['✨', 'Uzman Kadro', 'Sürekli eğitim alan deneyimli ekip.'], ['🧴', 'Kaliteli Ürünler', 'Profesyonel ve saç dostu markalar.'], ['📅', 'Kolay Randevu', 'WhatsApp’tan saniyeler içinde randevu.']],
    faq: [['Randevusuz gelebilir miyim?', 'Yoğunluğa göre mümkün; randevu ile beklemeden hizmet alırsınız.'], ['Ödeme seçenekleri neler?', 'Nakit ve kredi kartı kabul ediyoruz.']],
    heroCta: 'Randevu Al',
  },
  {
    key: 'yeme',
    match: /restoran|kafe|cafe|lokanta|pastane|fırın|firin|pizza|burger|kahve|yemek|catering/i,
    theme: { primary: '#b45309', accent: '#16a34a', mode: 'light', font: 'classic', radius: 'md' },
    services: [['Günün Menüsü', 'Her gün taze hazırlanan lezzetler.'], ['Paket Servis', 'Sıcak ve hızlı teslimat.'], ['Organizasyon', 'Doğum günü ve toplantılar için menüler.']],
    features: [['🍽️', 'Taze Malzeme', 'Günlük tedarik, ev yapımı tarifler.'], ['⏱️', 'Hızlı Servis', 'Öğle arasına uygun hızlı servis.'], ['⭐', 'Müşteri Memnuniyeti', 'Yüzlerce mutlu misafir.']],
    faq: [['Rezervasyon gerekli mi?', 'Hafta sonu için rezervasyon öneriyoruz.'], ['Paket servis bölgeniz?', 'Yakın semtlere paket servis yapıyoruz.']],
    heroCta: 'Rezervasyon / Sipariş',
  },
  {
    key: 'saglik',
    match: /klinik|doktor|diş|dis hek|psikolog|diyetisyen|fizyoterap|veteriner|eczane|sağlık|saglik|işitme|isitme/i,
    theme: { primary: '#0e7490', accent: '#22c55e', mode: 'light', font: 'modern', radius: 'md' },
    services: [['Muayene & Danışmanlık', 'Kişiye özel değerlendirme.'], ['Tedavi Planı', 'İhtiyaca göre planlanan süreç.'], ['Kontrol & Takip', 'Düzenli takip ve destek.']],
    features: [['🩺', 'Uzman Hekim', 'Alanında deneyimli uzman kadro.'], ['🏥', 'Modern Ekipman', 'Güncel teknoloji ile güvenli hizmet.'], ['🤝', 'İnsan Odaklı', 'Sizi dinleyen, anlaşılır iletişim.']],
    faq: [['Randevu nasıl alınır?', 'Telefon veya WhatsApp üzerinden randevu oluşturabilirsiniz.'], ['Anlaşmalı kurumlar?', 'Güncel liste için bize ulaşın.']],
    heroCta: 'Randevu Oluştur',
  },
  {
    key: 'hukuk',
    match: /avukat|hukuk|danışman|danisman|mali müşavir|muhasebe|sigorta|noter/i,
    theme: { primary: '#1e3a8a', accent: '#b45309', mode: 'light', font: 'classic', radius: 'none' },
    services: [['Danışmanlık', 'Sürece başlamadan net yol haritası.'], ['Takip & Temsil', 'Tüm aşamalarda yanınızdayız.'], ['Sözleşme & Belge', 'Hazırlık ve inceleme.']],
    features: [['⚖️', 'Deneyim', 'Yılların birikimi ile doğru strateji.'], ['🔒', 'Gizlilik', 'Bilgileriniz güvende.'], ['📞', 'Ulaşılabilirlik', 'Hızlı geri dönüş.']],
    faq: [['İlk görüşme ücretli mi?', 'Ön görüşme koşulları için bizimle iletişime geçin.'], ['Online görüşme yapıyor musunuz?', 'Evet, görüntülü görüşme ile hizmet veriyoruz.']],
    heroCta: 'Ön Görüşme Talep Et',
  },
  {
    key: 'yapi',
    match: /inşaat|insaat|tadilat|dekorasyon|mimar|emlak|gayrimenkul|tesisat|elektrik|boya|mobilya|mutfak/i,
    theme: { primary: '#c2410c', accent: '#0f766e', mode: 'dark', font: 'modern', radius: 'md' },
    services: [['Keşif & Proje', 'Ücretli keşif ve detaylı proje.'], ['Uygulama', 'Anahtar teslim uygulama.'], ['Garanti & Servis', 'İş sonrası destek.']],
    features: [['📐', 'Ölçülü İşçilik', 'Planlı ve temiz uygulama.'], ['🧱', 'Kaliteli Malzeme', 'Uzun ömürlü çözümler.'], ['🗓️', 'Zamanında Teslim', 'Söz verdiğimiz tarihte teslim.']],
    faq: [['Teklif süreci nasıl?', 'Keşif sonrası yazılı teklif sunuyoruz.'], ['Hangi bölgelere hizmet veriyorsunuz?', 'Şehir genelinde hizmet veriyoruz.']],
    heroCta: 'Teklif Al',
  },
  {
    key: 'magaza',
    match: /mağaza|magaza|butik|e-ticaret|eticaret|giyim|ayakkabı|aksesuar|takı|taki|kozmetik|çiçek|cicek|market/i,
    theme: { primary: '#7c3aed', accent: '#ec4899', mode: 'light', font: 'modern', radius: 'lg' },
    services: [['Yeni Sezon', 'En yeni ürünler ilk burada.'], ['Kampanyalar', 'Size özel fırsatlar.'], ['Hızlı Gönderim', 'Siparişleriniz özenle paketlenir.']],
    features: [['🛍️', 'Seçkin Ürünler', 'Özenle seçilmiş koleksiyon.'], ['🚚', 'Hızlı Kargo', 'Aynı gün kargo seçenekleri.'], ['↩️', 'Kolay İade', 'Sorunsuz değişim ve iade.']],
    faq: [['Sipariş nasıl veririm?', 'WhatsApp’tan ürün adını yazmanız yeterli.'], ['Kargo ücreti?', 'Belirli tutar üzeri kargo bedava.']],
    heroCta: 'WhatsApp’tan Sipariş',
  },
  {
    key: 'egitim',
    match: /kurs|eğitim|egitim|okul|dershane|özel ders|ozel ders|akademi|dil|koç|koc|anaokul/i,
    theme: { primary: '#2563eb', accent: '#f97316', mode: 'light', font: 'friendly', radius: 'lg' },
    services: [['Birebir Ders', 'Kişiye özel program.'], ['Grup Eğitimi', 'Küçük gruplarla etkili öğrenme.'], ['Online Eğitim', 'Her yerden katılım.']],
    features: [['🎓', 'Uzman Eğitmen', 'Deneyimli eğitmen kadrosu.'], ['📈', 'Ölçülebilir Gelişim', 'Düzenli değerlendirme.'], ['🕒', 'Esnek Saatler', 'Size uygun program.']],
    faq: [['Deneme dersi var mı?', 'Detaylar için bizimle iletişime geçin.'], ['Kayıt nasıl yapılır?', 'WhatsApp veya telefonla kaydınızı oluşturabilirsiniz.']],
    heroCta: 'Bilgi Al',
  },
]

const GENERIC: Preset = {
  key: 'genel',
  match: /.*/,
  theme: { primary: '#0d9488', accent: '#6366f1', mode: 'light', font: 'modern', radius: 'md' },
  services: [['Danışmanlık', 'İhtiyacınızı birlikte netleştiriyoruz.'], ['Uygulama', 'Profesyonel ve zamanında hizmet.'], ['Destek', 'Hizmet sonrası yanınızdayız.']],
  features: [['✅', 'Güvenilir', 'Şeffaf süreç, net fiyat.'], ['⚡', 'Hızlı', 'Hızlı dönüş ve çözüm.'], ['🤝', 'Müşteri Odaklı', 'Memnuniyet önceliğimiz.']],
  faq: [['Nasıl iletişime geçebilirim?', 'Telefon, WhatsApp veya form üzerinden.'], ['Çalışma saatleriniz?', 'Hafta içi ve cumartesi hizmet veriyoruz.']],
  heroCta: 'Hemen İletişime Geç',
}

const STYLE_OVERRIDES: Record<NonNullable<SiteBrief['style']>, Partial<SiteTheme>> = {
  modern: { font: 'modern', radius: 'md' },
  luks: { mode: 'dark', font: 'classic', radius: 'none', accent: '#d4af37' },
  samimi: { font: 'friendly', radius: 'lg' },
  kurumsal: { font: 'modern', radius: 'none', mode: 'light' },
  canli: { radius: 'lg', accent: '#f43f5e' },
}

export function pickPreset(sector: string): Preset {
  return PRESETS.find((p) => p.match.test(sector)) ?? GENERIC
}

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s)

/** Deterministik, model gerektirmeyen site taslağı (şema ile doğrulanmış) */
export function buildTemplateSite(brief: SiteBrief): SiteSchema {
  const p = pickPreset(`${brief.sector} ${brief.service ?? ''}`)
  const name = clip(brief.businessName.trim(), 80)
  const city = (brief.city ?? '').trim()
  const where = city ? `${city}’de ` : ''
  const service = (brief.service || brief.sector).trim()
  const theme: SiteTheme = { ...p.theme, ...(brief.style ? STYLE_OVERRIDES[brief.style] : {}) }
  const cta = brief.whatsapp ? 'whatsapp' : brief.phone ? 'phone' : 'contact'

  const home: SiteSection[] = [
    {
      type: 'hero',
      title: clip(`${where}${service} için ${name}`, 120),
      subtitle: clip(brief.description?.trim() || `${name}, ${service.toLowerCase()} alanında güvenilir, hızlı ve özenli hizmet sunar.`, 300),
      ctaText: p.heroCta,
      ctaTarget: cta,
    },
    { type: 'features', title: `Neden ${clip(name, 80)}?`, items: p.features.map(([icon, title, text]) => ({ icon, title, text })) },
    { type: 'services', title: 'Hizmetlerimiz', items: p.services.map(([n, d]) => ({ name: n, description: d })) },
    { type: 'faq', title: 'Sık Sorulan Sorular', items: p.faq.map(([q, a]) => ({ q, a })) },
    { type: 'cta', title: 'Hemen başlayalım', text: `${name} ile ${service.toLowerCase()} ihtiyacınızı bugün çözün.`, ctaText: p.heroCta, ctaTarget: cta },
  ]

  const site: SiteSchema = {
    version: 1,
    business: {
      name,
      sector: clip(brief.sector.trim() || 'İşletme', 60),
      city: clip(city, 60),
      ...(brief.phone ? { phone: clip(brief.phone.trim(), 30) } : {}),
      ...(brief.whatsapp ? { whatsapp: brief.whatsapp.replace(/\D/g, '') } : {}),
      ...(brief.email ? { email: brief.email.trim() } : {}),
    },
    theme,
    pages: [
      {
        slug: '',
        title: 'Ana Sayfa',
        seo: { title: clip(`${name}${city ? ` | ${service} ${city}` : ` | ${service}`}`, 70), description: clip(`${where}${service}: ${name}. ${p.features[0][2]}`, 170) },
        sections: home,
      },
      {
        slug: 'hakkimizda',
        title: 'Hakkımızda',
        seo: { title: clip(`Hakkımızda | ${name}`, 70), description: clip(`${name} hakkında: ${service} alanındaki deneyimimiz ve çalışma anlayışımız.`, 170) },
        sections: [
          { type: 'about', title: `${clip(name, 80)} hakkında`, text: clip(brief.description?.trim() || `${name}, ${where}${service.toLowerCase()} alanında müşteri memnuniyetini merkeze alan bir işletmedir. Şeffaf süreç, kaliteli hizmet ve hızlı iletişim ilkeleriyle çalışırız.`, 1200) },
          { type: 'stats', items: [{ value: '100+', label: 'Mutlu müşteri' }, { value: '7/24', label: 'WhatsApp iletişim' }, { value: '%100', label: 'Memnuniyet odağı' }] },
        ],
      },
      {
        slug: 'iletisim',
        title: 'İletişim',
        seo: { title: clip(`İletişim | ${name}`, 70), description: clip(`${name} iletişim bilgileri${city ? `, ${city}` : ''}. Hemen ulaşın.`, 170) },
        sections: [{ type: 'contact', title: 'Bize ulaşın', text: 'Formu doldurun veya WhatsApp’tan yazın; en kısa sürede dönüş yapalım.', showForm: true }],
      },
    ],
  }
  return siteSchema.parse(site)
}
