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

const CLAIM_MESSAGES: Record<string, string> = {
  ok: 'Kredi hesabınıza yüklendi.',
  gecersiz: 'Link geçersiz, süresi dolmuş veya daha önce kullanılmış.',
  limit: 'Çok fazla deneme. Bir süre sonra tekrar deneyin.',
}

export default async function PanelPage({
  searchParams,
}: {
  searchParams: Promise<{ ws?: string; claim?: string; kredi?: string }>
}) {
  const user = await getSessionUser()
  if (!user) redirect('/panel/giris')

  const store = getStore()
  await ensurePersonalWorkspace(user.id, user.name || user.email || 'Çalışma alanım', store)
  const memberships = await store.listMemberships(user.id)
  const { ws, claim, kredi } = await searchParams
  const current = memberships.find((m) => m.workspaceId === ws) ?? memberships[0]
  const credits = await store.getCreditBalance(current.workspaceId).catch(() => null)
  const claimMessage = claim ? CLAIM_MESSAGES[claim] : null

  const taskTypes = Object.values(TASK_TYPES)
    .filter((t) => t.userCreatable && t.type !== 'site.generate')
    .map((t) => ({ type: t.type, label: `${t.label} · ${t.creditCost} kredi` }))

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Görevler</h1>
          <p className="text-sm text-gray-500">
            {user.email} · {current.name} ({current.role}) · plan: {current.plan}
            {credits !== null && <> · kredi: <strong>{credits}</strong></>}
          </p>
        </div>
        <form action={logout}>
          <button type="submit" className="text-sm font-bold text-gray-600 dark:text-gray-300 underline">
            Çıkış
          </button>
        </form>
      </div>
      {claimMessage && (
        <p className="rounded-lg bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 p-3 mb-6 text-sm text-teal-900 dark:text-teal-100" role="status">
          {claimMessage} {claim === 'ok' && kredi ? `(+${Number(kredi) || 0})` : ''}
        </p>
      )}
      {credits === 0 && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          AI SEO Denetim gibi görevler kredi kullanır. Paket için{' '}
          <a href="/hizmetler/ai-denetim" className="text-teal-700 font-bold underline">
            AI SEO Denetim
          </a>{' '}
          sayfasından WhatsApp ile sipariş verin.
        </p>
      )}
      <TaskPanel workspaceId={current.workspaceId} taskTypes={taskTypes} />
    </div>
  )
}
