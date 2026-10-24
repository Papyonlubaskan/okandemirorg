import { randomUUID } from 'crypto'
import { NextResponse } from 'next/server'
import { getStore } from '@/lib/ai/store'
import type { TaskStore } from '@/lib/ai/store-types'
import type { WorkspaceRole } from '@/lib/agents/policies'
import { getSessionUser, type SessionUser } from './session'

export type WorkspaceContext = {
  user: SessionUser
  workspaceId: string
  role: WorkspaceRole
  store: TaskStore
}

/** İlk girişte kişisel workspace (idempotent: üyeliği varsa dokunmaz) */
export async function ensurePersonalWorkspace(userId: string, name: string, store: TaskStore = getStore()): Promise<string> {
  const existing = await store.listMemberships(userId)
  if (existing.length) return existing[0].workspaceId
  const id = randomUUID()
  await store.createWorkspace({ id, name: name.slice(0, 120), ownerUserId: userId })
  await store
    .audit({ workspaceId: id, actorType: 'system', actorId: userId, action: 'workspace.created', targetType: 'workspace', targetId: id, outcome: 'ok' })
    .catch(() => {})
  return id
}

/**
 * Oturum + workspace üyeliği sunucu tarafında doğrulanır. İstemcinin gönderdiği workspaceId tek başına
 * yetki sayılmaz: yalnızca kullanıcının üyesi olduğu workspace'ler arasından seçim yapar.
 * Üye olmadığı workspace için 404 döner (varlık bilgisi sızdırılmaz).
 */
export async function requireWorkspace(
  requestedWorkspaceId?: string | null,
  opts: { roles?: WorkspaceRole[] } = {}
): Promise<WorkspaceContext | NextResponse> {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

  const store = getStore()
  let memberships = await store.listMemberships(user.id)
  if (!memberships.length && !requestedWorkspaceId) {
    await ensurePersonalWorkspace(user.id, user.name || user.email || 'Çalışma alanım', store)
    memberships = await store.listMemberships(user.id)
  }

  const m = requestedWorkspaceId ? memberships.find((x) => x.workspaceId === requestedWorkspaceId) : memberships[0]
  if (!m) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })
  if (opts.roles && !opts.roles.includes(m.role)) return NextResponse.json({ error: 'Yetkiniz yok' }, { status: 403 })

  return { user, workspaceId: m.workspaceId, role: m.role, store }
}

export function isResponse(v: unknown): v is NextResponse {
  return v instanceof NextResponse
}
