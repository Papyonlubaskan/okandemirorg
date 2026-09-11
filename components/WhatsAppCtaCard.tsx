import { waUrl } from '@/lib/bank-transfer'

type Props = {
  href: string
  title: string
  subtitle?: string
  label?: string
}

export default function WhatsAppCtaCard({
  href,
  title,
  subtitle,
  label = 'WhatsApp’tan yaz',
}: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 shadow-xl space-y-4 border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-black text-gray-900 dark:text-white">{title}</h2>
      {subtitle ? <p className="text-sm text-gray-600 dark:text-gray-300">{subtitle}</p> : null}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full justify-center items-center bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-full transition"
      >
        {label}
      </a>
      <p className="text-xs text-center text-gray-500 dark:text-gray-400">
        İletişim yalnızca WhatsApp üzerinden. Ödeme bilgisi sitede yayınlanmaz.
      </p>
    </div>
  )
}

export function defaultWa(text: string) {
  return waUrl(text)
}
