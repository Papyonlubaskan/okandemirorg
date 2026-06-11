'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function WhatsAppChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [showBubble, setShowBubble] = useState(false)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [isRateLimited, setIsRateLimited] = useState(false)

  const phoneNumber = '+905552677739'
  const cleanPhone = '905552677739' // + ve boşluk olmadan
  const RATE_LIMIT_MS = 5000 // 5 saniye rate limit

  useEffect(() => {
    // Show chat bubble after 3 seconds
    const timer = setTimeout(() => setShowBubble(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  const services = [
    '🎨 Web Tasarım',
    '📱 Dijital Pazarlama',
    '🔍 SEO Optimizasyonu',
    '🏢 Kurumsal Kimlik',
    '💼 Dijital Dönüşüm',
    '✨ WordPress Tasarım',
  ]

  const predefinedMessages = [
    'Merhaba! Web sitesi tasarımı hakkında bilgi almak istiyorum.',
    'Dijital pazarlama hizmetleriniz hakkında detay alabilir miyim?',
    'SEO çalışması için teklif istiyorum.',
    'Marka kimliği oluşturma konusunda görüşmek istiyorum.',
  ]

  const handleSend = () => {
    if (!message && !selectedService) return
    
    // Rate limiting kontrolü
    const now = Date.now()
    if (now - lastClickTime < RATE_LIMIT_MS) {
      setIsRateLimited(true)
      setTimeout(() => setIsRateLimited(false), 3000)
      return
    }
    
    let finalMessage = message

    if (selectedService) {
      finalMessage = `${selectedService} hakkında bilgi almak istiyorum. ${message}`
    }

    // Tarayıcı uyumlu WhatsApp çözümü
    try {
      // Rate limit timestamp güncelle
      setLastClickTime(now)
      
      // Desktop için api.whatsapp.com kullan (çalışıyor!)
      const whatsappUrl = `https://api.whatsapp.com/send/?phone=${cleanPhone}&text=${encodeURIComponent(finalMessage)}&type=phone_number&app_absent=0`
      
      // Link açmayı dene
      const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
      
      // Eğer açılmazsa, telefon numarasını kopyala
      setTimeout(() => {
        try {
          if (!newWindow || newWindow.closed) {
            // Telefon numarasını kopyala
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(phoneNumber).then(() => {
                alert(`Telefon numarası kopyalandı: ${phoneNumber}\nWhatsApp'ta bu numarayı arayabilirsiniz.`)
              }).catch(() => {
                alert(`Telefon numarası: ${phoneNumber}\nBu numarayı WhatsApp'ta arayabilirsiniz.`)
              })
            } else {
              alert(`Telefon numarası: ${phoneNumber}\nBu numarayı WhatsApp'ta arayabilirsiniz.`)
            }
          }
        } catch {
          alert(`Telefon numarası: ${phoneNumber}\nBu numarayı WhatsApp'ta arayabilirsiniz.`)
        }
      }, 2000)
      
      setIsOpen(false)
      setMessage('')
      setSelectedService('')
    } catch {
      // Error handled silently - WhatsApp link failed
    }
  }

  const handleQuickMessage = (msg: string) => {
    // Rate limiting kontrolü
    const now = Date.now()
    if (now - lastClickTime < RATE_LIMIT_MS) {
      setIsRateLimited(true)
      setTimeout(() => setIsRateLimited(false), 3000)
      return
    }
    
    try {
      // Rate limit timestamp güncelle
      setLastClickTime(now)
      
      // Desktop için api.whatsapp.com kullan (çalışıyor!)
      const whatsappUrl = `https://api.whatsapp.com/send/?phone=${cleanPhone}&text=${encodeURIComponent(msg)}&type=phone_number&app_absent=0`
      
      // Link açmayı dene
      const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
      
      // Eğer açılmazsa, telefon numarasını kopyala
      setTimeout(() => {
        try {
          if (!newWindow || newWindow.closed) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(phoneNumber).then(() => {
                alert(`Telefon numarası kopyalandı: ${phoneNumber}\nWhatsApp'ta bu numarayı arayabilirsiniz.`)
              }).catch(() => {
                alert(`Telefon numarası: ${phoneNumber}\nBu numarayı WhatsApp'ta arayabilirsiniz.`)
              })
            } else {
              alert(`Telefon numarası: ${phoneNumber}\nBu numarayı WhatsApp'ta arayabilirsiniz.`)
            }
          }
        } catch {
          alert(`Telefon numarası: ${phoneNumber}\nBu numarayı WhatsApp'ta arayabilirsiniz.`)
        }
      }, 2000)
      
      setIsOpen(false)
    } catch {
      // Error handled silently - WhatsApp link failed
    }
  }

  return (
    <>
      {/* Chat Bubble (Initial Prompt) */}
      {showBubble && !isOpen && (
        <div className="fixed bottom-24 right-6 z-40 animate-bounce">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 max-w-xs relative">
            <button
              onClick={() => setShowBubble(false)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 text-white rounded-full text-xs font-bold"
            >
              ✕
            </button>
            <div className="flex items-start gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-green-500 bg-gray-200 dark:bg-gray-600">
                <Image 
                  src="/okan-demir-profile.webp" 
                  alt="Okan Demir" 
                  fill
                  sizes="40px"
                  priority
                  unoptimized
                  className="object-cover"
                  onError={(e) => {
                    // Image load error - fallback to default
                    (e.target as HTMLImageElement).src = '/okan-demir-profile.jpg';
                  }}
                />
              </div>
              <div>
                <div className="font-black text-gray-900 dark:text-white mb-1">Okan Demir</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  Merhaba! 👋 Size nasıl yardımcı olabilirim?
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-white dark:ring-gray-600 bg-gray-200 dark:bg-gray-600">
                  <Image 
                    src="/okan-demir-profile.webp" 
                    alt="Okan Demir" 
                    fill
                    sizes="48px"
                    priority
                    unoptimized
                    className="object-cover"
                    onError={(e) => {
                      // Image load error - fallback to default
                      (e.target as HTMLImageElement).src = '/okan-demir-profile.jpg';
                    }}
                  />
                </div>
                <div>
                  <div className="font-black">Okan Demir</div>
                  <div className="text-xs opacity-90 font-medium">Genellikle 1 saat içinde yanıt verir</div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="p-4 h-96 overflow-y-auto bg-[#E5DDD5] dark:bg-gray-700">
            {/* Welcome Message */}
            <div className="mb-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg rounded-tl-none p-3 shadow max-w-[80%]">
                <div className="font-medium text-gray-800 dark:text-white mb-2">
                  Merhaba! 👋 Ben Okan Demir.
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  Size nasıl yardımcı olabilirim? Aşağıdan bir hizmet seçebilir veya doğrudan mesaj yazabilirsiniz.
                </div>
              </div>
            </div>

            {/* Service Selection */}
            <div className="mb-4">
              <div className="text-xs font-bold text-gray-600 dark:text-gray-300 mb-2">Hızlı Seçim:</div>
              <div className="grid grid-cols-2 gap-2">
                {services.map((service, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedService(service)}
                    className={`p-2 rounded-lg text-sm font-bold transition-all ${
                      selectedService === service
                        ? 'bg-green-500 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Messages */}
            <div className="mb-4">
              <div className="text-xs font-bold text-gray-600 dark:text-gray-300 mb-2">Hızlı Mesajlar:</div>
              <div className="space-y-2">
                {predefinedMessages.map((msg, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickMessage(msg)}
                    className="w-full text-left bg-white dark:bg-gray-800 rounded-lg p-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white dark:bg-gray-800">
            {isRateLimited && (
              <div className="mb-3 p-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm font-medium text-center">
                ⏳ Lütfen 5 saniye bekleyin
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Mesajınızı yazın..."
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-full focus:ring-2 focus:ring-green-500 dark:focus:ring-gray-500 focus:border-transparent font-medium"
              />
              <button
                onClick={handleSend}
                disabled={!message && !selectedService || isRateLimited}
                className="bg-green-500 text-white px-6 py-3 rounded-full font-black hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-50 group"
        aria-label="WhatsApp ile iletişim"
      >
        <Image
          src="/whatsapp-icon.png"
          alt="WhatsApp"
          width={36}
          height={36}
          className="group-hover:scale-110 transition-transform"
        />
        {/* Notification Badge */}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">1</span>
        </div>
      </button>
    </>
  )
}

