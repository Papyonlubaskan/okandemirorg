import { redirect } from 'next/navigation'
import TaskDetail from '@/components/panel/TaskDetail'
import { getStore } from '@/lib/ai/store'
import { getSessionUser } from '@/lib/auth/session'

export default async function GorevPage({
  params,
  searchParams,
}: {
  params: Promise<{ taskId: string }>
  searchParams: Promise<{ ws?: string }>
}) {
  const user = await getSessionUser()
  if (!user) redirect('/panel/giris')
  const [{ taskId }, { ws }] = await Promise.all([params, searchParams])
  const memberships = await getStore().listMemberships(user.id)
  const current = memberships.find((m) => m.workspaceId === ws) ?? memberships[0]
  if (!current) redirect('/panel')
  return <TaskDetail taskId={taskId} workspaceId={current.workspaceId} />
}
