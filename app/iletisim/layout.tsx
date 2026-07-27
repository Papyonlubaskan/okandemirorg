import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'İletişim | Okan Demir',
  description:
    'Okan Demir ile iletişime geçin. WhatsApp, e-posta veya iletişim formu ile dijital pazarlama ve web tasarım taleplerinizi iletin.',
  alternates: { canonical: 'https://okandemir.org/iletisim' },
  openGraph: {
    title: 'İletişim | Okan Demir',
    description:
      'WhatsApp, e-posta veya iletişim formu ile dijital pazarlama ve web tasarım taleplerinizi iletin.',
    url: 'https://okandemir.org/iletisim',
    type: 'website',
    images: [
      {
        url: 'https://okandemir.org/okan-demir-profile.jpg',
        width: 1200,
        height: 630,
        alt: 'Okan Demir İletişim',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'İletişim | Okan Demir',
    description: 'Dijital pazarlama ve web tasarım talepleriniz için iletişime geçin.',
  },
}

export default function IletisimLayout({ children }: { children: React.ReactNode }) {
  return children
}
