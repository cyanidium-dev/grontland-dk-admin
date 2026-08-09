/**
 * Add licensed-asbestos card to “Hvad tager vi ned?” on
 * service-demonteringsarbejde. Re-ensure FAQ asbestos Q if missing.
 *
 * Dry-run (default):  npx sanity exec scripts/demolition-asbestos-scope-2026-08.ts --with-user-token
 * Apply:              DEMOLITION_ASBESTOS_SCOPE=1 npx sanity exec scripts/demolition-asbestos-scope-2026-08.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-08-15'})
const APPLY = process.env.DEMOLITION_ASBESTOS_SCOPE === '1'

const DOC = 'service-demonteringsarbejde'

const ASBESTOS_SCOPE = {
  title: 'Asbestarbejde',
  desc: 'Vi udfører asbestarbejde, hvor det kræver den nødvendige tilladelse/licens. Omfang og metode vurderes i hvert tilfælde.',
}

const ASBESTOS_Q = 'Håndterer I asbest?'
const ASBESTOS_A =
  'Ja, vi udfører asbestarbejde, hvor det kræver den nødvendige tilladelse/licens. Omfang og metode vurderes i hvert tilfælde — send en forespørgsel med billeder, så vender vi tilbage med næste skridt.'

const WASTE_FAQ_Q = 'Fjerner I også affaldet'

type ScopeItem = {_key?: string; title?: string; desc?: string}
type FaqItem = {_key?: string; q?: string; a?: string}
type Doc = {
  _id: string
  scope?: {items?: ScopeItem[]}
  faq?: {items?: FaqItem[]}
}

function key(): string {
  return `k${Math.random().toString(36).slice(2, 9)}`
}

function isAsbestos(title?: string, q?: string): boolean {
  const s = `${title ?? ''} ${q ?? ''}`.toLowerCase()
  return s.includes('asbest')
}

async function main() {
  const doc = await client.fetch<Doc | null>(
    `*[_id == $id][0]{_id, scope, faq}`,
    {id: DOC},
  )
  if (!doc) {
    console.error(`Missing doc ${DOC}`)
    process.exit(1)
  }

  const changes: string[] = []
  let patch = client.patch(DOC)

  const scopeItems: ScopeItem[] = (doc.scope?.items ?? []).map((i) => ({...i}))
  const hasScopeAsbestos = scopeItems.some((i) => isAsbestos(i.title))
  if (!hasScopeAsbestos) {
    // After “Sortering og bortkørsel”, before “Klargøring” when present
    const sortIdx = scopeItems.findIndex((i) =>
      (i.title ?? '').toLowerCase().includes('sortering'),
    )
    const insertAt = sortIdx >= 0 ? sortIdx + 1 : scopeItems.length
    scopeItems.splice(insertAt, 0, {_key: key(), ...ASBESTOS_SCOPE})
    changes.push(`scope insert asbestos at index ${insertAt}`)
    patch = patch.set({'scope.items': scopeItems})
  } else {
    console.log('  scope asbestos already present')
  }

  const faqItems: FaqItem[] = (doc.faq?.items ?? []).map((i) => ({...i}))
  const hasFaqAsbestos = faqItems.some((i) => isAsbestos(undefined, i.q))
  if (!hasFaqAsbestos) {
    const wasteIdx = faqItems.findIndex((i) => i.q?.includes(WASTE_FAQ_Q))
    const insertAt = wasteIdx >= 0 ? wasteIdx + 1 : faqItems.length
    faqItems.splice(insertAt, 0, {_key: key(), q: ASBESTOS_Q, a: ASBESTOS_A})
    changes.push(`faq insert asbestos at index ${insertAt}`)
    patch = patch.set({'faq.items': faqItems})
  } else {
    console.log('  faq asbestos already present')
  }

  if (changes.length === 0) {
    console.log('No changes.')
    return
  }
  console.log(APPLY ? 'Applying:' : 'Dry-run:')
  for (const c of changes) console.log(`  - ${c}`)
  if (!APPLY) {
    console.log('Set DEMOLITION_ASBESTOS_SCOPE=1 to apply.')
    return
  }
  await patch.commit({visibility: 'async'})
  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
