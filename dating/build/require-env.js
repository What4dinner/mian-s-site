/** Throws if any of `names` is missing or blank in `env`. */
export function requireEnv(env, names) {
  const missing = names.filter((n) => !env[n] || !String(env[n]).trim())
  if (missing.length) throw new Error(`Missing env: ${missing.join(', ')}`)
}
