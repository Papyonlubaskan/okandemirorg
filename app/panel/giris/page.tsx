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

async function oauthSignIn(formData: FormData) {
  'use server'
  const provider = formData.get('provider')
  if (provider !== 'google' && provider !== 'github') redirect('/panel/giris?durum=hata')
  try {
    await signIn(provider, { redirectTo: safeNext(formData.get('next')) })
  } catch (e) {
    if (e instanceof AuthError) redirect('/panel/giris?durum=hata')
    throw e
  }
}

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.3 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12s4.3 9.6 9.6 9.6c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12z" />
  </svg>
)

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
    <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
  </svg>
)

export default async function GirisPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams
  const next = safeNext(sp.next)
  if (await getSessionUser()) redirect(next)
  const message = MESSAGES[sp.durum || ''] || MESSAGES[sp.error || '']
  const providers = [
    { id: 'google', label: 'Google ile devam et', icon: <GoogleIcon />, on: Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) },
    { id: 'github', label: 'GitHub ile devam et', icon: <GitHubIcon />, on: Boolean(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) },
  ].filter((p) => p.on)

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Giriş yap veya üye ol</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">İlk girişte hesabınız otomatik oluşur. Şifre gerekmez.</p>

      {message && (
        <p className="rounded-lg bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 p-3 mb-6 text-sm text-teal-900 dark:text-teal-100" role="status">
          {message}
        </p>
      )}

      {providers.length > 0 && (
        <div className="space-y-3 mb-6">
          {providers.map((p) => (
            <form key={p.id} action={oauthSignIn}>
              <input type="hidden" name="next" value={next} />
              <input type="hidden" name="provider" value={p.id} />
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {p.icon}
                {p.label}
              </button>
            </form>
          ))}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" /> veya e-posta ile <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
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
      <p className="text-xs text-gray-500">
        Devam ederek{' '}
        <a href="/terms-conditions" className="underline">
          kullanım koşullarını
        </a>{' '}
        ve{' '}
        <a href="/privacy-policy" className="underline">
          gizlilik politikasını
        </a>{' '}
        kabul etmiş olursunuz.
      </p>
    </div>
  )
}
