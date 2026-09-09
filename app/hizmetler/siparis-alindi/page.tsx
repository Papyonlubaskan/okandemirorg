import type { Metadata } from 'next'
import Link from 'next/link'
import { dekontWhatsAppUrl, paymentWhatsAppUrl } from '@/lib/bank-transfer'

export const metadata: Metadata = {
  title: 'Sipariş alındı | Okan Demir',
  robots: { index: false, follow: false },
}

type Props = { searchParams: Promise<{ code?: string }> }

export default async function SiparisAlindiPage({ searchParams }: Props) {
  const { code } = await searchParams
  const orderCode = (code || '').trim().toUpperCase()
  const amountHint = 'sipariş tutarınız'
  const paymentWa = orderCode
    ? paymentWhatsAppUrl(orderCode, amountHint)
    : 'https://wa.me/905552677739?text=' + encodeURIComponent('Merhaba, ödeme bilgisi istiyorum.')
  const dekontWa = orderCode
    ? dekontWhatsAppUrl(orderCode)
    : 'https://wa.me/905552677739?text=' + encodeURIComponent('Merhaba, dekont gönderiyorum.')

  return (
    <div className="min-h-screen py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100 dark:border-gray-700">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Siparişiniz alındı</h1>
          {orderCode ? (
            <p className="text-lg font-black text-blue-700 dark:text-blue-300">Sipariş kodu: {orderCode}</p>
          ) : (
            <p className="text-amber-700 text-sm">Sipariş kodu e-postanızda.</p>
          )}
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 text-sm">
            <li>WhatsApp’tan sipariş kodunuzla ödeme bilgisini isteyin</li>
            <li>Size özel iletilen hesaba havale / EFT yapın (açıklama = kod)</li>
            <li>Dekontu WhatsApp’tan gönderin</li>
            <li>Onay sonrası ürün indirme veya hizmet süreci başlar</li>
          </ol>
          <p className="text-sm text-gray-500">
            Ödeme bilgileri sitede yayınlanmaz; yalnızca sipariş sonrası özel paylaşılır.
          </p>
          <a
            href={paymentWa}
            className="inline-flex w-full justify-center bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-full"
          >
            WhatsApp’tan ödeme bilgisi iste
          </a>
          <a
            href={dekontWa}
            className="inline-flex w-full justify-center bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-full"
          >
            Havale yaptım — dekont gönder
          </a>
          <Link href="/hizmetler" className="block text-center text-blue-600 font-black">
            ← Hizmetler
          </Link>
        </div>
      </div>
    </div>
  )
}
