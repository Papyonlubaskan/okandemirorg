'use client'

import { useState } from 'react'
import { isValidEmail } from '@/lib/formValidation'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    // Validate email
    if (!isValidEmail(email)) {
      setErrorMessage('Geçerli bir e-posta adresi giriniz')
      return
    }

    setStatus('loading')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setStatus('success')
        setEmail('')
        setTimeout(() => setStatus('idle'), 5000)
      } else {
        const data = await response.json()
        setErrorMessage(data.error || 'Bir hata oluştu')
        setStatus('error')
      }
    } catch {
      setErrorMessage('Bağlantı hatası. Lütfen tekrar deneyin.')
      setStatus('error')
    }
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 lg:p-12 text-white shadow-2xl">
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-5xl mb-4">📬</div>
        <h2 className="text-3xl lg:text-4xl font-black mb-4">
          Dijital Pazarlama İpuçlarını Kaçırmayın!
        </h2>
        <p className="text-lg mb-8 opacity-90 font-medium">
          Haftalık bültenimize abone olun ve en son trendler, stratejiler ve özel tekliflerden haberdar olun.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta adresiniz"
              className="flex-1 px-6 py-4 rounded-xl text-gray-900 dark:text-white dark:bg-gray-700 font-medium focus:ring-4 focus:ring-white/30 dark:focus:ring-gray-500 outline-none"
              disabled={status === 'loading'}
              aria-label="E-posta adresi"
              aria-required="true"
              aria-invalid={!!errorMessage}
            />
            <button
              type="submit"
              disabled={status === 'loading' || !email}
              className="px-8 py-4 bg-white dark:bg-gray-700 text-blue-600 dark:text-white rounded-xl font-black hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              aria-label="Bültene abone ol"
            >
              {status === 'loading' ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Gönderiliyor...
                </span>
              ) : (
                'Abone Ol 🚀'
              )}
            </button>
          </div>

          {/* Status Messages */}
          {status === 'success' && (
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-lg" role="alert">
              <p className="font-black">
                ✅ Başarılı! Aboneliğiniz onaylandı. Hoş geldiniz!
              </p>
            </div>
          )}

          {status === 'error' && errorMessage && (
            <div className="p-4 bg-red-500/20 backdrop-blur-sm rounded-lg" role="alert">
              <p className="font-black">❌ {errorMessage}</p>
            </div>
          )}

          {status === 'idle' && (
            <p className="text-sm opacity-75 font-medium">
              📩 Haftalık en fazla 1 e-posta gönderilir. İstediğiniz zaman abonelikten çıkabilirsiniz.
            </p>
          )}
        </form>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-white/20">
          <div>
            <div className="text-3xl font-black mb-1">5K+</div>
            <div className="text-sm opacity-75 font-medium">Abone</div>
          </div>
          <div>
            <div className="text-3xl font-black mb-1">%92</div>
            <div className="text-sm opacity-75 font-medium">Açılma Oranı</div>
          </div>
          <div>
            <div className="text-3xl font-black mb-1">4.9⭐</div>
            <div className="text-sm opacity-75 font-medium">Memnuniyet</div>
          </div>
        </div>
      </div>
    </div>
  )
}

