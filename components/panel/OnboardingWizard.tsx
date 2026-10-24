'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const SECTORS = ['Kuaför / Güzellik', 'Restoran / Kafe', 'Klinik / Sağlık', 'Avukat / Danışmanlık', 'İnşaat / Tadilat / Emlak', 'Mağaza / E-ticaret', 'Eğitim / Kurs', 'Diğer']
const STYLES = [
  ['modern', 'Modern'],
  ['luks', 'Lüks'],
  ['samimi', 'Samimi'],
  ['kurumsal', 'Kurumsal'],
  ['canli', 'Canlı'],
] as const

export const PROMPT_STORAGE_KEY = 'okd_site_prompt'

type Form = {
  businessName: string
  sector: string
  city: string
  service: string
  description: string
  whatsapp: string
  phone: string
  email: string
  style: string
}

const input =
  'mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white'

export default function OnboardingWizard({ workspaceId, credits, cost }: { workspaceId: string; credits: number; cost: number }) {
  const [f, setF] = useState<Form>({ businessName: '', sector: SECTORS[0], city: '', service: '', description: '', whatsapp: '', phone: '', email: '', style: 'modern' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [idem] = useState(() => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `k-${Date.now()}`))
  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF((v) => ({ ...v, [k]: e.target.value }))

  useEffect(() => {
    try {
      const p = localStorage.getItem(PROMPT_STORAGE_KEY)
      if (p) setF((v) => ({ ...v, description: p.slice(0, 600) }))
    } catch {
      // localStorage kapalı olabilir
    }
  }, [])

  const enough = credits >= cost

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const inputBody: Record<string, string> = {}
    for (const [k, v] of Object.entries(f)) if (v.trim()) inputBody[k] = k === 'whatsapp' ? v.replace(/\D/g, '') : v.trim()
    try {
      const res = await fetch('/api/ai/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': `site-${idem}` },
        body: JSON.stringify({ workspaceId, taskType: 'site.generate', input: inputBody }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Oluşturulamadı')
        return
      }
      try {
        localStorage.removeItem(PROMPT_STORAGE_KEY)
      } catch {}
      window.location.href = `/panel/gorev/${data.task.id}?ws=${encodeURIComponent(workspaceId)}`
    } catch {
      setError('Bağlantı hatası')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-bold text-gray-700 dark:text-gray-200">İşletme adı *</span>
          <input required minLength={2} maxLength={80} value={f.businessName} onChange={set('businessName')} className={input} placeholder="Demir Kuaför" />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Sektör *</span>
          <select value={f.sector} onChange={set('sector')} className={input}>
            {SECTORS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Şehir</span>
          <input maxLength={60} value={f.city} onChange={set('city')} className={input} placeholder="İzmir" />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Ana hizmet</span>
          <input maxLength={80} value={f.service} onChange={set('service')} className={input} placeholder="Saç kesimi ve boya" />
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">İşletmenizi anlatın</span>
        <textarea rows={4} maxLength={600} value={f.description} onChange={set('description')} className={input} placeholder="Kimlere hizmet veriyorsunuz, sizi farklı kılan ne?" />
      </label>
      <div className="grid sm:grid-cols-3 gap-4">
        <label className="block">
          <span className="text-sm font-bold text-gray-700 dark:text-gray-200">WhatsApp</span>
          <input inputMode="tel" maxLength={20} value={f.whatsapp} onChange={set('whatsapp')} className={input} placeholder="905xxxxxxxxx" />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Telefon</span>
          <input inputMode="tel" maxLength={30} value={f.phone} onChange={set('phone')} className={input} placeholder="0232 xxx xx xx" />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-gray-700 dark:text-gray-200">E-posta</span>
          <input type="email" maxLength={120} value={f.email} onChange={set('email')} className={input} placeholder="info@isletme.com" />
        </label>
      </div>
      <fieldset>
        <legend className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Tarz</legend>
        <div className="flex flex-wrap gap-2">
          {STYLES.map(([v, label]) => (
            <label key={v} className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-bold ${f.style === v ? 'bg-teal-700 text-white border-teal-700' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'}`}>
              <input type="radio" name="style" value={v} checked={f.style === v} onChange={set('style')} className="sr-only" />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {enough ? (
        <button type="submit" disabled={busy} className="w-full sm:w-auto rounded-lg bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold px-6 py-3">
          {busy ? 'Hazırlanıyor…' : `Sitemi oluştur (${cost} kredi)`}
        </button>
      ) : (
        <div className="rounded-lg bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 p-4 text-sm text-amber-900 dark:text-amber-100">
          Site oluşturmak {cost} kredi gerektirir; bakiyeniz {credits}.{' '}
          <Link href="/panel/kredi" className="font-bold underline">
            Plan veya kredi satın alın
          </Link>
        </div>
      )}
    </form>
  )
}
