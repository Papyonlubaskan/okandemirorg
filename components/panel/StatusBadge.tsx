const LABELS: Record<string, { text: string; cls: string }> = {
  queued: { text: 'Sırada', cls: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100' },
  planning: { text: 'Planlanıyor', cls: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-100' },
  running: { text: 'Çalışıyor', cls: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-100' },
  awaiting_approval: { text: 'Onay bekliyor', cls: 'bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-100' },
  retry_wait: { text: 'Tekrar denenecek', cls: 'bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-100' },
  succeeded: { text: 'Tamamlandı', cls: 'bg-teal-100 text-teal-900 dark:bg-teal-900/50 dark:text-teal-100' },
  failed: { text: 'Başarısız', cls: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-100' },
  cancelled: { text: 'İptal', cls: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200' },
  expired: { text: 'Süresi doldu', cls: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200' },
}

export const TERMINAL = ['succeeded', 'failed', 'cancelled', 'expired']

export default function StatusBadge({ status }: { status: string }) {
  const s = LABELS[status] ?? { text: status, cls: 'bg-gray-100 text-gray-700' }
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${s.cls}`}>{s.text}</span>
}
