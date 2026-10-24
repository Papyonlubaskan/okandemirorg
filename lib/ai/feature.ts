import { NextResponse } from 'next/server'

/** AI orkestratör + panel + auth. Varsayılan KAPALI; Railway: AI_ORCHESTRATOR_ENABLED=1 */
export function isOrchestratorEnabled(): boolean {
  const v = process.env.AI_ORCHESTRATOR_ENABLED
  return v === '1' || v === 'true'
}

/** Herkese açık ücretsiz mini denetim (migration 005 gerekir). Railway: AI_MINI_AUDIT_ENABLED=1 */
export function isMiniAuditEnabled(): boolean {
  const v = process.env.AI_MINI_AUDIT_ENABLED
  return v === '1' || v === 'true'
}

export function featureDisabledResponse(): NextResponse {
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
