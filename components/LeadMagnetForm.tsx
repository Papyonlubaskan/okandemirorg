'use client'

import { useState } from 'react'

type Props = {
  source?: string
}

export default function LeadMagnetForm({ source = 'ucretsiz-seo-rehberi' }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, source }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.error || 'Kayıt başarısız')
        return
      }
      window.location.href = `/hizmetler/ucretsiz-seo-rehberi/tesekkur?token=${encodeURIComponent(data.token)}`
    } catch {
      setError('Bağlantı hatası. Tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-black text-gray-900 dark:text-white">Ücretsiz rehberi al</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">E-posta ile anında indirme linki. Spam yok.</p>
      <div>
        <label className="block text-sm font-black mb-1 text-gray-700 dark:text-gray-200">Ad</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3"
        />
      </div>
      <div>
        <label className="block text-sm font-black mb-1 text-gray-700 dark:text-gray-200">E-posta</label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3"
        />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-black py-4 rounded-full"
      >
        {loading ? 'Gönderiliyor…' : 'Rehberi ücretsiz gönder'}
      </button>
    </form>
  )
}
