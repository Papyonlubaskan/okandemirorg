import { NextRequest, NextResponse } from 'next/server'
import { requireInternalApiKey } from '@/lib/api-security'
import { featureDisabledResponse, isOrchestratorEnabled } from '@/lib/ai/feature'
import { getStore } from '@/lib/ai/store'
import { runWorkerTick } from '@/lib/jobs/worker'

export const dynamic = 'force-dynamic'

/**
 * POST /api/ai/worker/tick — n8n cron (dakikada bir) veya ayrı worker çağırır.
 * Header: x-api-key: INTERNAL_API_KEY. Eşzamanlı çağrılar güvenli (atomik lease).
 */
export async function POST(request: NextRequest) {
  if (!isOrchestratorEnabled()) return featureDisabledResponse()
  const authError = requireInternalApiKey(request)
  if (authError) return authError

  try {
    const result = await runWorkerTick(getStore(), { maxTasks: 3, timeBudgetMs: 40_000 })
    return NextResponse.json({
      ok: true,
      recovered: result.recovered,
      released: result.released,
      expired: result.expired,
      processed: result.processed.map((p) => ({ taskId: p.taskId, status: p.outcome.status, errorCode: p.outcome.errorCode })),
    })
  } catch {
    return NextResponse.json({ ok: false, error: 'Worker turu başarısız' }, { status: 500 })
  }
}
