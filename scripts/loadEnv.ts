import fs from 'node:fs'
import path from 'node:path'

/**
 * Loads .env, .env.local and .env.production for standalone scripts (later files
 * win), matching the deploy workflow's semantics. Must be called before
 * importing payload.config, which reads process.env at module evaluation time.
 */
export function loadEnv(): void {
  const files = ['.env', '.env.local']
  // Only load production overrides when the runtime is explicitly production.
  // This keeps local scripts on the local DB and local media directory.
  if (process.env.NODE_ENV === 'production') files.push('.env.production')
  const store: Record<string, string> = {}

  for (const name of files) {
    const filePath = path.join(process.cwd(), name)
    if (!fs.existsSync(filePath)) continue

    for (const rawLine of fs.readFileSync(filePath, 'utf8').split('\n')) {
      const line = rawLine.trim()
      if (!line || line.startsWith('#')) continue
      const eq = line.indexOf('=')
      if (eq === -1) continue

      const key = line.slice(0, eq).trim()
      let value = line
        .slice(eq + 1)
        .trim()
        .replace(/^["']|["']$/g, '')
      value = value.replace(/\$\{([A-Za-z0-9_]+)\}/g, (_match, ref: string) => {
        return store[ref] ?? process.env[ref] ?? ''
      })
      store[key] = value
    }
  }

  for (const [key, value] of Object.entries(store)) {
    process.env[key] = value
  }
}
