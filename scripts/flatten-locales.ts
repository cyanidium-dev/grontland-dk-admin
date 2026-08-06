/**
 * Flatten field-level {da, en?} locale objects to plain Danish strings.
 * Idempotent: already-flat strings are left alone.
 *
 * Dry-run (default):  npx sanity exec scripts/flatten-locales.ts --with-user-token
 * Apply:              FLATTEN_LOCALES=1 npx sanity exec scripts/flatten-locales.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-08-15'})
const APPLY = process.env.FLATTEN_LOCALES === '1'

function isLocaleObject(v: unknown): v is {_type?: string; da: string; en?: string} {
  if (v == null || typeof v !== 'object' || Array.isArray(v)) return false
  const o = v as Record<string, unknown>
  if (typeof o.da !== 'string') return false
  // Avoid mistaking unrelated objects that happen to have a `da` string
  // (e.g. country codes). Require locale markers or only da/en/_type/_key keys.
  if (o._type === 'localeString' || o._type === 'localeText') return true
  const keys = Object.keys(o).filter((k) => !['_key', '_type'].includes(k))
  return keys.every((k) => k === 'da' || k === 'en') && keys.includes('da')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function flatten(node: any): {node: any; count: number} {
  if (node == null) return {node, count: 0}
  if (Array.isArray(node)) {
    let count = 0
    const next = node.map((item) => {
      const r = flatten(item)
      count += r.count
      return r.node
    })
    return {node: next, count}
  }
  if (typeof node !== 'object') return {node, count: 0}

  if (isLocaleObject(node)) {
    return {node: node.da, count: 1}
  }

  let count = 0
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(node)) {
    const r = flatten(v)
    out[k] = r.node
    count += r.count
  }
  return {node: out, count}
}

async function main() {
  const docs = await client.fetch<Record<string, unknown>[]>(
    `*[_type in [
      "siteSettings","quoteForm","project","service","galleryCategory",
      "homePage","omOsPage","kontaktPage","privatePage","entreprenorerPage",
      "projekterPage","ydelserIndexPage","galleriPage"
    ]]`,
  )

  let totalFlats = 0
  let touched = 0
  const tx = client.transaction()

  for (const doc of docs) {
    const {node, count} = flatten(doc)
    if (count === 0) continue
    touched += 1
    totalFlats += count
    console.log(`${doc._id}: ${count} locale object(s)`)
    if (APPLY) tx.createOrReplace(node)
  }

  console.log(
    APPLY
      ? `Applying ${totalFlats} flatten(s) across ${touched} docs…`
      : `Dry-run: would flatten ${totalFlats} value(s) in ${touched} docs. Set FLATTEN_LOCALES=1 to apply.`,
  )

  if (APPLY && touched > 0) {
    await tx.commit({visibility: 'async'})
    console.log('Done.')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
