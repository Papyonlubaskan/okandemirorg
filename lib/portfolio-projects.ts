import { PERSON_ID, OKAN_DEMIR, SITE_URL } from '@/lib/brand-seo'

/** Hacettepe İşitme canlı site (www ve apex aynı siteye yönlenir) */
export const HACETTEPE_ISITME_URL = 'https://hacettepeisitme.com.tr/'
export const HACETTEPE_ISITME_DOMAIN = 'hacettepeisitme.com.tr'

export type CompletedProject = {
  title: string
  url: string
  domain: string
  summary: string
  tags: string[]
  gradient: string
  caseStudySlug?: string
}

export const completedProjects: CompletedProject[] = [
  {
    title: 'Tolga Demir',
    url: 'https://tolgademir.org',
    domain: 'tolgademir.org',
    summary:
      'Kişisel marka ve profesyonel portfolyo sitesi. Modern arayüz, hızlı yükleme ve mobil uyumlu yapı ile hizmetlerin ve iletişim kanallarının net sunumu.',
    tags: ['Next.js', 'Web Tasarım', 'Portfolyo'],
    gradient: 'from-blue-600 to-indigo-700',
    caseStudySlug: 'tolgademir-portfolyo',
  },
  {
    title: 'Hacettepe İşitme — Samsun',
    url: HACETTEPE_ISITME_URL,
    domain: HACETTEPE_ISITME_DOMAIN,
    summary:
      'Samsun işitme merkezi kurumsal web sitesi. Hizmet tanıtımı, güven veren tasarım ve yerel arama odaklı yapı; hacettepeisitme.com.tr üzerinde canlı yayında.',
    tags: ['Kurumsal Site', 'Sağlık', 'Yerel SEO'],
    gradient: 'from-emerald-600 to-teal-700',
    caseStudySlug: 'hacettepe-isitme-samsun',
  },
]

export const incompleteProjects = [
  {
    title: 'Maral Atmaca',
    domain: 'maralatmaca.com',
    summary:
      'Proje sürecinde yaşanan olumsuzluklar ve müşteri talebiyle sonlandırılmıştır. Maral Atmaca için hazırlanan tasarım şablonu, metin ve hikâye yazarı Tolga Demir tarafından beğenilerek tolgademir.org üzerinde aktif olarak kullanılmaktadır.',
    note: 'Şablon: tolgademir.org',
  },
]

export function getPortfolioItemListSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Okan Demir Tamamlanan Web Projeleri | Completed Web Projects',
    alternateName: 'Okan Demir Web Design Portfolio Case Studies',
    description:
      'Tolga Demir portfolyo sitesi ve Hacettepe İşitme Samsun kurumsal web sitesi. Completed projects: Tolga Demir portfolio and Hacettepe Hearing Center Samsun corporate website.',
    inLanguage: ['tr-TR', 'en'],
    url: `${SITE_URL}/projeler#tamamlanan-isler`,
    numberOfItems: completedProjects.length,
    itemListElement: completedProjects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: project.title,
        description: project.summary,
        url: project.url,
        creator: {
          '@type': 'Person',
          '@id': PERSON_ID,
          name: OKAN_DEMIR.name,
          url: `${SITE_URL}/hakkimda`,
        },
        ...(project.caseStudySlug
          ? {
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `${SITE_URL}/case-studies/${project.caseStudySlug}`,
              },
            }
          : {}),
      },
    })),
  }
}
