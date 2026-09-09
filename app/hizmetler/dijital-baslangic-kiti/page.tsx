import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import KitOrderForm from '@/components/KitOrderForm'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import { DIGITAL_PRODUCTS, formatTry } from '@/lib/digital-products'
import { PERSON_ID, SITE_URL } from '@/lib/brand-seo'

const product = DIGITAL_PRODUCTS[0]
const PAGE_PATH = '/hizmetler/dijital-baslangic-kiti'

export const metadata: Metadata = {
  title: `${product.name} | Okan Demir Hizmetler`,
  description: product.shortDescription,
  alternates: { canonical: `${SITE_URL}${PAGE_PATH}` },
  openGraph: {
    title: `${product.name} | Okan Demir`,
    description: product.shortDescription,
    url: `${SITE_URL}${PAGE_PATH}`,
    type: 'website',
  },
}

export default function DijitalBaslangicKitiPage() {
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

  return (
    <>
      <BreadcrumbJsonLd
        id="dijital-kit-breadcrumb"
        items={[
          { name: 'Hizmetler', path: '/hizmetler' },
          { name: product.name, path: PAGE_PATH },
        ]}
      />
      <Script
        id="dijital-kit-product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <section className="py-16 lg:py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <p className="text-blue-100 font-medium mb-3">
              <Link href="/hizmetler" className="underline hover:text-white">
                Hizmetler
              </Link>
              {' · '}
              Dijital ürün · Havale ile teslimat
            </p>
            <h1 className="text-4xl lg:text-6xl font-black mb-4">{product.name}</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-6">{product.shortDescription}</p>
            <p className="text-3xl font-black">{formatTry(product.priceTry)}</p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-5xl grid lg:grid-cols-2 gap-10 items-start">
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white">Kit içinde neler var?</h2>
              <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
              <ul className="space-y-3">
                {product.includes.map((item) => (
                  <li key={item} className="flex gap-3 text-gray-800 dark:text-gray-200 font-medium">
                    <span className="text-blue-600 shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="rounded-2xl bg-blue-50 dark:bg-gray-800 p-5 text-sm text-gray-700 dark:text-gray-300">
                <p className="font-black text-gray-900 dark:text-white mb-2">Nasıl çalışır?</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Siparişi oluşturursunuz</li>
                  <li>IBAN’a havale yaparsınız (açıklama = sipariş kodu)</li>
                  <li>Dekontu WhatsApp’tan gönderirsiniz</li>
                  <li>Onay sonrası indirme linki e-postanıza gelir</li>
                </ol>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/hizmetler" className="text-blue-600 dark:text-blue-400 font-black hover:underline">
                  ← Tüm hizmetler
                </Link>
                <Link href="/iletisim" className="text-blue-600 dark:text-blue-400 font-black hover:underline">
                  İletişim →
                </Link>
              </div>
            </div>

            <KitOrderForm
              productSlug={product.slug}
              priceTry={product.priceTry}
              productName={product.name}
            />
          </div>
        </section>
      </div>
    </>
  )
}
