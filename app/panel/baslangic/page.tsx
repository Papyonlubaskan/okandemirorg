import { redirect } from 'next/navigation'
import OnboardingWizard from '@/components/panel/OnboardingWizard'
import { getStore } from '@/lib/ai/store'
import { CREDIT_COSTS } from '@/lib/billing/plans'
import { getSessionUser } from '@/lib/auth/session'
import { ensurePersonalWorkspace } from '@/lib/auth/workspace'

export default async function BaslangicPage({ searchParams }: { searchParams: Promise<{ ws?: string }> }) {
  const user = await getSessionUser()
  if (!user) redirect('/panel/giris?next=/panel/baslangic')
  const store = getStore()
  await ensurePersonalWorkspace(user.id, user.name || user.email || 'Çalışma alanım', store)
  const { ws } = await searchParams
  const memberships = await store.listMemberships(user.id)
  const current = memberships.find((m) => m.workspaceId === ws) ?? memberships[0]
  const credits = await store.getCreditBalance(current.workspaceId).catch(() => 0)

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Sitenizi oluşturalım</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">Birkaç bilgi verin; yapay zekâ çok sayfalı, mobil uyumlu sitenizi hazırlasın. Sonra sohbetle veya elle düzenleyebilirsiniz.</p>
      <OnboardingWizard workspaceId={current.workspaceId} credits={credits} cost={CREDIT_COSTS['site.generate']} />
    </div>
  )
}
