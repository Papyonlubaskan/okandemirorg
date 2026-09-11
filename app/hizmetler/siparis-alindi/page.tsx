import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { FUNNEL } from '@/lib/digital-products'

export const metadata: Metadata = {
  title: 'Sipariş | Okan Demir',
  robots: { index: false, follow: false },
}

/** Eski e-posta sipariş teşekkür URL’si — hunı artık doğrudan WhatsApp */
export default function SiparisAlindiPage() {
  redirect(FUNNEL.kitHref)
}
