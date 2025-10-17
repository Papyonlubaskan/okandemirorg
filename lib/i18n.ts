export type Locale = 'tr' | 'en'

export const defaultLocale: Locale = 'tr'

export const locales: Locale[] = ['tr', 'en']

export const translations = {
  tr: {
    // Navigation
    'nav.home': 'Ana Sayfa',
    'nav.about': 'Hakkımda',
    'nav.services': 'Hizmetler',
    'nav.projects': 'Projeler',
    'nav.contact': 'İletişim',
    
    // Hero
    'hero.title': 'Dijital Pazarlama & Yazılım Uzmanı',
    'hero.subtitle': 'Markanızı dijital dünyada zirveye taşıyorum',
    'hero.cta': 'Hemen İletişime Geç',
    
    // Services
    'services.title': 'Hizmetlerim',
    'services.digital-marketing': 'Dijital Pazarlama',
    'services.web-design': 'Web Tasarımı',
    'services.seo': 'SEO Optimizasyonu',
    'services.brand-identity': 'Marka Kimliği',
    
    // Contact
    'contact.title': 'İletişime Geçin',
    'contact.name': 'Ad Soyad',
    'contact.email': 'E-posta',
    'contact.phone': 'Telefon',
    'contact.subject': 'Konu',
    'contact.message': 'Mesaj',
    'contact.send': 'Gönder',
    'contact.success': 'Mesajınız başarıyla gönderildi!',
    'contact.error': 'Bir hata oluştu. Lütfen tekrar deneyin.',
    
    // Common
    'common.loading': 'Yükleniyor...',
    'common.learn-more': 'Daha Fazla',
    'common.read-more': 'Devamını Oku',
    'common.view-all': 'Tümünü Gör',
    'common.back': 'Geri',
    'common.close': 'Kapat',
    
    // Footer
    'footer.copyright': 'Tüm hakları saklıdır',
    'footer.social': 'Sosyal Medya',
    'footer.quick-links': 'Hızlı Linkler',
    
    // Testimonials
    'testimonials.title': 'Müşterilerimiz Ne Diyor?',
    'testimonials.subtitle': 'Birlikte çalıştığımız mutlu müşterilerimizin görüşleri',
    
    // Portfolio
    'portfolio.title': 'Projeler',
    'portfolio.filter': 'Filtrele',
    'portfolio.all': 'Tümü',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',
    
    // Hero
    'hero.title': 'Digital Marketing & Software Expert',
    'hero.subtitle': 'Taking your brand to the top in the digital world',
    'hero.cta': 'Get In Touch',
    
    // Services
    'services.title': 'Services',
    'services.digital-marketing': 'Digital Marketing',
    'services.web-design': 'Web Design',
    'services.seo': 'SEO Optimization',
    'services.brand-identity': 'Brand Identity',
    
    // Contact
    'contact.title': 'Get In Touch',
    'contact.name': 'Full Name',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.subject': 'Subject',
    'contact.message': 'Message',
    'contact.send': 'Send',
    'contact.success': 'Your message has been sent successfully!',
    'contact.error': 'An error occurred. Please try again.',
    
    // Common
    'common.loading': 'Loading...',
    'common.learn-more': 'Learn More',
    'common.read-more': 'Read More',
    'common.view-all': 'View All',
    'common.back': 'Back',
    'common.close': 'Close',
    
    // Footer
    'footer.copyright': 'All rights reserved',
    'footer.social': 'Social Media',
    'footer.quick-links': 'Quick Links',
    
    // Testimonials
    'testimonials.title': 'What Our Clients Say?',
    'testimonials.subtitle': 'Testimonials from our happy clients',
    
    // Portfolio
    'portfolio.title': 'Projects',
    'portfolio.filter': 'Filter',
    'portfolio.all': 'All',
  },
}

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split('.')
  let value: string | Record<string, unknown> = translations[locale]
  
  for (const k of keys) {
    if (typeof value === 'object' && value !== null && k in value) {
      value = value[k] as string | Record<string, unknown>
    } else {
      return key // Return key if translation not found
    }
  }
  
  return typeof value === 'string' ? value : key
}

// i18n Context hook
export function useTranslation(locale: Locale) {
  return {
    t: (key: string) => getTranslation(locale, key),
    locale,
  }
}

