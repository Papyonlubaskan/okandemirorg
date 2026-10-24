import { z } from 'zod'
import type { ToolDef } from '../types'

const input = z.object({ message: z.string().trim().min(1).max(500) }).strict()

/** Etkisiz test aracı: uçtan uca akışı doğrulamak için */
export const echoTool: ToolDef<z.infer<typeof input>, { echo: string; at: string }> = {
  name: 'echo.test',
  description: 'Verilen mesajı aynen döndürür. Yan etkisi yoktur.',
  risk: 'safe',
  inputSchema: input,
  timeoutMs: 5_000,
  async run(i) {
    return { echo: i.message, at: new Date().toISOString() }
  },
}
