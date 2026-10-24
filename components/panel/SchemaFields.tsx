'use client'

/** Site şeması için genel, özyinelemeli alan düzenleyici (metin, sayı, evet/hayır, liste) */

const LABELS: Record<string, string> = {
  title: 'Başlık',
  subtitle: 'Alt başlık',
  text: 'Metin',
  ctaText: 'Buton yazısı',
  ctaTarget: 'Buton hedefi',
  ctaUrl: 'Buton linki (https)',
  image: 'Görsel URL (https)',
  items: 'Öğeler',
  name: 'Ad',
  description: 'Açıklama',
  price: 'Fiyat',
  icon: 'İkon (emoji)',
  value: 'Değer',
  label: 'Etiket',
  role: 'Unvan',
  plans: 'Paketler',
  period: 'Dönem',
  features: 'Özellikler',
  highlighted: 'Öne çıkar',
  q: 'Soru',
  a: 'Cevap',
  images: 'Görseller',
  url: 'URL (https)',
  alt: 'Açıklama (alt)',
  showForm: 'İletişim formu göster',
}

const CTA_OPTIONS = [
  ['whatsapp', 'WhatsApp'],
  ['phone', 'Telefon'],
  ['contact', 'İletişim bölümü'],
  ['url', 'Link'],
]

type Json = string | number | boolean | null | Json[] | { [k: string]: Json }

const field =
  'mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white'

function emptyLike(sample: Json): Json {
  if (typeof sample === 'string') return ''
  if (typeof sample === 'number') return 0
  if (typeof sample === 'boolean') return false
  if (Array.isArray(sample)) return []
  if (sample && typeof sample === 'object') return Object.fromEntries(Object.entries(sample).map(([k, v]) => [k, emptyLike(v)]))
  return ''
}

export default function SchemaFields({ value, onChange, path = '' }: { value: Json; onChange: (v: Json) => void; path?: string }) {
  if (Array.isArray(value)) {
    return (
      <div className="space-y-3">
        {value.map((item, i) => (
          <div key={`${path}.${i}`} className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 relative">
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="absolute top-2 right-2 text-xs font-bold text-red-600"
              aria-label="Sil"
            >
              Sil
            </button>
            {typeof item === 'string' ? (
              <input className={field} value={item} onChange={(e) => onChange(value.map((x, j) => (j === i ? e.target.value : x)))} />
            ) : (
              <SchemaFields value={item} path={`${path}.${i}`} onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))} />
            )}
          </div>
        ))}
        {value.length > 0 && (
          <button type="button" onClick={() => onChange([...value, emptyLike(value[0])])} className="text-sm font-bold text-teal-700 dark:text-teal-300">
            + Ekle
          </button>
        )}
      </div>
    )
  }

  if (value && typeof value === 'object') {
    return (
      <div className="space-y-3">
        {Object.entries(value)
          .filter(([k]) => k !== 'type')
          .map(([k, v]) => {
            const label = LABELS[k] ?? k
            const set = (nv: Json) => onChange({ ...value, [k]: nv })
            if (k === 'ctaTarget') {
              return (
                <label key={k} className="block text-xs font-bold text-gray-600 dark:text-gray-300">
                  {label}
                  <select className={field} value={String(v)} onChange={(e) => set(e.target.value)}>
                    {CTA_OPTIONS.map(([o, l]) => (
                      <option key={o} value={o}>
                        {l}
                      </option>
                    ))}
                  </select>
                </label>
              )
            }
            if (typeof v === 'boolean') {
              return (
                <label key={k} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                  <input type="checkbox" checked={v} onChange={(e) => set(e.target.checked)} /> {label}
                </label>
              )
            }
            if (typeof v === 'string') {
              const long = v.length > 80 || ['text', 'subtitle', 'description', 'a'].includes(k)
              return (
                <label key={k} className="block text-xs font-bold text-gray-600 dark:text-gray-300">
                  {label}
                  {long ? (
                    <textarea rows={3} className={field} value={v} onChange={(e) => set(e.target.value)} />
                  ) : (
                    <input className={field} value={v} onChange={(e) => set(e.target.value)} />
                  )}
                </label>
              )
            }
            return (
              <div key={k}>
                <p className="text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">{label}</p>
                <SchemaFields value={v} path={`${path}.${k}`} onChange={set} />
              </div>
            )
          })}
      </div>
    )
  }
  return null
}
