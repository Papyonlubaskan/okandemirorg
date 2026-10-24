/** Next.js sunucu başlangıç kancası. Yalnızca AI_WORKER_LOOP=1 olan (worker) serviste döngü başlatır. */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const loop = process.env.AI_WORKER_LOOP
    if (loop === '1' || loop === 'true') {
      const { startWorkerLoop } = await import('./lib/jobs/loop')
      startWorkerLoop()
    }
  }
}
