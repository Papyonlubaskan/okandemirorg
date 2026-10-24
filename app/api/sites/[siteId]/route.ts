import { NextRequest, NextResponse } from 'next/server'
import { featureDisabledResponse, isOrchestratorEnabled } from '@/lib/ai/feature'
import { siteContentHash } from '@/lib/agents/tools/site'
import { isResponse, requireWorkspace } from '@/lib/auth/workspace'
import { checkDbRateLimit } from '@/lib/security/rate-limit'
import { rateLimitResponse } from '@/lib/api-security'
import { siteSchema } from '@/lib/sites/schema'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ siteId: string }> }

/** GET /api/sites/:id?workspaceId=&v= — site + (varsayılan güncel) sürüm şeması */
export async function GET(request: NextRequest, { params }: Params) {
  if (!isOrchestratorEnabled()) return featureDisabledResponse()
  const { siteId } = await params
  const ctx = await requireWorkspace(request.nextUrl.searchParams.get('workspaceId'))
  if (isResponse(ctx)) return ctx

  const site = await ctx.store.getSite(siteId, ctx.workspaceId)
  if (!site) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })
  const v = Number(request.nextUrl.searchParams.get('v')) || site.currentVersion
  const version = v ? await ctx.store.getSiteVersion(site.id, v) : null
  const leads = await ctx.store.listSiteLeads(ctx.workspaceId, site.id, 50).catch(() => [])
  return NextResponse.json({ site, version, leads, role: ctx.role })
}

/**
 * PUT /api/sites/:id — manuel düzenleme (model yok, kredi yok): { workspaceId?, baseVersion, schema }
 * baseVersion güncel değilse 409 (başka bir düzenleme araya girdi).
 */
export async function PUT(request: NextRequest, { params }: Params) {
  if (!isOrchestratorEnabled()) return featureDisabledResponse()
  const { siteId } = await params

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
  }
  const ctx = await requireWorkspace(typeof body.workspaceId === 'string' ? body.workspaceId : null)
  if (isResponse(ctx)) return ctx
  if (!(await checkDbRateLimit(`site-edit:${ctx.user.id}`, 120, 60 * 60 * 1000))) return rateLimitResponse()

  const site = await ctx.store.getSite(siteId, ctx.workspaceId)
  if (!site) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })
  if (Number(body.baseVersion) !== site.currentVersion) {
    return NextResponse.json({ error: 'Site bu arada güncellendi; sayfayı yenileyin', code: 'version_conflict' }, { status: 409 })
  }
  if (Buffer.byteLength(JSON.stringify(body.schema ?? null)) > 200_000) return NextResponse.json({ error: 'Çok büyük' }, { status: 413 })

  const parsed = siteSchema.safeParse(body.schema)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Geçersiz içerik', details: parsed.error.issues.slice(0, 5).map((i) => `${i.path.join('.')}: ${i.message}`) },
      { status: 400 }
    )
  }
  const contentHash = siteContentHash(parsed.data)
  const version = await ctx.store.addSiteVersion({
    siteId: site.id,
    workspaceId: ctx.workspaceId,
    schema: parsed.data,
    contentHash,
    source: 'manual',
    taskId: null,
    createdBy: ctx.user.id,
  })
  return NextResponse.json({ ok: true, version, contentHash })
}
