import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'İletişim | Okan Demir',
  description:
    'Okan Demir ile iletişime geçin. WhatsApp, e-posta veya iletişim formu ile dijital pazarlama ve web tasarım taleplerinizi iletin.',
  alternates: { canonical: 'https://okandemir.org/iletisim' },
}

export default function IletisimLayout({ children }: { children: React.ReactNode }) {
  return children
}
