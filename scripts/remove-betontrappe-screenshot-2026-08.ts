/**
 * Remove website-screenshot asset from betontrappe-hellerup project gallery.
 * photo_412 is a photo-of-monitor showing the project page itself — not site work.
 *
 * Dry-run:  npx sanity exec scripts/remove-betontrappe-screenshot-2026-08.ts --with-user-token
 * Apply:    REMOVE_BETONTRAPPE_SCREENSHOT=1 npx sanity exec scripts/remove-betontrappe-screenshot-2026-08.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-08-15'})
const APPLY = process.env.REMOVE_BETONTRAPPE_SCREENSHOT === '1'
const PROJECT = 'project-betontrappe-hellerup'
const BAD_FILE = /photo_412/i

async function main() {
  console.log(APPLY ? 'APPLY mode' : 'Dry-run mode (set REMOVE_BETONTRAPPE_SCREENSHOT=1 to apply)')

  const doc = await client.fetch<{
    gallery?: {
      _key: string
      kind?: string
      image?: {alt?: string; asset?: {_ref?: string}}
    }[]
  } | null>(`*[_id == $id][0]{gallery}`, {id: PROJECT})

  if (!doc?.gallery?.length) {
    console.log('  no gallery — nothing to do')
    return
  }

  const enriched = await Promise.all(
    doc.gallery.map(async (g) => {
      const ref = g.image?.asset?._ref
      if (!ref) return {...g, orig: null as string | null}
      const asset = await client.fetch<{originalFilename?: string} | null>(
        `*[_id == $id][0]{originalFilename}`,
        {id: ref},
      )
      return {...g, orig: asset?.originalFilename ?? null}
    }),
  )

  const bad = enriched.filter((g) => BAD_FILE.test(g.orig ?? '') || /Grønt Land|screenshot|monitor/i.test(g.image?.alt ?? ''))
  const keep = enriched.filter((g) => !bad.includes(g))

  console.log(`  gallery ${enriched.length} → ${keep.length} (remove ${bad.length})`)
  for (const g of bad) {
    console.log(`  REMOVE [${g.kind}] ${g.orig} | ${g.image?.alt}`)
  }

  if (!bad.length) {
    console.log('  no screenshot assets found')
    return
  }

  if (!APPLY) return

  const next = keep.map(({orig: _o, ...g}) => g)
  await client.patch(PROJECT).set({gallery: next}).commit({visibility: 'async'})
  console.log(`  applied`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
