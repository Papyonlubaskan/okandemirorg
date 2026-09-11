import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { FUNNEL } from '@/lib/digital-products'

export const metadata: Metadata = {
  title: 'Rehber | Okan Demir',
  robots: { index: false, follow: false },
}

/** Eski e-posta lead teşekkür — artık WhatsApp */
export default function LeadTesekkurRedirect() {
  redirect(FUNNEL.leadHref)
}
