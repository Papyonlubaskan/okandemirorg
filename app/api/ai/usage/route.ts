import { NextRequest, NextResponse } from 'next/server'
import { featureDisabledResponse, isOrchestratorEnabled } from '@/lib/ai/feature'
import { isResponse, requireWorkspace } from '@/lib/auth/workspace'

export const dynamic = 'force-dynamic'

/** GET /api/ai/usage?workspaceId= — bu ayın model çağrıları, tahmini maliyet, bütçe (owner/admin) */
export async function GET(request: NextRequest) {
  if (!isOrchestratorEnabled()) return featureDisabledResponse()
  const ctx = await requireWorkspace(request.nextUrl.searchParams.get('workspaceId'), { roles: ['owner', 'admin'] })
  if (isResponse(ctx)) return ctx

  const [report, ws] = await Promise.all([ctx.store.usageReport(ctx.workspaceId), ctx.store.getWorkspace(ctx.workspaceId)])
  const budget = ws?.monthlyBudgetUsd ?? 0
  return NextResponse.json({
    workspaceId: ctx.workspaceId,
    plan: ws?.plan,
    monthlyBudgetUsd: budget,
    remainingBudgetUsd: Math.max(0, budget - report.totalCostUsd),
    note: 'Maliyetler sağlayıcı fiyat tahminidir; kesin fatura değildir.',
    ...report,
  })
}
