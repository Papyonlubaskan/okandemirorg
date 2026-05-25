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
    url: 'https://hacettepeisitme-web-production.up.railway.app/',
    domain: 'hacettepeisitme-web-production.up.railway.app',
    summary:
      'Samsun işitme merkezi kurumsal web sitesi. Hizmet tanıtımı, güven veren tasarım ve yerel arama odaklı yapı; Railway üzerinde canlı yayında.',
    tags: ['Kurumsal Site', 'Sağlık', 'Railway'],
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

const BASE_URL = 'https://okandemir.org'

export function getPortfolioItemListSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Okan Demir Tamamlanan Web Projeleri | Completed Web Projects',
    alternateName: 'Okan Demir Web Design Portfolio Case Studies',
    description:
      'Tolga Demir portfolyo sitesi ve Hacettepe İşitme Samsun kurumsal web sitesi. Completed projects: Tolga Demir portfolio and Hacettepe Hearing Center Samsun corporate website.',
    inLanguage: ['tr-TR', 'en'],
    url: `${BASE_URL}/projeler#tamamlanan-isler`,
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
          name: 'Okan Demir',
          url: `${BASE_URL}/hakkimda`,
        },
        ...(project.caseStudySlug
          ? {
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `${BASE_URL}/case-studies/${project.caseStudySlug}`,
              },
            }
          : {}),
      },
    })),
  }
}
