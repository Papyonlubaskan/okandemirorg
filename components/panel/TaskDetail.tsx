'use client'

import { useCallback, useEffect, useState } from 'react'
import StatusBadge, { TERMINAL } from './StatusBadge'

type Approval = {
  id: string
  payloadHash: string
  payloadVersion: number
  expiresAt: string
  summary: { tool: string; summary: string; target?: string; budget?: string; effects?: string[] }
}

type Detail = {
  task: {
    id: string
    taskType: string
    status: string
    input: Record<string, unknown>
    result: unknown
    errorCode: string | null
    errorMessage: string | null
    costUsd: number
    modelCalls: number
    createdAt: string
    finishedAt: string | null
  }
  steps: { stepKey: string; tool: string; status: string }[]
  approvals: Approval[]
  role: string
}

type DraftResult = { draftId: string; contentHash: string; previewPath: string; title: string; source: string }
type PublishResult = { published: true; path: string }

function draftOf(result: unknown): DraftResult | null {
  const r = result as Partial<DraftResult> | null
  return r && typeof r.previewPath === 'string' && typeof r.draftId === 'string' && typeof r.contentHash === 'string' ? (r as DraftResult) : null
}

function publishedOf(result: unknown): PublishResult | null {
  const r = result as Partial<PublishResult> | null
  return r && r.published === true && typeof r.path === 'string' ? (r as PublishResult) : null
}

function reportOf(result: unknown): string | null {
  if (result && typeof result === 'object' && typeof (result as { report?: unknown }).report === 'string') {
    return (result as { report: string }).report
  }
  return null
}

