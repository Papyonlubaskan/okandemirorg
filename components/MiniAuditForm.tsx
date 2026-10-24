'use client'

import { useState } from 'react'

type Result = { finalUrl: string; status: number; score: number; topIssues: string[]; issueCount: number }

export default function MiniAuditForm({ fullAuditHref }: { fullAuditHref: string }) {
  const [url, setUrl] = useState('')
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<Result | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/ai/mini-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, email }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) setError(data.error || 'Denetim yapılamadı')
      else setResult(data)
    } catch {
      setError('Bağlantı hatası')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      <h2 className="text-2xl font-black text-gray-900 dark:text-white">Ücretsiz mini denetim</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">Sitenizin hızlı skorunu ve ilk 3 sorununu görün. Günde 2 deneme.</p>
      <form onSubmit={submit} className="grid sm:grid-cols-[1fr_1fr_auto] gap-3">
        <input
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="ornek.com"
          maxLength={2048}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white"
        />
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e-posta"
          maxLength={255}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white"
        />
        <button type="submit" disabled={busy} className="rounded-lg bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold px-5 py-3">
          {busy ? 'Kontrol…' : 'Denetle'}
        </button>
      </form>
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      {result && (
        <div className="space-y-2">
          <p className="text-3xl font-black text-gray-900 dark:text-white">
            {result.score}
            <span className="text-base text-gray-500">/100</span>
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-200">
            {result.topIssues.map((i) => (
              <li key={i}>{i}</li>
            ))}
            {result.topIssues.length === 0 && <li>Belirgin temel sorun yok.</li>}
          </ul>
          {result.issueCount > result.topIssues.length && (
            <p className="text-sm text-gray-600 dark:text-gray-300">+{result.issueCount - result.topIssues.length} sorun daha var.</p>
          )}
          <a href={fullAuditHref} className="inline-block text-teal-700 dark:text-teal-300 font-bold underline">
            Tam rapor ve aksiyon planı için AI SEO Denetim →
          </a>
        </div>
      )}
    </div>
  )
}
