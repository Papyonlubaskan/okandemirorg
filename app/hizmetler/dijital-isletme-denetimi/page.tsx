import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import WhatsAppCtaCard from '@/components/WhatsAppCtaCard'
import { getProductBySlug, FUNNEL, formatTry } from '@/lib/digital-products'
import { productWhatsAppUrl } from '@/lib/bank-transfer'
import { PERSON_ID, SITE_URL } from '@/lib/brand-seo'

const product = getProductBySlug('dijital-isletme-denetimi')!

export const metadata: Metadata = {
  title: `${product.name} | Okan Demir`,
  description: product.shortDescription,
  alternates: { canonical: `${SITE_URL}${FUNNEL.auditHref}` },
}

export default function DijitalIsletmeDenetimiPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: product.name,
    description: product.shortDescription,
    provider: { '@id': PERSON_ID },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'TRY',
      price: product.priceTry,
      url: `${SITE_URL}${FUNNEL.auditHref}`,
    },
  }

  return (
    <>
      <BreadcrumbJsonLd
        id="audit-breadcrumb"
        items={[
          { name: 'Hizmetler', path: '/hizmetler' },
          { name: product.name, path: FUNNEL.auditHref },
        ]}
      />
      <Script id="audit-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <section className="py-16 bg-gradient-to-br from-indigo-600 to-blue-800 text-white">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <p className="mb-3 text-indigo-100">
              <Link href="/hizmetler" className="underline">
                Hizmetler
              </Link>
              {' · '}
              Adım 2
            </p>
            <h1 className="text-4xl lg:text-5xl font-black mb-4">{product.name}</h1>
            <p className="text-xl text-indigo-100 mb-4">{product.shortDescription}</p>
            <p className="text-3xl font-black">{formatTry(product.priceTry)}</p>
          </div>
        </section>
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-5xl grid lg:grid-cols-2 gap-10">
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Kapsam</h2>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                {product.includes.map((i) => (
                  <li key={i}>✓ {i}</li>
                ))}
              </ul>
              <p className="text-sm text-gray-500">
                Website ve Instagram bilginizi WhatsApp mesajında yazmanız yeterli.
              </p>
            </div>
            <WhatsAppCtaCard
              href={productWhatsAppUrl(product.name, formatTry(product.priceTry))}
              title="WhatsApp’tan başvur"
              subtitle="Site URL + Instagram hesabınızı mesaja ekleyin."
              label="WhatsApp’tan denetim iste"
            />
          </div>
        </section>
      </div>
    </>
  )
}
