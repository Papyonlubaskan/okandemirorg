import { SITE_URL } from '@/lib/brand-seo'

export type BreadcrumbItem = {
  name: string
  path: string
}

/** Schema.org BreadcrumbList — ana sayfa + sayfa hiyerarşisi */
export function buildBreadcrumbList(items: BreadcrumbItem[]) {
  const list = [{ name: 'Ana Sayfa', path: '/' }, ...items]
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: list.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.path === '/' ? SITE_URL : `${SITE_URL}${item.path}`,
    })),
  }
}

export { SITE_URL }
