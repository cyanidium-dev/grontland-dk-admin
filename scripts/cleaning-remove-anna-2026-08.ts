/**
 * Remove “Kontaktperson Anna” trust chip from rengøringsarbejde hero
 * (requirement change after cleaning expand).
 *
 * Dry-run (default):  npx sanity exec scripts/cleaning-remove-anna-2026-08.ts --with-user-token
 * Apply:              CLEANING_REMOVE_ANNA=1 npx sanity exec scripts/cleaning-remove-anna-2026-08.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-08-15'})
const APPLY = process.env.CLEANING_REMOVE_ANNA === '1'

const DOC = 'service-rengoringsarbejde'
const ANNA = 'Kontaktperson Anna'

type Doc = {
  _id: string
  hero?: {trustChips?: string[]}
}

async function main() {
  const doc = await client.fetch<Doc | null>(
    `*[_id == $id][0]{_id, hero}`,
    {id: DOC},
  )
  if (!doc) {
    console.error(`Missing doc ${DOC}`)
    process.exit(1)
  }

  const chips = doc.hero?.trustChips ?? []
  const next = chips.filter((c) => c !== ANNA)
  if (next.length === chips.length) {
    console.log('No Anna chip present — nothing to do.')
    return
  }

  console.log(APPLY ? 'Applying:' : 'Dry-run:')
  console.log(`  trustChips: [${chips.join(', ')}] → [${next.join(', ')}]`)
  if (!APPLY) {
    console.log('Set CLEANING_REMOVE_ANNA=1 to apply.')
    return
  }
  await client.patch(DOC).set({'hero.trustChips': next}).commit({visibility: 'async'})
  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
