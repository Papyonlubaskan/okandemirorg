'use client'

import { useState, useEffect } from 'react'
import { Locale } from '@/lib/i18n'

export default function LanguageSwitcher() {
  const [locale, setLocale] = useState<Locale>('tr')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem('locale') as Locale
    if (savedLocale && (savedLocale === 'tr' || savedLocale === 'en')) {
      setLocale(savedLocale)
      document.documentElement.lang = savedLocale
    }
  }, [])

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale)
    localStorage.setItem('locale', newLocale)
    document.documentElement.lang = newLocale
    setIsOpen(false)
    
    // Dispatch custom event for components to listen
    window.dispatchEvent(new CustomEvent('localeChange', { detail: newLocale }))
    
    // Reload page to apply new locale
    window.location.reload()
  }

  const languages = {
    tr: { name: 'Türkçe', flag: '🇹🇷' },
    en: { name: 'English', flag: '🇬🇧' },
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-full shadow-md transition-all duration-300 hover:scale-105 font-black text-gray-900"
        aria-label="Dil Seçici"
        aria-expanded={isOpen}
      >
        <span className="text-xl">{languages[locale].flag}</span>
        <span className="hidden sm:inline">{languages[locale].name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl z-50 overflow-hidden animate-slide-up">
            {Object.entries(languages).map(([key, lang]) => (
              <button
                key={key}
                onClick={() => handleLocaleChange(key as Locale)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors font-black ${
                  locale === key ? 'bg-blue-100 text-blue-600' : 'text-gray-900'
                }`}
                aria-label={`${lang.name} diline geç`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <span>{lang.name}</span>
                {locale === key && (
                  <svg className="w-5 h-5 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}

