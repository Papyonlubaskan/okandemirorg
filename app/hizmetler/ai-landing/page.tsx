import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import WhatsAppCtaCard from '@/components/WhatsAppCtaCard'
import { getProductBySlug, FUNNEL, formatTry } from '@/lib/digital-products'
import { productWhatsAppUrl } from '@/lib/bank-transfer'
import { PERSON_ID, SITE_URL } from '@/lib/brand-seo'

const product = getProductBySlug('ai-landing-sayfa')!
const PAGE_PATH = FUNNEL.aiLandingHref

export const metadata: Metadata = {
  title: `${product.name} | Okan Demir`,
  description: product.shortDescription,
  alternates: { canonical: `${SITE_URL}${PAGE_PATH}` },
  openGraph: {
    title: `${product.name} | Okan Demir`,
    description: product.shortDescription,
    url: `${SITE_URL}${PAGE_PATH}`,
    type: 'website',
  },
}

export default function AiLandingPage() {
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    brand: { '@type': 'Brand', name: 'Okan Demir' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'TRY',
      price: product.priceTry,
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}${PAGE_PATH}`,
      seller: { '@id': PERSON_ID },
    },
  }

  const wa = productWhatsAppUrl(product.name, formatTry(product.priceTry))

  return (
    <>
      <BreadcrumbJsonLd
        id="ai-landing-breadcrumb"
        items={[
          { name: 'Hizmetler', path: '/hizmetler' },
          { name: product.name, path: PAGE_PATH },
        ]}
      />
      <Script
        id="ai-landing-product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <section className="py-16 lg:py-20 bg-gradient-to-br from-slate-800 via-cyan-900 to-teal-900 text-white">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <p className="text-cyan-100 font-medium mb-3">
              <Link href="/hizmetler" className="underline hover:text-white">
                Hizmetler
              </Link>
              {' · '}
              Self-serve · WhatsApp
            </p>
            <h1 className="text-4xl lg:text-6xl font-black mb-4">{product.name}</h1>
            <p className="text-xl text-cyan-50/90 max-w-3xl mx-auto mb-6">{product.shortDescription}</p>
            <p className="text-3xl font-black">{formatTry(product.priceTry)}</p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-5xl grid lg:grid-cols-2 gap-10 items-start">
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white">Ne alırsınız?</h2>
              <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
              <ul className="space-y-3">
                {product.includes.map((item) => (
                  <li key={item} className="flex gap-3 text-gray-800 dark:text-gray-200 font-medium">
                    <span className="text-cyan-700 shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Meta Ads / hesap şifresi istemeyiz. Yayınlama + domain ayrı teklif.
              </p>
            </div>
            <WhatsAppCtaCard
              href={wa}
              title="WhatsApp ile sipariş"
              subtitle={`${product.name} · ${formatTry(product.priceTry)}`}
            />
          </div>
        </section>
      </div>
    </>
  )
}
