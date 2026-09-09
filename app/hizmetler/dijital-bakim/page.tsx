import type { Metadata } from 'next'
import DijitalBakimClient from './DijitalBakimClient'

export const metadata: Metadata = {
  title: 'Dijital Bakım | Okan Demir',
  description:
    'Aylık dijital bakım paketleri: SEO ve Google İşletme kontrolü, rapor, görüşme. Light 4.900₺ · Standart 7.900₺.',
  alternates: { canonical: 'https://okandemir.org/hizmetler/dijital-bakim' },
}

export default function DijitalBakimPage() {
  return <DijitalBakimClient />
}
