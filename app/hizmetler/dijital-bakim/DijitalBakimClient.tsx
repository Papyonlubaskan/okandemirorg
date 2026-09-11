'use client'

import Link from 'next/link'
import { useState } from 'react'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import WhatsAppCtaCard from '@/components/WhatsAppCtaCard'
import { getProductBySlug, FUNNEL, formatTry } from '@/lib/digital-products'
import { productWhatsAppUrl } from '@/lib/bank-transfer'

const light = getProductBySlug('dijital-bakim-light')!
const standart = getProductBySlug('dijital-bakim-standart')!

export default function DijitalBakimClient() {
  const [pack, setPack] = useState<'dijital-bakim-light' | 'dijital-bakim-standart'>('dijital-bakim-light')
  const selected = pack === 'dijital-bakim-light' ? light : standart

  return (
    <>
      <BreadcrumbJsonLd
        id="care-breadcrumb"
        items={[
          { name: 'Hizmetler', path: '/hizmetler' },
          { name: 'Dijital Bakım', path: FUNNEL.careHref },
        ]}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <section className="py-16 bg-gradient-to-br from-teal-600 to-blue-800 text-white">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <p className="mb-3 text-teal-100">
              <Link href="/hizmetler" className="underline">
                Hizmetler
              </Link>
              {' · '}
              Adım 3 — Aylık
            </p>
            <h1 className="text-4xl lg:text-5xl font-black mb-4">Dijital Bakım</h1>
            <p className="text-xl text-teal-50">
              Paketi seçin, WhatsApp’tan yazın. Ödeme bilgisi özel mesajla gelir.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-5xl grid lg:grid-cols-2 gap-10">
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Paket seçin</h2>
              <button
                type="button"
                onClick={() => setPack('dijital-bakim-light')}
                className={`w-full text-left rounded-2xl p-5 border-2 transition ${
                  pack === 'dijital-bakim-light'
                    ? 'border-teal-600 bg-teal-50 dark:bg-gray-800'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <p className="font-black text-gray-900 dark:text-white">{light.name}</p>
                <p className="text-teal-700 dark:text-teal-300 font-black">{formatTry(light.priceTry)}/ay</p>
                <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  {light.includes.map((i) => (
                    <li key={i}>✓ {i}</li>
                  ))}
                </ul>
              </button>
              <button
                type="button"
                onClick={() => setPack('dijital-bakim-standart')}
                className={`w-full text-left rounded-2xl p-5 border-2 transition ${
                  pack === 'dijital-bakim-standart'
                    ? 'border-teal-600 bg-teal-50 dark:bg-gray-800'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <p className="font-black text-gray-900 dark:text-white">{standart.name}</p>
                <p className="text-teal-700 dark:text-teal-300 font-black">{formatTry(standart.priceTry)}/ay</p>
                <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  {standart.includes.map((i) => (
                    <li key={i}>✓ {i}</li>
                  ))}
                </ul>
              </button>
            </div>
            <WhatsAppCtaCard
              key={selected.slug}
              href={productWhatsAppUrl(selected.name, `${formatTry(selected.priceTry)}/ay`)}
              title={selected.name}
              subtitle={`${formatTry(selected.priceTry)}/ay · WhatsApp ile başlatın.`}
              label="WhatsApp’tan bakım iste"
            />
          </div>
        </section>
      </div>
    </>
  )
}
