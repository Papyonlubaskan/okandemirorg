'use client'

import { useState } from 'react'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await fetch('/api/abone-ol', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: data.message })
        setEmail('')
        setName('')
      } else {
        setMessage({ type: 'error', text: data.error })
      }
    } catch {
      setMessage({ type: 'error', text: 'Bir hata oluştu, lütfen tekrar deneyin' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-2xl shadow-xl p-8">
      <div className="text-center mb-6">
        <h3 className="text-3xl font-black text-white mb-3">
          📧 Newsletter&apos;a Abone Olun
        </h3>
        <p className="text-blue-100 dark:text-gray-300 font-black">
          Dijital pazarlama ipuçları, blog yazıları ve özel tekliflerden haberdar olun
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Adınız (opsiyonel)"
            className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email adresiniz *"
            required
            className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !email}
          className="w-full px-6 py-3 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-400 text-gray-900 font-black rounded-lg transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
        >
          {loading ? 'Gönderiliyor...' : 'Abone Ol'}
        </button>
      </form>

      {message.text && (
        <div
          className={`mt-4 p-4 rounded-lg text-center font-black ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <p className="text-xs text-blue-100 dark:text-gray-400 text-center mt-4">
        * Email adresinizi kimseyle paylaşmıyoruz. İstediğiniz zaman abonelikten çıkabilirsiniz.
      </p>
    </div>
  )
}

