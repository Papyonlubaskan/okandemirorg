'use client'

import { useEffect, useState } from 'react'

type Usage = {
  plan: string
  monthlyBudgetUsd: number
  remainingBudgetUsd: number
  totalCostUsd: number
  totalCalls: number
  note: string
  byModel: { provider: string; model: string; calls: number; costUsd: number; errors: number }[]
  tasks: { status: string; count: number }[]
}

export default function UsageView({ workspaceId }: { workspaceId: string }) {
  const [data, setData] = useState<Usage | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/ai/usage?workspaceId=${encodeURIComponent(workspaceId)}`, { cache: 'no-store' }).then(async (res) => {
      if (res.ok) setData(await res.json())
      else setError(res.status === 403 ? 'Kullanım raporunu yalnızca sahip/yönetici görür.' : 'Yüklenemedi')
    })
  }, [workspaceId])

  if (error) return <p className="text-gray-600">{error}</p>
  if (!data) return <p className="text-gray-500">Yükleniyor…</p>

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          ['Bu ay model çağrısı', String(data.totalCalls)],
          ['Tahmini maliyet', `$${data.totalCostUsd.toFixed(4)}`],
          ['Kalan aylık bütçe', `$${data.remainingBudgetUsd.toFixed(4)} / $${data.monthlyBudgetUsd.toFixed(2)}`],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-xs text-gray-500">{k}</p>
            <p className="text-xl font-black text-gray-900 dark:text-white">{v}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500">{data.note}</p>
      <ul className="text-sm space-y-1 text-gray-800 dark:text-gray-100">
        {data.byModel.map((m) => (
          <li key={`${m.provider}|${m.model}`}>
            {m.provider} / {m.model}: {m.calls} çağrı, {m.errors} hata, ${m.costUsd.toFixed(4)}
          </li>
        ))}
        {data.byModel.length === 0 && <li className="text-gray-500">Bu ay model çağrısı yok (şablon/kural yolu ücretsiz).</li>}
      </ul>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Görevler: {data.tasks.map((t) => `${t.status}: ${t.count}`).join(' · ') || '—'}
      </p>
    </div>
  )
}
