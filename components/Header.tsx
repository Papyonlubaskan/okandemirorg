'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-28 md:h-32 lg:h-36 xl:h-40">
              {/* Logo */}
              <Link href="/" className="flex items-center" title="Okan Demir - Dijital Pazarlama Uzmanı Ana Sayfa">
                <Image
                  src="/okan-demir-logo.png"
                  alt="Okan Demir - Türkiye'nin En İyi Dijital Pazarlama Uzmanı"
                  width={750}
                  height={750}
                  className="h-24 md:h-28 lg:h-32 xl:h-36 2xl:h-40 w-auto"
                  priority
                  sizes="(max-width: 768px) 192px, (max-width: 1024px) 224px, (max-width: 1280px) 256px, 320px"
                />
              </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8" role="navigation" aria-label="Ana navigasyon">
            <Link href="/" prefetch={true} className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-black text-xl xl:text-2xl transition-colors py-3 px-4 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800" title="Okan Demir Ana Sayfa">
              Anasayfa
            </Link>
            <Link href="/projeler" prefetch={true} className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-black text-xl xl:text-2xl transition-colors py-3 px-4 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800" title="Okan Demir Projeler">
              Projeler
            </Link>
            <Link href="/hizmetler" prefetch={true} className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-black text-xl xl:text-2xl transition-colors py-3 px-4 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800" title="Okan Demir Hizmetler">
              Hizmetler
            </Link>
            <Link href="/hakkimda" prefetch={true} className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-black text-xl xl:text-2xl transition-colors py-3 px-4 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800" title="Okan Demir Kimdir">
              Okan Demir Kimdir?
            </Link>
            <Link href="/iletisim" prefetch={true} className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-black text-xl xl:text-2xl transition-colors py-3 px-4 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800" title="Okan Demir İletişim">
              İletişim
            </Link>
          </nav>

          {/* CTA Button & Theme Toggle */}
          <div className="hidden lg:flex items-center space-x-4">
            <ThemeToggle />
            <Link
              href="https://wa.me/+905552677739"
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 xl:px-6 py-2 xl:py-3 rounded-full font-black transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Image src="/whatsapp-icon.png" alt="WhatsApp" width={20} height={20} className="mr-2" />
              <span className="hidden xl:inline">WhatsApp</span>
              <span className="xl:hidden">WA</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menüyü aç/kapat"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="lg:hidden py-4 border-t bg-white dark:bg-gray-900 shadow-lg">
                <nav className="flex flex-col space-y-2">
                  <Link
                    href="/"
                    className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-black text-lg transition-colors py-3 px-4 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 touch-manipulation"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Anasayfa
                  </Link>
                  <Link
                    href="/projeler"
                    className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-black text-lg transition-colors py-3 px-4 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 touch-manipulation"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Projeler
                  </Link>
                  <Link
                    href="/hizmetler"
                    className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-black text-lg transition-colors py-3 px-4 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 touch-manipulation"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Hizmetler
                  </Link>
                  <Link
                    href="/hakkimda"
                    className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-black text-lg transition-colors py-3 px-4 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 touch-manipulation"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Okan Demir Kimdir?
                  </Link>
                  <Link
                    href="/iletisim"
                    className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-black text-lg transition-colors py-3 px-4 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 touch-manipulation"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    İletişim
                  </Link>
                  
                  <div className="flex items-center justify-center mt-4 space-x-4">
                    <ThemeToggle />
                    <Link
                      href="https://wa.me/+905552677739"
                      className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-full font-black text-xl transition-all duration-300 hover:scale-105 hover:shadow-lg touch-manipulation"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Image src="/whatsapp-icon.png" alt="WhatsApp" width={20} height={20} className="mr-2" />
                      WhatsApp
                    </Link>
                  </div>
                </nav>
              </div>
            )}
      </div>
    </header>
  )
}


