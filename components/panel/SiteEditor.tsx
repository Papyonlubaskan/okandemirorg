'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import SchemaFields from './SchemaFields'

/* eslint-disable @typescript-eslint/no-explicit-any */
type Schema = any

type Detail = {
  site: { id: string; slug: string; name: string; status: string; currentVersion: number; publishedVersion: number | null }
  version: { version: number; schema: Schema; contentHash: string; source: string } | null
  leads: { id: number; name: string; phone: string | null; email: string | null; message: string; createdAt: string }[]
  role: string
}

const SECTION_LABELS: Record<string, string> = {
  hero: 'Giriş (hero)',
  features: 'Özellikler',
  services: 'Hizmetler',
  about: 'Hakkımızda',
  stats: 'Rakamlar',
  testimonials: 'Yorumlar',
  pricing: 'Fiyatlar',
  faq: 'SSS',
  gallery: 'Galeri',
  cta: 'Çağrı (CTA)',
  contact: 'İletişim',
}

/** Boş metin alanlarını kaldır (opsiyonel alanlar boş string ile doğrulamadan geçmez) */
function cleanEmpty(v: any): any {
  if (Array.isArray(v)) return v.map(cleanEmpty)
  if (v && typeof v === 'object') {
    return Object.fromEntries(
      Object.entries(v)
        .filter(([, x]) => !(typeof x === 'string' && x.trim() === ''))
        .map(([k, x]) => [k, cleanEmpty(x)])
    )
  }
  return v
}

const btn = 'rounded-lg font-bold px-4 py-2 text-sm disabled:opacity-50'

