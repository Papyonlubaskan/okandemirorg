import { redirect } from 'next/navigation'
import BillingView from '@/components/panel/BillingView'
import { getStore } from '@/lib/ai/store'
import { BILLING_SKUS } from '@/lib/billing/catalog'
import { CREDIT_COSTS, isPlanActive, PLAN_LABELS } from '@/lib/billing/plans'
import { getSessionUser } from '@/lib/auth/session'
import { ensurePersonalWorkspace } from '@/lib/auth/workspace'
import { formatTry } from '@/lib/digital-products'

const COST_LABELS: Record<string, string> = {
  'site.generate': 'Yeni site oluşturma',
  'site.edit': 'AI ile site düzenleme',
  'seo.audit': 'AI SEO denetimi',
  auto: 'Serbest AI isteği',
}

export default async function KrediPage({ searchParams }: { searchParams: Promise<{ ws?: string }> }) {
  const user = await getSessionUser()
  if (!user) redirect('/panel/giris?next=/panel/kredi')
  const store = getStore()
  await ensurePersonalWorkspace(user.id, user.name || user.email || 'Çalışma alanım', store)
  const { ws } = await searchParams
  const memberships = await store.listMemberships(user.id)
  const current = memberships.find((m) => m.workspaceId === ws) ?? memberships[0]
  const [workspace, credits] = await Promise.all([store.getWorkspace(current.workspaceId), store.getCreditBalance(current.workspaceId).catch(() => 0)])
  const active = workspace ? isPlanActive(workspace) : false

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-1">Kredi & Plan</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Bakiye: <strong>{credits} kredi</strong> · Plan: <strong>{active ? PLAN_LABELS[workspace!.plan] : 'yok'}</strong>
          {active && workspace?.planExpiresAt ? ` (bitiş ${workspace.planExpiresAt.toLocaleDateString('tr-TR')})` : ''}
        </p>
      </div>
      <BillingView
        workspaceId={current.workspaceId}
        canBuy={current.role !== 'member'}
        skus={BILLING_SKUS.map((s) => ({ sku: s.sku, name: s.name, priceLabel: formatTry(s.priceTry), kind: s.kind, credits: s.credits, description: s.description, features: s.features, highlighted: s.highlighted }))}
      />
      <section className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5">
        <h2 className="font-black text-gray-900 dark:text-white mb-2">Kredi kullanımı</h2>
        <ul className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
          {Object.entries(CREDIT_COSTS)
            .filter(([k]) => COST_LABELS[k])
            .map(([k, v]) => (
              <li key={k}>
                {COST_LABELS[k]}: <strong>{v} kredi</strong>
              </li>
            ))}
          <li>Elle düzenleme ve kaydetme: kredisiz</li>
          <li>Yayınlama: plan kapsamında</li>
        </ul>
        <p className="text-xs text-gray-500 mt-3">Fiyatlara KDV dahil değildir. Başarısız işlemlerin kredisi otomatik iade edilir.</p>
      </section>
    </div>
  )
}
