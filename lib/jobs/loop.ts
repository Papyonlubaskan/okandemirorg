import { isOrchestratorEnabled } from '@/lib/ai/feature'
import { getStore } from '@/lib/ai/store'
import { runWorkerTick } from './worker'

let started = false
let stopping = false

/**
 * Ayrı Railway worker servisi için sürekli döngü (AI_WORKER_LOOP=1).
 * Turlar üst üste binmez; SIGTERM'de yeni iş almayı bırakır, yarım iş lease süresi dolunca kurtarılır.
 */
export function startWorkerLoop(): void {
  if (started || !isOrchestratorEnabled()) return
  started = true

  const interval = Math.max(5_000, parseInt(process.env.AI_WORKER_INTERVAL_MS || '15000', 10) || 15_000)
  let running = false

  const tick = async () => {
    if (running || stopping) return
    running = true
    try {
      await runWorkerTick(getStore(), { maxTasks: 5, timeBudgetMs: Math.min(50_000, interval * 3) })
    } catch {
      // Bir sonraki turda tekrar denenir; görev durumu DB'de
    } finally {
      running = false
    }
  }

  const timer = setInterval(tick, interval)
  const stop = () => {
    stopping = true
    clearInterval(timer)
  }
  process.once('SIGTERM', stop)
  process.once('SIGINT', stop)
  void tick()
}
