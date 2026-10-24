import Link from 'next/link'
import { redirect } from 'next/navigation'
import { signOut } from '@/auth'
import { getStore } from '@/lib/ai/store'
import { getSessionUser } from '@/lib/auth/session'
import { ensurePersonalWorkspace } from '@/lib/auth/workspace'
import { isPlanActive, PLAN_LABELS, PLAN_SITE_LIMITS } from '@/lib/billing/plans'

async function logout() {
  'use server'
  await signOut({ redirectTo: '/panel/giris' })
}

const CLAIM_MESSAGES: Record<string, string> = {
  ok: 'Kredi hesabınıza yüklendi.',
  gecersiz: 'Link geçersiz, süresi dolmuş veya daha önce kullanılmış.',
  limit: 'Çok fazla deneme. Bir süre sonra tekrar deneyin.',
}

const STATUS: Record<string, { text: string; cls: string }> = {
  draft: { text: 'Taslak', cls: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100' },
  published: { text: 'Yayında', cls: 'bg-teal-100 text-teal-900 dark:bg-teal-900/50 dark:text-teal-100' },
  suspended: { text: 'Askıda', cls: 'bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-100' },
}

export default async function PanelHome({ searchParams }: { searchParams: Promise<{ ws?: string; claim?: string }> }) {
  const user = await getSessionUser()
  if (!user) redirect('/panel/giris')

  const store = getStore()
  await ensurePersonalWorkspace(user.id, user.name || user.email || 'Çalışma alanım', store)
  const memberships = await store.listMemberships(user.id)
  const { ws, claim } = await searchParams
  const current = memberships.find((m) => m.workspaceId === ws) ?? memberships[0]

  const [workspace, credits, sites] = await Promise.all([
    store.getWorkspace(current.workspaceId),
    store.getCreditBalance(current.workspaceId).catch(() => 0),
    store.listSites(current.workspaceId).catch(() => []),
  ])
  const planActive = workspace ? isPlanActive(workspace) : false
  const published = sites.filter((s) => s.status === 'published').length

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Merhaba{user.name ? `, ${user.name.split(' ')[0]}` : ''}</h1>
          <p className="text-sm text-gray-500">
            {user.email} · {current.name}
          </p>
        </div>
        <form action={logout}>
          <button type="submit" className="text-sm font-bold text-gray-600 dark:text-gray-300 underline">
            Çıkış
          </button>
        </form>
      </div>

      {claim && CLAIM_MESSAGES[claim] && (
        <p className="rounded-lg bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 p-3 text-sm text-teal-900 dark:text-teal-100" role="status">
          {CLAIM_MESSAGES[claim]}
        </p>
      )}

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5">
          <p className="text-xs text-gray-500">Kredi</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{credits}</p>
          <Link href="/panel/kredi" className="text-sm font-bold text-teal-700 dark:text-teal-300 underline">
            Kredi satın al
          </Link>
        </div>
        <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5">
          <p className="text-xs text-gray-500">Plan</p>
          <p className="text-2xl font-black text-gray-900 dark:text-white">{planActive ? PLAN_LABELS[workspace!.plan] : 'Plan yok'}</p>
          <p className="text-xs text-gray-500">
            {planActive && workspace?.planExpiresAt ? `Bitiş: ${workspace.planExpiresAt.toLocaleDateString('tr-TR')}` : 'Yayın için plan gerekir'}
          </p>
        </div>
        <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5">
          <p className="text-xs text-gray-500">Yayındaki siteler</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white">
            {published}
            <span className="text-base text-gray-500"> / {planActive ? PLAN_SITE_LIMITS[workspace!.plan] : 0}</span>
          </p>
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-gray-900 dark:text-white">Siteleriniz</h2>
          <Link href="/panel/baslangic" className="rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold px-4 py-2 text-sm">
            + Yeni site oluştur
          </Link>
        </div>
        {sites.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
            <p className="text-gray-700 dark:text-gray-200 font-medium mb-3">İşletmenizi anlatın, yapay zekâ sitenizi dakikalar içinde hazırlasın.</p>
            <Link href="/panel/baslangic" className="inline-block rounded-lg bg-teal-700 text-white font-bold px-5 py-3">
              İlk sitemi oluştur
            </Link>
          </div>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-4">
            {sites.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/panel/siteler/${s.id}?ws=${encodeURIComponent(current.workspaceId)}`}
                  className="block rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 hover:border-teal-500"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-gray-900 dark:text-white">{s.name}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS[s.status]?.cls}`}>{STATUS[s.status]?.text}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    /s/{s.slug} · sürüm {s.currentVersion}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
