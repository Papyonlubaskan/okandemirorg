'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Scroll event listener to show/hide CTA
    const handleScroll = () => {
      const scrollTop = window.pageYOffset
      setIsVisible(scrollTop > 300) // Show after 300px scroll
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Desktop Floating CTA */}
      <div className={`fixed top-1/2 right-4 transform -translate-y-1/2 z-50 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      } hidden lg:block`}>
        <Link
          href="https://wa.me/+905552677739"
          className="group flex items-center bg-green-600 hover:bg-green-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-110 hover:rotate-2 cta-float cta-pulse-glow cta-hover-lift"
          aria-label="WhatsApp ile randevu al"
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Image 
                src="/whatsapp-icon.png" 
                alt="WhatsApp" 
                width={32} 
                height={32} 
                className="group-hover:animate-bounce"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"></div>
            </div>
            <div className="text-left">
              <div className="text-lg font-black">Randevu Al!</div>
              <div className="text-sm opacity-90">WhatsApp</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Mobile Floating CTA */}
      <div className="fixed bottom-4 right-4 z-50 lg:hidden">
        <Link
          href="https://wa.me/+905552677739"
          className="group flex items-center bg-green-600 hover:bg-green-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-110"
          aria-label="WhatsApp ile randevu al"
        >
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Image 
                src="/whatsapp-icon.png" 
                alt="WhatsApp" 
                width={24} 
                height={24} 
                className="group-hover:animate-bounce"
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <span className="font-black text-lg">Randevu Al!</span>
          </div>
        </Link>
      </div>

      {/* Pulse Animation Background */}
      <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-40 hidden lg:block">
        <div className="w-20 h-20 bg-green-500/20 rounded-full animate-ping"></div>
      </div>
    </>
  )
}
