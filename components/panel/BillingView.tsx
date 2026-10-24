'use client'

import { useState } from 'react'

type Sku = { sku: string; name: string; priceLabel: string; kind: 'credits' | 'plan'; credits: number; description: string; features: string[]; highlighted?: boolean }

export default function BillingView({ workspaceId, skus, canBuy }: { workspaceId: string; skus: Sku[]; canBuy: boolean }) {
  const [busy, setBusy] = useState<string | null>(null)
  const [order, setOrder] = useState<{ orderCode: string; amountLabel: string; waUrl: string; name: string } | null>(null)
  const [err, setErr] = useState('')

  async function buy(s: Sku) {
    setBusy(s.sku)
    setErr('')
    try {
      const res = await fetch('/api/billing/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId, sku: s.sku }),
      })
      const body = await res.json()
      if (!res.ok) {
        setErr(body.error || 'Sipariş oluşturulamadı')
        return
      }
      setOrder({ ...body, name: s.name })
      window.open(body.waUrl, '_blank', 'noopener')
    } catch {
      setErr('Bağlantı hatası')
    } finally {
      setBusy(null)
    }
  }

  const card = (s: Sku) => (
    <div key={s.sku} className={`rounded-2xl bg-white dark:bg-gray-800 border p-6 flex flex-col ${s.highlighted ? 'border-2 border-teal-600 shadow-lg' : 'border-gray-200 dark:border-gray-700'}`}>
      {s.highlighted && <span className="self-start rounded-full bg-teal-600 text-white text-xs font-bold px-2.5 py-0.5 mb-2">En popüler</span>}
      <h3 className="text-lg font-black text-gray-900 dark:text-white">{s.name}</h3>
      <p className="text-sm text-gray-500 mb-3">{s.description}</p>
      <p className="text-3xl font-black text-gray-900 dark:text-white">
        {s.priceLabel}
        {s.kind === 'plan' && <span className="text-sm font-medium text-gray-500"> / ay</span>}
      </p>
      <ul className="mt-4 space-y-1 text-sm text-gray-700 dark:text-gray-200 flex-1">
        {s.features.map((f) => (
          <li key={f}>✓ {f}</li>
        ))}
      </ul>
      <button
        onClick={() => buy(s)}
        disabled={!canBuy || busy !== null}
        className={`mt-5 rounded-lg font-bold px-4 py-3 disabled:opacity-50 ${s.highlighted ? 'bg-teal-700 text-white' : 'border border-teal-700 text-teal-800 dark:text-teal-300'}`}
      >
        {busy === s.sku ? 'Hazırlanıyor…' : 'Satın al'}
      </button>
    </div>
  )

  return (
    <div className="space-y-8">
      {order && (
        <div className="rounded-xl border-2 border-teal-600 bg-teal-50 dark:bg-teal-900/20 p-5 text-sm text-gray-800 dark:text-gray-100 space-y-2">
          <p className="font-black text-teal-900 dark:text-teal-100">Sipariş oluşturuldu: {order.orderCode}</p>
          <p>
            {order.name} · {order.amountLabel}. Ödeme bilgisi WhatsApp’tan özel iletilir; havale açıklamasına sipariş kodunu yazın.
            Ödeme onaylanınca kredi/plan hesabınıza <strong>otomatik</strong> yüklenir.
          </p>
          <a href={order.waUrl} target="_blank" rel="noopener noreferrer" className="inline-block rounded-lg bg-[#25d366] text-white font-bold px-4 py-2">
            WhatsApp’ta aç
          </a>
        </div>
      )}
      {err && (
        <p className="text-sm text-red-600" role="alert">
          {err}
        </p>
      )}
      {!canBuy && <p className="text-sm text-gray-600">Satın alma işlemini workspace sahibi veya yöneticisi yapabilir.</p>}
      <section>
        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4">Aylık planlar</h2>
        <div className="grid md:grid-cols-3 gap-4">{skus.filter((s) => s.kind === 'plan').map(card)}</div>
      </section>
      <section>
        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4">Ek kredi</h2>
        <div className="grid md:grid-cols-3 gap-4">{skus.filter((s) => s.kind === 'credits').map(card)}</div>
      </section>
    </div>
  )
}
