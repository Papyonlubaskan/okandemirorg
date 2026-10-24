import { redirect } from 'next/navigation'
import { getStore } from '@/lib/ai/store'
import { isValidClaimToken } from '@/lib/billing/claims'
import { getSessionUser } from '@/lib/auth/session'
import { ensurePersonalWorkspace } from '@/lib/auth/workspace'
import { checkDbRateLimit } from '@/lib/security/rate-limit'
import { sha256Hex } from '@/lib/security/secrets'

async function redeem(formData: FormData) {
  'use server'
  const token = formData.get('token')
  if (!isValidClaimToken(token)) redirect('/panel?claim=gecersiz')
  const user = await getSessionUser()
  if (!user) redirect(`/panel/giris?next=${encodeURIComponent(`/panel/claim?token=${token}`)}`)
  if (!(await checkDbRateLimit(`claim:user:${user.id}`, 10, 60 * 60 * 1000))) redirect('/panel?claim=limit')

  const store = getStore()
  const workspaceId = await ensurePersonalWorkspace(user.id, user.name || user.email || 'Çalışma alanım', store)
  const result = await store.redeemClaim(sha256Hex(token), workspaceId)
  await store
    .audit({
      workspaceId,
      actorType: 'user',
      actorId: user.id,
      action: 'claim.redeem',
      targetType: 'workspace_claim',
      targetId: result?.claimId ?? null,
      outcome: result ? 'ok' : 'denied',
      metadata: { credits: result?.credits ?? 0 },
    })
    .catch(() => {})
  redirect(result ? `/panel?claim=ok&kredi=${result.credits}` : '/panel?claim=gecersiz')
}

/** GET yan etkisiz: yalnızca onay butonu gösterir; kredi POST (server action) ile yüklenir */
export default async function ClaimPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams
  if (!isValidClaimToken(token)) redirect('/panel?claim=gecersiz')
  const user = await getSessionUser()
  if (!user) redirect(`/panel/giris?next=${encodeURIComponent(`/panel/claim?token=${token}`)}`)

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Kredinizi yükleyin</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Satın aldığınız paketin kredisi <strong>{user.email}</strong> hesabınızın çalışma alanına yüklenecek. Link tek kullanımlıktır.
      </p>
      <form action={redeem}>
        <input type="hidden" name="token" value={token} />
        <button type="submit" className="w-full rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold px-6 py-3">
          Krediyi hesabıma yükle
        </button>
      </form>
    </div>
  )
}
