import { redirect } from 'next/navigation'
import SiteEditor from '@/components/panel/SiteEditor'
import { getStore } from '@/lib/ai/store'
import { CREDIT_COSTS } from '@/lib/billing/plans'
import { getSessionUser } from '@/lib/auth/session'

export default async function SitePage({ params, searchParams }: { params: Promise<{ siteId: string }>; searchParams: Promise<{ ws?: string }> }) {
  const user = await getSessionUser()
  if (!user) redirect('/panel/giris')
  const [{ siteId }, { ws }] = await Promise.all([params, searchParams])
  const memberships = await getStore().listMemberships(user.id)
  const current = memberships.find((m) => m.workspaceId === ws) ?? memberships[0]
  if (!current) redirect('/panel')
  return <SiteEditor siteId={siteId} workspaceId={current.workspaceId} editCost={CREDIT_COSTS['site.edit']} />
}
