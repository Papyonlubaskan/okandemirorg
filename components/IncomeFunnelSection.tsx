import Link from 'next/link'
import { getProductBySlug, FUNNEL, formatTry } from '@/lib/digital-products'

const kit = getProductBySlug('kobi-dijital-baslangic-kiti')!
const aiAudit = getProductBySlug('ai-seo-denetim')!
const audit = getProductBySlug('dijital-isletme-denetimi')!

const STEPS = [
  {
    n: '0',
    title: 'Ücretsiz rehber',
    price: '0₺',
    href: FUNNEL.leadHref,
    desc: '7 SEO hatası — WhatsApp’tan iste',
  },
  {
    n: '1',
    title: kit.name,
    price: formatTry(kit.priceTry),
    href: FUNNEL.kitHref,
    desc: kit.shortDescription,
  },
  {
    n: '2a',
    title: aiAudit.name,
    price: formatTry(aiAudit.priceTry),
    href: FUNNEL.aiAuditHref,
    desc: aiAudit.shortDescription,
  },
  {
    n: '2',
    title: audit.name,
    price: formatTry(audit.priceTry),
    href: FUNNEL.auditHref,
    desc: audit.shortDescription,
  },
  {
    n: '3',
    title: 'Dijital Bakım',
    price: `${formatTry(4900)} / ${formatTry(7900)}`,
    href: FUNNEL.careHref,
    desc: 'Aylık takip — Light veya Standart · WhatsApp',
  },
]

export default function IncomeFunnelSection({
  title = 'Dijital gelir yolu',
}: {
  title?: string
}) {
  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-3">{title}</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Ücretsiz → kit → AI/insanlı denetim → bakım. WhatsApp sipariş; ödeme bilgisi sitede yok.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {STEPS.map((s) => (
            <Link
              key={s.href + s.n}
              href={s.href}
              className="block rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-xl transition border border-gray-100 dark:border-gray-700"
            >
              <span className="text-xs font-black text-blue-600 dark:text-blue-400">Adım {s.n}</span>
              <h3 className="text-lg font-black text-gray-900 dark:text-white mt-2 mb-2">{s.title}</h3>
              <p className="text-blue-700 dark:text-blue-300 font-black mb-2">{s.price}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{s.desc}</p>
            </Link>
          ))}
        </div>
        <p className="text-center mt-8">
          <Link href={FUNNEL.aiLandingHref} className="text-cyan-800 dark:text-cyan-300 font-bold underline">
            AI Landing Sayfa ({formatTry(2490)})
          </Link>
        </p>
      </div>
    </section>
  )
}
