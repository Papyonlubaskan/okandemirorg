import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import type { EmailConfig } from 'next-auth/providers/email'
import { escapeHtml } from '@/lib/api-security'
import { MySqlAdapter } from '@/lib/auth/mysql-adapter'
import { ensurePersonalWorkspace } from '@/lib/auth/workspace'
import { createMailTransporter, MAIL_FROM } from '@/lib/mailer'
import { checkDbRateLimit } from '@/lib/security/rate-limit'

/** Mevcut nodemailer ile şifresiz giriş linki (ek servis yok) */
const emailProvider: EmailConfig = {
  id: 'email',
  type: 'email',
  name: 'E-posta',
  from: MAIL_FROM,
  maxAge: 15 * 60,
  normalizeIdentifier: (identifier) => identifier.trim().toLowerCase(),
  async sendVerificationRequest({ identifier, url }) {
    // Aynı adrese saatte en fazla 5 link
    if (!(await checkDbRateLimit(`auth-email:${identifier}`, 5, 60 * 60 * 1000))) {
      throw new Error('Çok fazla giriş isteği')
    }
    await createMailTransporter().sendMail({
      from: MAIL_FROM,
      to: identifier,
      subject: 'okandemir.org panel giriş linkiniz',
      text: `Giriş için bu linke tıklayın (15 dk geçerli):\n${url}\n\nBu isteği siz yapmadıysanız yok sayın.`,
      html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto">
        <h2>Panel girişi</h2>
        <p>Giriş için aşağıdaki butona tıklayın. Link 15 dakika geçerlidir.</p>
        <p><a href="${escapeHtml(url)}" style="display:inline-block;background:#0d9488;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none">Giriş yap</a></p>
        <p style="color:#64748b;font-size:12px">Bu isteği siz yapmadıysanız bu e-postayı yok sayın.</p>
      </div>`,
    })
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(() => ({
  adapter: MySqlAdapter(),
  session: { strategy: 'database', maxAge: 30 * 24 * 60 * 60, updateAge: 24 * 60 * 60 },
  trustHost: true,
  providers: [
    emailProvider,
    // Google ve GitHub yalnızca doğrulanmış e-posta döndürür: aynı e-postayla hesap birleştirme güvenli
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [Google({ allowDangerousEmailAccountLinking: true })]
      : []),
    ...(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET
      ? [GitHub({ allowDangerousEmailAccountLinking: true })]
      : []),
  ],
  pages: {
    signIn: '/panel/giris',
    verifyRequest: '/panel/giris?durum=eposta',
    error: '/panel/giris',
  },
  callbacks: {
    session({ session, user }) {
      if (session.user && user) session.user.id = user.id
      return session
    },
  },
  events: {
    async signIn({ user }) {
      if (user?.id) await ensurePersonalWorkspace(user.id, user.name || user.email || 'Çalışma alanım')
    },
  },
}))