export default function TaskDetail({ taskId, workspaceId }: { taskId: string; workspaceId: string }) {
  const [data, setData] = useState<Detail | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const qs = `workspaceId=${encodeURIComponent(workspaceId)}`

  const load = useCallback(async () => {
    const res = await fetch(`/api/ai/tasks/${taskId}?${qs}`, { cache: 'no-store' })
    if (!res.ok) {
      setError(res.status === 404 ? 'Görev bulunamadı' : 'Yüklenemedi')
      return
    }
    setData(await res.json())
  }, [taskId, qs])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!data || TERMINAL.includes(data.task.status)) return
    const id = setInterval(load, 4000)
    return () => clearInterval(id)
  }, [data, load])

  async function decide(a: Approval, decision: 'approve' | 'reject') {
    setBusy(true)
    setError('')
    const res = await fetch(`/api/ai/approvals/${a.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workspaceId, decision, payloadHash: a.payloadHash }),
    })
    if (!res.ok) setError((await res.json()).error || 'Karar kaydedilemedi')
    setBusy(false)
    load()
  }

  async function requestPublish(d: DraftResult) {
    setBusy(true)
    setError('')
    const res = await fetch('/api/ai/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': `publish-${d.draftId}-${d.contentHash.slice(0, 16)}` },
      body: JSON.stringify({ workspaceId, taskType: 'landing.publish', input: { draftId: d.draftId, contentHash: d.contentHash } }),
    })
    const body = await res.json()
    setBusy(false)
    if (!res.ok) {
      setError(body.error || 'Yayın isteği oluşturulamadı')
      return
    }
    window.location.href = `/panel/gorev/${body.task.id}?ws=${encodeURIComponent(workspaceId)}`
  }

  async function cancel() {
    setBusy(true)
    const res = await fetch(`/api/ai/tasks/${taskId}?${qs}`, { method: 'DELETE' })
    if (!res.ok) setError((await res.json()).error || 'İptal edilemedi')
    setBusy(false)
    load()
  }

  if (error && !data) return <p className="text-red-600">{error}</p>
  if (!data) return <p className="text-gray-500">Yükleniyor…</p>

  const { task } = data
  const report = reportOf(task.result)
  const draft = draftOf(task.result)
  const published = publishedOf(task.result)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">{task.taskType}</h1>
        <StatusBadge status={task.status} />
        {!TERMINAL.includes(task.status) && (
          <button onClick={cancel} disabled={busy} className="ml-auto text-sm font-bold text-red-700 dark:text-red-400 underline">
            İptal et
          </button>
        )}
      </div>
      <p className="text-xs text-gray-500">
        {new Date(task.createdAt).toLocaleString('tr-TR')} · model çağrısı: {task.modelCalls} · tahmini maliyet: ${task.costUsd.toFixed(4)}
      </p>

      {error && <p className="text-red-600 text-sm" role="alert">{error}</p>}

      {data.approvals.map((a) => (
        <div key={a.id} className="rounded-xl border-2 border-amber-400 bg-amber-50 dark:bg-amber-900/20 p-5 space-y-3">
          <h2 className="font-black text-amber-900 dark:text-amber-100">Onayınız gerekiyor</h2>
          <dl className="text-sm text-gray-800 dark:text-gray-100 space-y-1">
            <div><dt className="inline font-bold">İşlem: </dt><dd className="inline">{a.summary.summary}</dd></div>
            <div><dt className="inline font-bold">Araç: </dt><dd className="inline">{a.summary.tool}</dd></div>
            {a.summary.target && <div><dt className="inline font-bold">Hedef: </dt><dd className="inline">{a.summary.target}</dd></div>}
            {a.summary.budget && <div><dt className="inline font-bold">Bütçe: </dt><dd className="inline">{a.summary.budget}</dd></div>}
            {a.summary.effects?.length ? (
              <div>
                <dt className="font-bold">Etkiler:</dt>
                <dd><ul className="list-disc list-inside">{a.summary.effects.map((e) => <li key={e}>{e}</li>)}</ul></dd>
              </div>
            ) : null}
            <div><dt className="inline font-bold">Son geçerlilik: </dt><dd className="inline">{new Date(a.expiresAt).toLocaleString('tr-TR')}</dd></div>
            <div className="text-xs text-gray-500">Sürüm {a.payloadVersion} · {a.payloadHash.slice(0, 12)}…</div>
          </dl>
          {data.role === 'member' ? (
            <p className="text-sm text-gray-600">Bu işlemi yalnızca workspace sahibi veya yöneticisi onaylayabilir.</p>
          ) : (
            <div className="flex gap-3">
              <button onClick={() => decide(a, 'approve')} disabled={busy} className="rounded-lg bg-teal-700 text-white font-bold px-5 py-2 disabled:opacity-50">
                Onayla
              </button>
              <button onClick={() => decide(a, 'reject')} disabled={busy} className="rounded-lg border border-red-600 text-red-700 font-bold px-5 py-2 disabled:opacity-50">
                Reddet
              </button>
            </div>
          )}
        </div>
      ))}

      <ol className="text-sm space-y-1">
        {data.steps.map((s) => (
          <li key={s.stepKey} className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
            <StatusBadge status={s.status === 'pending' ? 'queued' : s.status} /> {s.tool}
          </li>
        ))}
      </ol>

      {task.status === 'failed' && (
        <p className="rounded-lg bg-red-50 dark:bg-red-900/30 p-4 text-sm text-red-800 dark:text-red-100">
          {task.errorMessage || task.errorCode}
        </p>
      )}

      {task.status === 'succeeded' && draft && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Taslak: <strong>{draft.title}</strong> ({draft.source === 'ai' ? 'AI' : 'şablon'}) · yalnızca siz görüyorsunuz
          </p>
          <iframe
            title="Taslak önizleme"
            sandbox=""
            src={`${draft.previewPath}?workspaceId=${encodeURIComponent(workspaceId)}`}
            className="w-full h-[600px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white"
          />
          {data.role !== 'member' && (
            <button onClick={() => requestPublish(draft)} disabled={busy} className="rounded-lg bg-teal-700 text-white font-bold px-5 py-2 disabled:opacity-50">
              Yayınla (onay ekranı açılır)
            </button>
          )}
        </div>
      )}

      {task.status === 'succeeded' && published && (
        <p className="rounded-lg bg-teal-50 dark:bg-teal-900/30 p-4 text-sm text-teal-900 dark:text-teal-100">
          Yayında:{' '}
          <a href={published.path} target="_blank" rel="noopener noreferrer" className="font-bold underline">
            okandemir.org{published.path}
          </a>
        </p>
      )}

      {task.status === 'succeeded' &&
        !draft &&
        !published &&
        (report ? (
          <pre className="whitespace-pre-wrap rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 text-sm text-gray-800 dark:text-gray-100 overflow-x-auto">
            {report}
          </pre>
        ) : (
          <pre className="whitespace-pre-wrap rounded-xl bg-white dark:bg-gray-800 border p-5 text-xs overflow-x-auto">
            {JSON.stringify(task.result, null, 2)}
          </pre>
        ))}
    </div>
  )
}
