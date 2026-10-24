import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'
import { signIn } from '@/auth'
import { getSessionUser } from '@/lib/auth/session'

const MESSAGES: Record<string, string> = {
  eposta: 'Giriş linki e-postanıza gönderildi. Gelen kutunuzu (ve spam klasörünü) kontrol edin.',
  hata: 'Giriş tamamlanamadı. Lütfen tekrar deneyin.',
  Verification: 'Linkin süresi dolmuş veya daha önce kullanılmış. Yeni link isteyin.',
  OAuthAccountNotLinked: 'Bu e-posta başka bir giriş yöntemiyle kayıtlı. E-posta linkiyle giriş yapın.',
}

/** Yalnızca panel içi göreli yollara dönüş (açık yönlendirme yok) */
function safeNext(v: unknown): string {
  const s = typeof v === 'string' ? v : ''
  return /^\/panel(\/[A-Za-z0-9/_-]*)?(\?[A-Za-z0-9=&_-]*)?$/.test(s) ? s : '/panel'
}

async function emailSignIn(formData: FormData) {
  'use server'
  const email = String(formData.get('email') || '').trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) redirect('/panel/giris?durum=hata')
  try {
    await signIn('email', { email, redirectTo: safeNext(formData.get('next')) })
  } catch (e) {
    if (e instanceof AuthError) redirect('/panel/giris?durum=hata')
    throw e
  }
}

async function googleSignIn(formData: FormData) {
  'use server'
  try {
    await signIn('google', { redirectTo: safeNext(formData.get('next')) })
  } catch (e) {
    if (e instanceof AuthError) redirect('/panel/giris?durum=hata')
    throw e
  }
}

export default async function GirisPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams
  const next = safeNext(sp.next)
  if (await getSessionUser()) redirect(next)
  const message = MESSAGES[sp.durum || ''] || MESSAGES[sp.error || '']
  const googleEnabled = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET)

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Panel girişi</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">Şifre yok: e-postanıza tek kullanımlık giriş linki gelir.</p>

      {message && (
        <p className="rounded-lg bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 p-3 mb-6 text-sm text-teal-900 dark:text-teal-100" role="status">
          {message}
        </p>
      )}

      <form action={emailSignIn} className="space-y-3 mb-6">
        <input type="hidden" name="next" value={next} />
        <label className="block">
          <span className="text-sm font-bold text-gray-700 dark:text-gray-200">E-posta</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white"
          />
        </label>
        <button type="submit" className="w-full rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold px-6 py-3">
          Giriş linki gönder
        </button>
      </form>

      {googleEnabled && (
        <form action={googleSignIn}>
          <input type="hidden" name="next" value={next} />
          <button type="submit" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold px-6 py-3">
            Google ile giriş
          </button>
        </form>
      )}
    </div>
  )
}
