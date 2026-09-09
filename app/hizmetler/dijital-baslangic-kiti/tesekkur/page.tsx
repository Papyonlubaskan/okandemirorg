import type { Metadata } from 'next'
import Link from 'next/link'
import { getBankTransferInfo } from '@/lib/bank-transfer'
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
  const bank = getBankTransferInfo()
  const waText = encodeURIComponent(
    orderCode
      ? `Merhaba, ${orderCode} siparişi için havale yaptım. Dekont ekliyorum.`
      : 'Merhaba, KOBİ Dijital Başlangıç Kiti için havale bilgisi / dekont.'
  )

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
            {product.name} · {formatTry(product.priceTry)}
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

          <div className="rounded-xl bg-gray-50 dark:bg-gray-900 p-5 space-y-2 text-gray-800 dark:text-gray-200">
            <h2 className="font-black text-xl mb-2">Havale / EFT</h2>
            <p>
              <span className="font-black">Alıcı:</span> {bank.accountHolder}
            </p>
            {bank.bankName ? (
              <p>
                <span className="font-black">Banka:</span> {bank.bankName}
              </p>
            ) : null}
            {bank.configured ? (
              <p className="break-all">
                <span className="font-black">IBAN:</span> {bank.iban}
              </p>
            ) : (
              <p className="text-amber-700 dark:text-amber-300">
                IBAN henüz sistemde tanımlı değil. WhatsApp’tan sipariş kodunuzla IBAN isteyin.
              </p>
            )}
            {orderCode ? (
              <p>
                <span className="font-black">Açıklama:</span> {orderCode}
              </p>
            ) : null}
            <p>
              <span className="font-black">Tutar:</span> {formatTry(product.priceTry)}
            </p>
          </div>

          <a
            href={`https://wa.me/905552677739?text=${waText}`}
            className="inline-flex w-full justify-center items-center bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-full transition"
          >
            WhatsApp’tan dekont gönder
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
