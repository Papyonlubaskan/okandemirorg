'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'okd_site_prompt'
const AB_VARIANT_KEY = 'okd_home_ab_variant'

const CHIPS = [
  'İzmir’de kuaför salonum için randevu alan bir site',
  'Kafem için menü ve rezervasyon sayfası',
  'Diş kliniğim için güven veren kurumsal site',
  'Butik mağazam için WhatsApp’tan sipariş alan site',
  'Tadilat firmam için teklif toplayan site',
]

const AB_COPY = {
  a: {
    helper: 'Kayıt ol → sitenin taslağı dakikalar içinde hazır',
    cta: 'Sitemi oluştur →',
    placeholder: 'İşletmeni anlat: ne yapıyorsun, nerede, kimlere? Gerisini yapay zekâ halletsin…',
  },
  b: {
    helper: 'Otuz saniyede anlat, ilk taslağı hemen aç',
    cta: 'Taslağı başlat →',
    placeholder: 'Sektörünü ve hedef müşterini yaz; çok sayfalı site taslağın hazır gelsin…',
  },
} as const

type Variant = keyof typeof AB_COPY

export default function HeroPrompt() {
  const [text, setText] = useState('')
  const [variant, setVariant] = useState<Variant>('a')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AB_VARIANT_KEY)
      if (saved === 'a' || saved === 'b') {
        setVariant(saved)
        return
      }
      const picked: Variant = Math.random() < 0.5 ? 'a' : 'b'
      localStorage.setItem(AB_VARIANT_KEY, picked)
      setVariant(picked)
    } catch {
      // localStorage kapalı olabilir
    }
  }, [])

  function start(e?: React.FormEvent) {
    e?.preventDefault()
    try {
      if (text.trim()) localStorage.setItem(STORAGE_KEY, text.trim().slice(0, 600))
    } catch {
      // localStorage kapalı olabilir
    }
    window.location.href = `/panel/baslangic?ab=${variant}`
  }

  return (
    <form onSubmit={start} className="w-full max-w-3xl mx-auto">
      <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-3 shadow-2xl focus-within:border-teal-300">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) start(e)
          }}
          rows={3}
          maxLength={600}
          placeholder={AB_COPY[variant].placeholder}
          aria-label="İşletmenizi anlatın"
          className="w-full resize-none bg-transparent text-white placeholder:text-slate-300 text-lg outline-none px-3 py-2"
        />
        <div className="flex items-center justify-between gap-3 px-2 pb-1">
          <span className="text-xs text-slate-300">{AB_COPY[variant].helper}</span>
          <button type="submit" className="rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-900 font-black px-5 py-2.5">
            {AB_COPY[variant].cta}
          </button>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {CHIPS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setText(c)}
            className="rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-slate-200 text-sm px-3 py-1.5"
          >
            {c}
          </button>
        ))}
      </div>
    </form>
  )
}
