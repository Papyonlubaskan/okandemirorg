import { redirect } from 'next/navigation'
import { signOut } from '@/auth'
import TaskPanel from '@/components/panel/TaskPanel'
import { getStore } from '@/lib/ai/store'
import { TASK_TYPES } from '@/lib/agents/task-types'
import { getSessionUser } from '@/lib/auth/session'
import { ensurePersonalWorkspace } from '@/lib/auth/workspace'

async function logout() {
  'use server'
  await signOut({ redirectTo: '/panel/giris' })
}

export default async function PanelPage({ searchParams }: { searchParams: Promise<{ ws?: string }> }) {
  const user = await getSessionUser()
  if (!user) redirect('/panel/giris')

  const store = getStore()
  await ensurePersonalWorkspace(user.id, user.name || user.email || 'Çalışma alanım', store)
  const memberships = await store.listMemberships(user.id)
  const { ws } = await searchParams
  const current = memberships.find((m) => m.workspaceId === ws) ?? memberships[0]

  const taskTypes = Object.values(TASK_TYPES).map((t) => ({ type: t.type, label: t.label }))

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Görevler</h1>
          <p className="text-sm text-gray-500">
            {user.email} · {current.name} ({current.role}) · plan: {current.plan}
          </p>
        </div>
        <form action={logout}>
          <button type="submit" className="text-sm font-bold text-gray-600 dark:text-gray-300 underline">
            Çıkış
          </button>
        </form>
      </div>
      <TaskPanel workspaceId={current.workspaceId} taskTypes={taskTypes} />
    </div>
  )
}
