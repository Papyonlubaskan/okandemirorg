'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'

const NAV = [
  { href: '/#ozellikler', label: 'Özellikler', title: 'Okan Demir AI özellikleri' },
  { href: '/#fiyatlar', label: 'Fiyatlar', title: 'Okan Demir AI fiyatları' },
  { href: '/ajans', label: 'Ajans Hizmetleri', title: 'Okan Demir dijital pazarlama ajans hizmetleri' },
  { href: '/blog', label: 'Blog', title: 'Okan Demir Blog' },
  { href: '/hakkimda', label: 'Okan Demir Kimdir?', title: 'Okan Demir Kimdir?' },
  { href: '/iletisim', label: 'İletişim', title: 'Okan Demir İletişim' },
]

const linkCls =
  'whitespace-nowrap text-gray-800 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-300 font-bold text-[15px] transition-colors py-2 px-2.5 rounded-lg hover:bg-teal-50 dark:hover:bg-gray-800'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-3 h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 shrink-0" title="Okan Demir AI Ana Sayfa">
            <Image
              src="/okan-demir-logo.png"
              alt="Okan Demir - Yapay zekâ ile web sitesi ve dijital pazarlama"
              width={750}
              height={750}
              className="h-12 md:h-14 w-auto"
              priority
              sizes="(max-width: 768px) 48px, 56px"
            />
            <span className="hidden sm:inline font-black text-gray-900 dark:text-white">
              Okan Demir <span className="text-teal-600">AI</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1" role="navigation" aria-label="Ana navigasyon">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className={linkCls} title={n.title}>
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <ThemeToggle />
            <Link href="/panel/giris" className="font-bold text-gray-800 dark:text-gray-200 hover:text-teal-600 px-3 py-2">
              Giriş
            </Link>
            <Link href="/panel/baslangic" className="inline-flex items-center bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl font-black transition-colors">
              Sitemi oluştur
            </Link>
          </div>

          <button
            className="lg:hidden p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menüyü aç/kapat"
            aria-expanded={isMenuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <nav className="flex flex-col space-y-1" aria-label="Mobil navigasyon">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className={`${linkCls} text-lg py-3 px-4`} onClick={() => setIsMenuOpen(false)}>
                  {n.label}
                </Link>
              ))}
              <div className="flex items-center gap-3 pt-3 px-4">
                <ThemeToggle />
                <Link href="/panel/giris" className="font-bold text-gray-800 dark:text-gray-200" onClick={() => setIsMenuOpen(false)}>
                  Giriş
                </Link>
                <Link href="/panel/baslangic" className="ml-auto bg-teal-600 text-white px-4 py-3 rounded-xl font-black" onClick={() => setIsMenuOpen(false)}>
                  Sitemi oluştur
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
