import Script from 'next/script'
import { buildBreadcrumbList, type BreadcrumbItem } from '@/lib/breadcrumb-schema'

export default function BreadcrumbJsonLd({
  id,
  items,
}: {
  id: string
  items: BreadcrumbItem[]
}) {
  const data = buildBreadcrumbList(items)
  return (
    <Script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
