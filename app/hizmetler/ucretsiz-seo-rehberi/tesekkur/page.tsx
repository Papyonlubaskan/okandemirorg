import type { Metadata } from 'next'
import Link from 'next/link'
import { FUNNEL, formatTry, DIGITAL_PRODUCTS } from '@/lib/digital-products'

export const metadata: Metadata = {
  title: 'Rehberiniz hazır | Okan Demir',
  robots: { index: false, follow: false },
}

type Props = { searchParams: Promise<{ token?: string }> }

export default async function LeadTesekkurPage({ searchParams }: Props) {
  const { token } = await searchParams
  const t = (token || '').trim()
  const kit = DIGITAL_PRODUCTS[0]

  return (
    <div className="min-h-screen py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 max-w-xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl space-y-5">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Rehberiniz hazır</h1>
          <p className="text-gray-600 dark:text-gray-300">
            E-postanıza da indirme linki gönderildi. Spam klasörünü kontrol edin.
          </p>
          {t ? (
            <a
              href={`/api/leads/download?token=${encodeURIComponent(t)}`}
              className="inline-flex w-full justify-center bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-full"
            >
              Rehberi şimdi indir
            </a>
          ) : null}
          <div className="rounded-xl bg-blue-50 dark:bg-gray-900 p-5">
            <p className="font-black text-gray-900 dark:text-white mb-2">Sonraki adım</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {kit.name} — {formatTry(kit.priceTry)}
            </p>
            <Link href={FUNNEL.kitHref} className="font-black text-blue-600 hover:underline">
              Kiti incele →
            </Link>
          </div>
          <Link href="/hizmetler" className="block text-center text-sm text-gray-500">
            ← Hizmetler
          </Link>
        </div>
      </div>
    </div>
  )
}
