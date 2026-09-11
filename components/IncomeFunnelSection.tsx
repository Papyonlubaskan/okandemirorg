import Link from 'next/link'
import { DIGITAL_PRODUCTS, FUNNEL, formatTry } from '@/lib/digital-products'

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
    title: DIGITAL_PRODUCTS[0].name,
    price: formatTry(DIGITAL_PRODUCTS[0].priceTry),
    href: FUNNEL.kitHref,
    desc: DIGITAL_PRODUCTS[0].shortDescription,
  },
  {
    n: '2',
    title: DIGITAL_PRODUCTS[1].name,
    price: formatTry(DIGITAL_PRODUCTS[1].priceTry),
    href: FUNNEL.auditHref,
    desc: DIGITAL_PRODUCTS[1].shortDescription,
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
            Ücretsiz → kit → denetim → bakım. Tüm iletişim WhatsApp. Ödeme bilgisi sitede yok.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
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
      </div>
    </section>
  )
}