export default function SiteEditor({ siteId, workspaceId, editCost }: { siteId: string; workspaceId: string; editCost: number }) {
  const [data, setData] = useState<Detail | null>(null)
  const [schema, setSchema] = useState<Schema>(null)
  const [pageIdx, setPageIdx] = useState(0)
  const [secIdx, setSecIdx] = useState(0)
  const [tab, setTab] = useState<'ai' | 'edit' | 'theme' | 'leads'>('ai')
  const [instruction, setInstruction] = useState('')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const qs = `workspaceId=${encodeURIComponent(workspaceId)}`

  const load = useCallback(async () => {
    const res = await fetch(`/api/sites/${siteId}?${qs}`, { cache: 'no-store' })
    if (!res.ok) {
      setErr(res.status === 404 ? 'Site bulunamadı' : 'Yüklenemedi')
      return
    }
    const d: Detail = await res.json()
    setData(d)
    setSchema(structuredClone(d.version?.schema ?? null))
    setDirty(false)
    setReloadKey((k) => k + 1)
  }, [siteId, qs])

  useEffect(() => {
    load()
  }, [load])

  const page = schema?.pages?.[pageIdx]
  const section = page?.sections?.[secIdx]
  const previewSrc = useMemo(
    () => (data?.version ? `/api/sites/${siteId}/preview?${qs}&v=${data.version.version}&page=${encodeURIComponent(data.version.schema.pages[pageIdx]?.slug ?? '')}&r=${reloadKey}` : ''),
    [data, siteId, qs, pageIdx, reloadKey]
  )

  const update = (fn: (s: Schema) => void) => {
    setSchema((prev: Schema) => {
      const next = structuredClone(prev)
      fn(next)
      return next
    })
    setDirty(true)
  }

  function move(dir: -1 | 1) {
    update((s) => {
      const a = s.pages[pageIdx].sections
      ;[a[secIdx + dir], a[secIdx]] = [a[secIdx], a[secIdx + dir]]
    })
    setSecIdx(secIdx + dir)
  }

  async function save() {
    setBusy(true)
    setErr('')
    setMsg('')
    const res = await fetch(`/api/sites/${siteId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workspaceId, baseVersion: data?.site.currentVersion, schema: cleanEmpty(schema) }),
    })
    const body = await res.json()
    setBusy(false)
    if (!res.ok) {
      setErr([body.error, ...(body.details ?? [])].filter(Boolean).join(' · '))
      return
    }
    setMsg(`Kaydedildi (sürüm ${body.version})`)
    await load()
  }

  async function createTask(taskType: string, input: Record<string, unknown>, key: string) {
    const res = await fetch('/api/ai/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key },
      body: JSON.stringify({ workspaceId, taskType, input }),
    })
    const body = await res.json()
    if (!res.ok) throw new Error(body.error || 'İşlem başlatılamadı')
    return body.task.id as string
  }

  async function aiEdit(e: React.FormEvent) {
    e.preventDefault()
    if (dirty) {
      setErr('Önce kaydedilmemiş değişiklikleri kaydedin veya geri alın.')
      return
    }
    setBusy(true)
    setErr('')
    try {
      const id = await createTask('site.edit', { siteId, instruction }, `edit-${siteId}-${data?.site.currentVersion}-${instruction.length}-${Date.now()}`)
      window.location.href = `/panel/gorev/${id}?ws=${encodeURIComponent(workspaceId)}`
    } catch (e2) {
      setErr((e2 as Error).message)
      setBusy(false)
    }
  }

  async function publish() {
    if (!data?.version) return
    setBusy(true)
    setErr('')
    try {
      const v = data.version
      const id = await createTask('site.publish', { siteId, version: v.version, contentHash: v.contentHash }, `publish-${siteId}-${v.version}-${v.contentHash.slice(0, 16)}`)
      window.location.href = `/panel/gorev/${id}?ws=${encodeURIComponent(workspaceId)}`
    } catch (e2) {
      setErr((e2 as Error).message)
      setBusy(false)
    }
  }

  async function unpublish() {
    setBusy(true)
    await fetch(`/api/sites/${siteId}/unpublish?${qs}`, { method: 'POST' })
    setBusy(false)
    await load()
  }

  if (err && !data) return <p className="text-red-600">{err}</p>
  if (!data || !schema) return <p className="text-gray-500">Yükleniyor…</p>

  const isLive = data.site.status === 'published'
  const liveIsCurrent = isLive && data.site.publishedVersion === data.site.currentVersion
  const canManage = data.role !== 'member'

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">{data.site.name}</h1>
        <span className="text-xs text-gray-500">
          sürüm {data.site.currentVersion} · {isLive ? `yayında (v${data.site.publishedVersion})` : data.site.status === 'suspended' ? 'askıda' : 'taslak'}
        </span>
        <div className="ml-auto flex flex-wrap gap-2">
          {isLive && (
            <a href={`/s/${data.site.slug}`} target="_blank" rel="noopener noreferrer" className={`${btn} border border-teal-700 text-teal-800 dark:text-teal-300`}>
              Canlı siteyi aç
            </a>
          )}
          {canManage && !liveIsCurrent && (
            <button onClick={publish} disabled={busy || dirty} className={`${btn} bg-teal-700 text-white`}>
              {isLive ? 'Güncellemeyi yayınla' : 'Yayınla'}
            </button>
          )}
          {canManage && isLive && (
            <button onClick={unpublish} disabled={busy} className={`${btn} border border-red-600 text-red-700`}>
              Yayından kaldır
            </button>
          )}
        </div>
      </div>

      {msg && <p className="text-sm text-teal-700 dark:text-teal-300">{msg}</p>}
      {err && (
        <p className="text-sm text-red-600" role="alert">
          {err}
        </p>
      )}

      <div className="grid lg:grid-cols-[380px_1fr] gap-4">
        <aside className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 space-y-4 lg:max-h-[78vh] lg:overflow-y-auto">
          <div className="flex gap-1 text-sm font-bold">
            {(
              [
                ['ai', 'AI'],
                ['edit', 'Düzenle'],
                ['theme', 'Tema'],
                ['leads', `Mesajlar (${data.leads.length})`],
              ] as const
            ).map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} className={`rounded-md px-3 py-1.5 ${tab === k ? 'bg-teal-700 text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                {l}
              </button>
            ))}
          </div>

          <label className="block text-xs font-bold text-gray-600 dark:text-gray-300">
            Sayfa
            <select
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
              value={pageIdx}
              onChange={(e) => {
                setPageIdx(Number(e.target.value))
                setSecIdx(0)
              }}
            >
              {schema.pages.map((p: Schema, i: number) => (
                <option key={p.slug || 'home'} value={i}>
                  {p.title}
                </option>
              ))}
            </select>
          </label>

          {tab === 'ai' && (
            <form onSubmit={aiEdit} className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-300">Ne değişsin? Yapay zekâ tüm siteyi talimatınıza göre günceller ve yeni sürüm oluşturur.</p>
              <textarea
                required
                minLength={3}
                maxLength={1000}
                rows={5}
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="Örn: Ana sayfaya fiyat tablosu ekle, renkleri koyu laciverte çevir, hakkımızda metnini daha samimi yap."
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
              />
              <button type="submit" disabled={busy} className={`${btn} bg-teal-700 text-white w-full`}>
                Uygula ({editCost} kredi)
              </button>
            </form>
          )}

          {tab === 'edit' && page && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-300">
                Bölüm
                <select
                  className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
                  value={secIdx}
                  onChange={(e) => setSecIdx(Number(e.target.value))}
                >
                  {page.sections.map((s: Schema, i: number) => (
                    <option key={i} value={i}>
                      {i + 1}. {SECTION_LABELS[s.type] ?? s.type}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex gap-2 text-xs font-bold">
                <button type="button" disabled={secIdx === 0} onClick={() => move(-1)} className="text-gray-600 disabled:opacity-40">
                  ↑ Yukarı
                </button>
                <button type="button" disabled={secIdx >= page.sections.length - 1} onClick={() => move(1)} className="text-gray-600 disabled:opacity-40">
                  ↓ Aşağı
                </button>
                <button type="button" disabled={page.sections.length <= 1} onClick={() => { update((s) => { s.pages[pageIdx].sections.splice(secIdx, 1) }); setSecIdx(0) }} className="ml-auto text-red-600 disabled:opacity-40">
                  Bölümü sil
                </button>
              </div>
              {section && <SchemaFields value={section} onChange={(v) => update((s) => (s.pages[pageIdx].sections[secIdx] = v))} />}
              <details className="text-sm">
                <summary className="cursor-pointer font-bold text-gray-700 dark:text-gray-200">Sayfa SEO</summary>
                <div className="mt-2">
                  <SchemaFields value={page.seo} onChange={(v) => update((s) => (s.pages[pageIdx].seo = v))} />
                </div>
              </details>
            </div>
          )}

          {tab === 'theme' && (
            <div className="space-y-3 text-sm">
              {(['primary', 'accent'] as const).map((k) => (
                <label key={k} className="flex items-center justify-between gap-3 font-bold text-gray-700 dark:text-gray-200">
                  {k === 'primary' ? 'Ana renk' : 'Vurgu rengi'}
                  <input type="color" value={schema.theme[k]} onChange={(e) => update((s) => (s.theme[k] = e.target.value))} />
                </label>
              ))}
              {(
                [
                  ['mode', 'Görünüm', [['light', 'Açık'], ['dark', 'Koyu']]],
                  ['font', 'Yazı tipi', [['modern', 'Modern'], ['classic', 'Klasik'], ['friendly', 'Samimi']]],
                  ['radius', 'Köşeler', [['none', 'Keskin'], ['md', 'Orta'], ['lg', 'Yuvarlak']]],
                ] as const
              ).map(([k, l, opts]) => (
                <label key={k} className="block font-bold text-gray-700 dark:text-gray-200">
                  {l}
                  <select className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2" value={schema.theme[k]} onChange={(e) => update((s) => (s.theme[k] = e.target.value))}>
                    {opts.map(([v, t]) => (
                      <option key={v} value={v}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
              <p className="font-bold text-gray-700 dark:text-gray-200 pt-2">İşletme bilgileri</p>
              <SchemaFields value={schema.business} onChange={(v) => update((s) => (s.business = v))} />
            </div>
          )}

          {tab === 'leads' && (
            <ul className="space-y-3 text-sm">
              {data.leads.length === 0 && <li className="text-gray-500">Henüz form mesajı yok. Site yayına çıkınca iletişim formundan gelenler burada görünür.</li>}
              {data.leads.map((l) => (
                <li key={l.id} className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                  <p className="font-bold text-gray-900 dark:text-white">{l.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(l.createdAt).toLocaleString('tr-TR')} · {l.phone || ''} {l.email || ''}
                  </p>
                  <p className="mt-1 text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{l.message}</p>
                </li>
              ))}
            </ul>
          )}

          {(tab === 'edit' || tab === 'theme') && (
            <div className="flex gap-2 sticky bottom-0 bg-white dark:bg-gray-800 pt-2">
              <button onClick={save} disabled={busy || !dirty} className={`${btn} bg-teal-700 text-white flex-1`}>
                Kaydet (kredisiz)
              </button>
              <button onClick={() => load()} disabled={busy || !dirty} className={`${btn} border border-gray-300 text-gray-700 dark:text-gray-200`}>
                Geri al
              </button>
            </div>
          )}
        </aside>

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white overflow-hidden">
          {dirty && <p className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1">Kaydedilmemiş değişiklikler var — önizleme kaydettikten sonra güncellenir.</p>}
          <iframe key={previewSrc} title="Site önizleme" sandbox="" src={previewSrc} className="w-full h-[78vh] bg-white" />
        </div>
      </div>
    </div>
  )
}
