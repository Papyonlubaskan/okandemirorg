'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function MobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg lg:hidden">
      <div className="container mx-auto px-4 py-3">
        <Link
          href="https://wa.me/+905552677739"
          className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-6 py-4 rounded-xl font-black text-xl transition-all duration-300 hover:scale-105 shadow-lg cta-pulse-glow cta-hover-lift mobile-cta-slide-up"
          aria-label="WhatsApp ile randevu al"
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Image 
                src="/whatsapp-icon.png" 
                alt="WhatsApp" 
                width={28} 
                height={28} 
                className="animate-bounce"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"></div>
            </div>
            <span>Randevu Al!</span>
            <span className="text-lg opacity-90">WhatsApp</span>
          </div>
        </Link>
      </div>
    </div>
  )
}
