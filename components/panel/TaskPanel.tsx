'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import StatusBadge, { TERMINAL } from './StatusBadge'

type TaskSummary = { id: string; taskType: string; status: string; createdAt: string; errorCode: string | null }

type Field = { name: string; label: string; placeholder: string; multiline?: boolean; optional?: boolean }

const FIELDS: Record<string, Field[]> = {
  'echo.test': [{ name: 'message', label: 'Mesaj', placeholder: 'Merhaba' }],
  'seo.audit': [{ name: 'url', label: 'Site URL', placeholder: 'https://ornek.com' }],
  'landing.draft': [
    { name: 'businessName', label: 'İşletme adı', placeholder: 'Demir Mobilya' },
    { name: 'city', label: 'Şehir', placeholder: 'İzmir' },
    { name: 'service', label: 'Hizmet', placeholder: 'Özel ölçü mobilya' },
    { name: 'whatsapp', label: 'WhatsApp (opsiyonel)', placeholder: '905xxxxxxxxx', optional: true },
    { name: 'highlights', label: 'Öne çıkanlar (opsiyonel)', placeholder: '20 yıllık tecrübe, ücretsiz keşif', optional: true, multiline: true },
  ],
  auto: [{ name: 'request', label: 'İsteğiniz', placeholder: 'ornek.com sitemi SEO açısından denetle', multiline: true }],
}

/** Panelden doğrudan oluşturulmayan türler (ör. yayın: görev detayından, onaylı) */
const HIDDEN_TYPES = ['landing.publish']

function newKey() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `k-${Date.now()}-${Math.random()}`
}

export default function TaskPanel({ workspaceId, taskTypes }: { workspaceId: string; taskTypes: { type: string; label: string }[] }) {
  const creatable = taskTypes.filter((t) => !HIDDEN_TYPES.includes(t.type))
  const [taskType, setTaskType] = useState(creatable.find((t) => t.type === 'seo.audit')?.type ?? creatable[0]?.type)
  const [values, setValues] = useState<Record<string, string>>({})
  const [tasks, setTasks] = useState<TaskSummary[]>([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [idemKey, setIdemKey] = useState(newKey)

  const load = useCallback(async () => {
    const res = await fetch(`/api/ai/tasks?workspaceId=${encodeURIComponent(workspaceId)}`, { cache: 'no-store' })
    if (res.ok) setTasks((await res.json()).tasks)
  }, [workspaceId])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!tasks.some((t) => !TERMINAL.includes(t.status))) return
    const id = setInterval(load, 5000)
    return () => clearInterval(id)
  }, [tasks, load])

  const fields = FIELDS[taskType] ?? FIELDS['echo.test']

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    const input: Record<string, string> = {}
    for (const f of fields) {
      const v = (values[f.name] || '').trim()
      if (v) input[f.name] = v
    }
    try {
      const res = await fetch('/api/ai/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idemKey },
        body: JSON.stringify({ workspaceId, taskType, input }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Görev oluşturulamadı')
        return
      }
      setValues({})
      setIdemKey(newKey())
      await load()
    } catch {
      setError('Bağlantı hatası')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 space-y-4">
        <label className="block">
          <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Görev türü</span>
          <select
            value={taskType}
            onChange={(e) => setTaskType(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white"
          >
            {creatable.map((t) => (
              <option key={t.type} value={t.type}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        {fields.map((field) => (
          <label key={field.name} className="block">
            <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{field.label}</span>
            {field.multiline ? (
              <textarea
                required={!field.optional}
                maxLength={2000}
                rows={3}
                value={values[field.name] || ''}
                onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                placeholder={field.placeholder}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white"
              />
            ) : (
              <input
                required={!field.optional}
                maxLength={2048}
                value={values[field.name] || ''}
                onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                placeholder={field.placeholder}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white"
              />
            )}
          </label>
        ))}
        {error && (
          <p className="text-red-600 dark:text-red-400 text-sm font-medium" role="alert">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className="rounded-lg bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold px-6 py-3">
          {busy ? 'Gönderiliyor…' : 'Görevi başlat'}
        </button>
        <p className="text-xs text-gray-500">Görevler kuyruğa alınır ve arka planda işlenir; sonuç birkaç dakika içinde görünür.</p>
      </form>

      <ul className="divide-y divide-gray-200 dark:divide-gray-700 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        {tasks.length === 0 && <li className="p-4 text-sm text-gray-500">Henüz görev yok.</li>}
        {tasks.map((t) => (
          <li key={t.id}>
            <Link
              href={`/panel/gorev/${t.id}?ws=${encodeURIComponent(workspaceId)}`}
              className="flex items-center justify-between gap-3 p-4 hover:bg-slate-50 dark:hover:bg-gray-700/50"
            >
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {taskTypes.find((x) => x.type === t.taskType)?.label ?? t.taskType}
                <span className="block text-xs text-gray-500">{new Date(t.createdAt).toLocaleString('tr-TR')}</span>
              </span>
              <StatusBadge status={t.status} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
