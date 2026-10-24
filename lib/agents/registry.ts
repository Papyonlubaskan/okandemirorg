import { echoTool } from './tools/echo'
import { landingDraftTool, landingPublishTool } from './tools/landing'
import { seoAuditTool } from './tools/seo-audit'
import type { ToolDef } from './types'

/**
 * İzinli araç listesi (allowlist). Model yalnızca buradaki isimleri önerebilir;
 * rastgele fonksiyon, SQL veya shell komutu çalıştırılmaz.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TOOLS: ToolDef<any, any>[] = [echoTool, seoAuditTool, landingDraftTool, landingPublishTool]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyTool = ToolDef<any, any>

export type ToolRegistry = {
  get(name: string): AnyTool | undefined
  has(name: string): boolean
  list(): AnyTool[]
}

export function createRegistry(tools: AnyTool[]): ToolRegistry {
  const map = new Map(tools.map((t) => [t.name, t]))
  return {
    get: (name) => map.get(name),
    has: (name) => map.has(name),
    list: () => [...map.values()],
  }
}

let defaultRegistry: ToolRegistry | null = null

export function getToolRegistry(): ToolRegistry {
  if (!defaultRegistry) defaultRegistry = createRegistry(TOOLS)
  return defaultRegistry
}
