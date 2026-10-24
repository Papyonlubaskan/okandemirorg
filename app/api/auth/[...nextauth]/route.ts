import type { NextRequest } from 'next/server'
import { handlers } from '@/auth'
import { featureDisabledResponse, isOrchestratorEnabled } from '@/lib/ai/feature'

export async function GET(request: NextRequest) {
  if (!isOrchestratorEnabled()) return featureDisabledResponse()
  return handlers.GET(request)
}

export async function POST(request: NextRequest) {
  if (!isOrchestratorEnabled()) return featureDisabledResponse()
  return handlers.POST(request)
}
