'use client'

import { Suspense, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { zipSingleTextFile } from '@/lib/simple-zip'

function PanelInner() {
  const searchParams = useSearchParams()
  const token = useMemo(() => searchParams.get('token') || '', [searchParams])
  const [businessName, setBusinessName] = useState('')
  const [city, setCity] = useState('')
  const [service, setService] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [highlights, setHighlights] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [html, setHtml] = useState('')
  const [filename, setFilename] = useState('landing.html')

  async function generate(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setHtml('')
    if (!token) {
      setError('Token eksik. WhatsApp’taki panel linkini kullanın.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/ai/landing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          businessName,
          city,
          service,
          phone,
          whatsapp,
          highlights,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.error || 'Üretim başarısız')
        return
      }
      setHtml(data.html || '')
      setFilename(data.filename || 'landing.html')
    } catch {
      setError('Bağlantı hatası')
    } finally {
      setLoading(false)
    }
  }

  function downloadHtml() {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = filename
    a.click()
  }

  function downloadZip() {
    const base = filename.replace(/\.html$/i, '') || 'landing'
    const blob = zipSingleTextFile(`${base}.html`, html)
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${base}.zip`
    a.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <p className="text-sm text-gray-500 mb-2">
          <Link href="/hizmetler/ai-landing" className="text-cyan-800 font-bold">
            AI Landing Sayfa
          </Link>
          {' · '}
          Panel
        </p>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Sayfa üret</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          İş + şehir + hizmet → tek sayfalık HTML. Yayınlama ayrı.
        </p>

        {!token && (
          <div className="rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 p-4 mb-6">
            Token yok. WhatsApp panel linkini açın.
          </div>
        )}

        <form onSubmit={generate} className="space-y-4 mb-8">
          {(
            [
              ['İşletme adı', businessName, setBusinessName, 'Örn. Demir Klinik'],
              ['Şehir', city, setCity, 'Örn. İzmir'],
              ['Hizmet', service, setService, 'Örn. Diş implant'],
              ['Telefon', phone, setPhone, 'Opsiyonel'],
              ['WhatsApp (90…)', whatsapp, setWhatsapp, '90555…'],
            ] as const
          ).map(([label, value, setter, ph]) => (
            <label key={label} className="block">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{label}</span>
              <input
                required={label === 'İşletme adı' || label === 'Şehir' || label === 'Hizmet'}
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder={ph}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3"
              />
            </label>
          ))}
          <label className="block">
            <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Öne çıkanlar</span>
            <textarea
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3"
              placeholder="Opsiyonel kısa maddeler"
            />
          </label>
          <button
            type="submit"
            disabled={loading || !token}
            className="rounded-lg bg-cyan-800 hover:bg-cyan-900 disabled:opacity-50 text-white font-bold px-6 py-3"
          >
            {loading ? 'Üretiliyor…' : 'HTML üret'}
          </button>
        </form>

        {error && <p className="text-red-600 font-medium mb-4">{error}</p>}

        {html && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={downloadHtml}
                className="rounded-lg bg-slate-900 text-white font-bold px-4 py-2"
              >
                HTML indir
              </button>
              <button
                type="button"
                onClick={downloadZip}
                className="rounded-lg border border-slate-700 font-bold px-4 py-2"
              >
                ZIP indir
              </button>
            </div>
            <iframe
              title="Önizleme"
              srcDoc={html}
              className="w-full h-[480px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default function AiLandingPanelPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Yükleniyor…</div>}>
      <PanelInner />
    </Suspense>
  )
}
