'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function PanelInner() {
  const searchParams = useSearchParams()
  const token = useMemo(() => searchParams.get('token') || '', [searchParams])
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [report, setReport] = useState('')
  const [meta, setMeta] = useState<{ finalUrl?: string; status?: number; loadMs?: number } | null>(
    null
  )

  async function runAudit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setReport('')
    setMeta(null)
    if (!token) {
      setError('Token eksik. WhatsApp’taki panel linkini kullanın.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/ai/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, url }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.error || 'Denetim başarısız')
        return
      }
      setReport(data.report || '')
      setMeta(data.signals || null)
    } catch {
      setError('Bağlantı hatası')
    } finally {
      setLoading(false)
    }
  }

  function downloadMd() {
    const blob = new Blob([report], { type: 'text/markdown;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'ai-seo-denetim.md'
    a.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <p className="text-sm text-gray-500 mb-2">
          <Link href="/hizmetler/ai-denetim" className="text-teal-700 font-bold">
            AI SEO Denetim
          </Link>
          {' · '}
          Panel
        </p>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">URL denetimi</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Ödeme onaylı token ile çalışır. Hesap şifresi gerekmez — sadece herkese açık URL.
        </p>

        {!token && (
          <div className="rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 p-4 mb-6 text-amber-900 dark:text-amber-100">
            Token yok. WhatsApp’taki “Panel” linkini açın.
          </div>
        )}

        <form onSubmit={runAudit} className="space-y-4 mb-8">
          <label className="block">
            <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Site URL</span>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://ornek.com"
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white"
            />
          </label>
          <button
            type="submit"
            disabled={loading || !token}
            className="w-full sm:w-auto rounded-lg bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold px-6 py-3"
          >
            {loading ? 'Denetleniyor…' : 'Rapor üret'}
          </button>
        </form>

        {error && (
          <p className="text-red-600 dark:text-red-400 font-medium mb-4" role="alert">
            {error}
          </p>
        )}

        {meta && (
          <p className="text-sm text-gray-500 mb-3">
            {meta.finalUrl} · HTTP {meta.status} · {meta.loadMs}ms
          </p>
        )}

        {report && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={downloadMd}
              className="rounded-lg border border-teal-700 text-teal-800 dark:text-teal-300 font-bold px-4 py-2"
            >
              Markdown indir
            </button>
            <pre className="whitespace-pre-wrap rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 text-sm text-gray-800 dark:text-gray-100 overflow-x-auto">
              {report}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AiDenetimPanelPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Yükleniyor…</div>}>
      <PanelInner />
    </Suspense>
  )
}
