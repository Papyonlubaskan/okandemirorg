export type SessionUser = { id: string; email: string | null; name: string | null }

/** Kimlik yalnızca sunucu oturumundan türetilir; istemciden gelen userId kabul edilmez */
export async function getSessionUser(): Promise<SessionUser | null> {
  const { auth } = await import('@/auth')
  const session = await auth()
  const id = session?.user?.id
  if (!id) return null
  return { id, email: session.user.email ?? null, name: session.user.name ?? null }
}
