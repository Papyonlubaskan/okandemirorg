'use client'

import { useState } from 'react'
import { formatTry } from '@/lib/digital-products'

type Props = {
  productSlug: string
  priceTry: number
  productName: string
  thankYouPath: string
  extraFields?: boolean
}

export default function ProductOrderForm({
  productSlug,
  priceTry,
  productName,
  thankYouPath,
  extraFields = false,
}: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          productSlug,
          website: extraFields ? website : undefined,
          notes: extraFields ? notes : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.error || 'Sipariş oluşturulamadı')
        return
      }
      const base = thankYouPath.includes('?') ? thankYouPath : `${thankYouPath}?code=`
      window.location.href = `${base}${encodeURIComponent(data.orderCode)}`
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 shadow-xl space-y-4 border border-gray-100 dark:border-gray-700"
    >
      <div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">Başvuru / sipariş</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          {productName} · {formatTry(priceTry)} · Ödeme WhatsApp ile
        </p>
      </div>

      <div>
        <label className="block text-sm font-black text-gray-700 dark:text-gray-200 mb-1">Ad Soyad</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3"
        />
      </div>
      <div>
        <label className="block text-sm font-black text-gray-700 dark:text-gray-200 mb-1">E-posta</label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3"
        />
      </div>
      <div>
        <label className="block text-sm font-black text-gray-700 dark:text-gray-200 mb-1">Telefon</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3"
          placeholder="05xx xxx xx xx"
        />
      </div>
      {extraFields ? (
        <>
          <div>
            <label className="block text-sm font-black text-gray-700 dark:text-gray-200 mb-1">
              Website URL
            </label>
            <input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3"
              placeholder="https://"
            />
          </div>
          <div>
            <label className="block text-sm font-black text-gray-700 dark:text-gray-200 mb-1">
              Not / Instagram
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3"
            />
          </div>
        </>
      ) : null}

      {error ? <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-black py-4 rounded-full transition"
      >
        {loading ? 'Oluşturuluyor…' : `Devam — ${formatTry(priceTry)}`}
      </button>
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Ödeme bilgisi sitede yayınlanmaz. Sipariş sonrası WhatsApp ile özel iletilir.
      </p>
    </form>
  )
}
