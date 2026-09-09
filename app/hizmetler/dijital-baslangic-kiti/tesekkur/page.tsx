import type { Metadata } from 'next'
import Link from 'next/link'
import { dekontWhatsAppUrl, paymentWhatsAppUrl } from '@/lib/bank-transfer'
import { DIGITAL_PRODUCTS, formatTry } from '@/lib/digital-products'

export const metadata: Metadata = {
  title: 'Sipariş alındı | Okan Demir',
  robots: { index: false, follow: false },
}

type Props = {
  searchParams: Promise<{ code?: string }>
}

export default async function DijitalKitTesekkurPage({ searchParams }: Props) {
  const { code } = await searchParams
  const orderCode = (code || '').trim().toUpperCase()
  const product = DIGITAL_PRODUCTS[0]
  const amountLabel = formatTry(product.priceTry)
  const paymentWa = orderCode
    ? paymentWhatsAppUrl(orderCode, amountLabel)
    : `https://wa.me/905552677739?text=${encodeURIComponent('Merhaba, KOBİ Dijital Başlangıç Kiti için ödeme bilgisi istiyorum.')}`
  const dekontWa = orderCode
    ? dekontWhatsAppUrl(orderCode)
    : `https://wa.me/905552677739?text=${encodeURIComponent('Merhaba, KOBİ Dijital Başlangıç Kiti için dekont gönderiyorum.')}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <Link href="/hizmetler" className="hover:underline">
              Hizmetler
            </Link>
            {' / '}
            <Link href="/hizmetler/dijital-baslangic-kiti" className="hover:underline">
              Dijital Başlangıç Kiti
            </Link>
          </p>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Siparişiniz alındı</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {product.name} · {amountLabel}
          </p>

          {orderCode ? (
            <p className="text-lg font-black text-blue-700 dark:text-blue-300">
              Sipariş kodu: {orderCode}
            </p>
          ) : (
            <p className="text-amber-700 dark:text-amber-300 text-sm">
              Sipariş kodu eksik. E-postanıza gelen kodu kullanın.
            </p>
          )}

          <div className="rounded-xl bg-gray-50 dark:bg-gray-900 p-5 space-y-3 text-gray-800 dark:text-gray-200">
            <h2 className="font-black text-xl">Sonraki adım</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>WhatsApp’tan sipariş kodunuzla ödeme bilgisini isteyin</li>
              <li>Size özel olarak iletilen hesaba havale / EFT yapın</li>
              <li>Açıklamaya sipariş kodunu yazın</li>
              <li>Dekontu WhatsApp’tan gönderin</li>
            </ol>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ödeme bilgileri sitede yayınlanmaz; yalnızca sipariş sonrası özel olarak paylaşılır.
            </p>
          </div>

          <a
            href={paymentWa}
            className="inline-flex w-full justify-center items-center bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-full transition"
          >
            WhatsApp’tan ödeme bilgisi iste
          </a>
          <a
            href={dekontWa}
            className="inline-flex w-full justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-full transition"
          >
            Havale yaptım — dekont gönder
          </a>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ödeme onaylanınca indirme linki e-posta adresinize gelir.
          </p>

          <Link
            href="/hizmetler/dijital-baslangic-kiti"
            className="block text-center text-blue-600 dark:text-blue-400 font-black"
          >
            ← Ürün sayfasına dön
          </Link>
        </div>
      </div>
    </div>
  )
}
