import { NextRequest, NextResponse } from 'next/server'
import { requireInternalApiKey } from '@/lib/api-security'
import { featureDisabledResponse, isOrchestratorEnabled } from '@/lib/ai/feature'
import { getStore } from '@/lib/ai/store'
import { isPlan, PLAN_MONTHLY_CREDITS } from '@/lib/billing/plans'

export const dynamic = 'force-dynamic'

/**
 * POST /api/ai/admin/plan — abonelik ödemesi alındıktan sonra planı ayarla (yalnız dahili anahtar).
 * Body: { email | workspaceId, plan: free|starter|pro|agency, monthlyBudgetUsd?, grantNow? }
 * grantNow=true: bu ayın kredisini hemen yükler (ay içinde bir kez, idempotent).
 */
export async function POST(request: NextRequest) {
  if (!isOrchestratorEnabled()) return featureDisabledResponse()
  const authError = requireInternalApiKey(request)
  if (authError) return authError

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
  }
  if (!isPlan(body.plan)) return NextResponse.json({ error: 'Geçersiz plan' }, { status: 400 })
  const budget = body.monthlyBudgetUsd === undefined ? undefined : Number(body.monthlyBudgetUsd)
  if (budget !== undefined && (!Number.isFinite(budget) || budget < 0 || budget > 100)) {
    return NextResponse.json({ error: 'monthlyBudgetUsd 0-100 arası olmalı' }, { status: 400 })
  }

  const store = getStore()
  const workspaceId =
    typeof body.workspaceId === 'string'
      ? body.workspaceId
      : typeof body.email === 'string'
        ? await store.findWorkspaceIdByOwnerEmail(body.email)
        : null
  if (!workspaceId || !(await store.setWorkspacePlan(workspaceId, body.plan, budget))) {
    return NextResponse.json({ error: 'Workspace bulunamadı (kullanıcı önce panele giriş yapmalı)' }, { status: 404 })
  }

  let granted = 0
  if (body.grantNow === true) granted = await store.grantMonthlyPlanCredits(PLAN_MONTHLY_CREDITS)

  await store
    .audit({ workspaceId, actorType: 'system', actorId: null, action: 'workspace.plan_set', targetType: 'workspace', targetId: workspaceId, outcome: 'ok', metadata: { plan: body.plan, budget } })
    .catch(() => {})
  return NextResponse.json({ ok: true, workspaceId, plan: body.plan, granted })
}
