import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isOrchestratorEnabled } from '@/lib/ai/feature'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Panel | Okan Demir',
  robots: { index: false, follow: false },
}

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!isOrchestratorEnabled()) notFound()
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <nav className="flex flex-wrap gap-4 text-sm font-bold text-teal-800 dark:text-teal-300 mb-8">
          <Link href="/panel">Görevler</Link>
          <Link href="/panel/kullanim">Kullanım</Link>
        </nav>
        {children}
      </div>
    </div>
  )
}
