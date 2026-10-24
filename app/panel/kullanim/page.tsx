import { redirect } from 'next/navigation'
import UsageView from '@/components/panel/UsageView'
import { getStore } from '@/lib/ai/store'
import { getSessionUser } from '@/lib/auth/session'

export default async function KullanimPage({ searchParams }: { searchParams: Promise<{ ws?: string }> }) {
  const user = await getSessionUser()
  if (!user) redirect('/panel/giris')
  const { ws } = await searchParams
  const memberships = await getStore().listMemberships(user.id)
  const current = memberships.find((m) => m.workspaceId === ws) ?? memberships[0]
  if (!current) redirect('/panel')
  return (
    <div>
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Kullanım ve bütçe</h1>
      <UsageView workspaceId={current.workspaceId} />
    </div>
  )
}
