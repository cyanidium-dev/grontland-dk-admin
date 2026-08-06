/**
 * Demolition facts update (client Aug 2026): soften absolute “fast pris”
 * wording and add licensed-asbestos FAQ on service-demonteringsarbejde.
 * Photos / cases left alone (task #12 / empty cases).
 *
 * Dry-run (default):  npx sanity exec scripts/demolition-facts-2026-08.ts --with-user-token
 * Apply:              DEMOLITION_FACTS=1 npx sanity exec scripts/demolition-facts-2026-08.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-08-15'})
const APPLY = process.env.DEMOLITION_FACTS === '1'

const DOC = 'service-demonteringsarbejde'

const PROCESS_STEP_TITLE = 'Aftale og tidsplan'
const PROCESS_DESC =
  'Efter gennemgang får du et tilbud og en plan for adgang, naboer og bortkørsel.'

const COST_FAQ_Q = 'Hvad koster demonteringsarbejde'
const COST_FAQ_A =
  'Prisen afhænger af omfang, materialer, adgang og affald. Send en forespørgsel med billeder, så vender vi tilbage med et tilbud, inden arbejdet kan starte.'

const ASBESTOS_Q = 'Håndterer I asbest?'
const ASBESTOS_A =
  'Ja, vi udfører asbestarbejde, hvor det kræver den nødvendige tilladelse/licens. Omfang og metode vurderes i hvert tilfælde — send en forespørgsel med billeder, så vender vi tilbage med næste skridt.'

const WASTE_FAQ_Q = 'Fjerner I også affaldet'

const SEO_TEXT =
  'Grønt Land DK udfører demonterings- og nedrivningsarbejde i København og Storkøbenhavn som forberedelse til renovering eller nybyggeri. Vi fjerner køkkener, badeværelser, ikke-bærende skillevægge, gulve, lofter og udendørs konstruktioner som gamle terrasser, skure og belægninger. Tilstødende områder afdækkes, affaldet sorteres og køres væk, og pladsen gøres klar til det aftalte næste trin. Demontering kan bestilles som selvstændig opgave eller koordineres med den efterfølgende renovering. Send en kort beskrivelse og billeder af området, så vender vi tilbage inden 24 timer med næste skridt.'

type Step = {_key?: string; title?: string; desc?: string}
type FaqItem = {_key?: string; q?: string; a?: string}
type Doc = {
  _id: string
  process?: {steps?: Step[]}
  faq?: {items?: FaqItem[]}
  seoText?: {text?: string}
}

function key(): string {
  return `k${Math.random().toString(36).slice(2, 9)}`
}

async function main() {
  const doc = await client.fetch<Doc | null>(
    `*[_id == $id][0]{_id, process, faq, seoText}`,
    {id: DOC},
  )
  if (!doc) {
    console.error(`Missing doc ${DOC}`)
    process.exit(1)
  }

  const changes: string[] = []
  let patch = client.patch(DOC)

  const steps = doc.process?.steps ?? []
  const step =
    steps.find((s) => s._key === 'k008i') ||
    steps.find((s) => s.title?.includes(PROCESS_STEP_TITLE))
  if (step?._key && step.desc !== PROCESS_DESC) {
    changes.push(`process[${step._key}] "${step.title}"`)
    patch = patch.set({[`process.steps[_key=="${step._key}"].desc`]: PROCESS_DESC})
  } else if (!step) {
    console.warn('  ! process step "Aftale og tidsplan" / k008i not found')
  }

  let faqDirty = false
  const items: FaqItem[] = (doc.faq?.items ?? []).map((i) => ({...i}))

  const cost =
    items.find((i) => i._key === 'k008q') ||
    items.find((i) => i.q?.includes(COST_FAQ_Q))
  if (cost && cost.a !== COST_FAQ_A) {
    cost.a = COST_FAQ_A
    faqDirty = true
    changes.push(`faq cost answer (${cost._key ?? cost.q})`)
  } else if (!cost) {
    console.warn('  ! cost FAQ not found')
  }

  const hasAsbestos = items.some(
    (i) => i.q?.includes('asbest') || i.q?.includes('Asbest'),
  )
  if (!hasAsbestos) {
    const wasteIdx = items.findIndex((i) => i.q?.includes(WASTE_FAQ_Q))
    const insertAt = wasteIdx >= 0 ? wasteIdx + 1 : items.length
    items.splice(insertAt, 0, {_key: key(), q: ASBESTOS_Q, a: ASBESTOS_A})
    faqDirty = true
    changes.push(`faq insert asbestos at index ${insertAt}`)
  }

  if (faqDirty) {
    patch = patch.set({'faq.items': items})
  }

  if (doc.seoText?.text && doc.seoText.text !== SEO_TEXT) {
    if (/fast pris/i.test(doc.seoText.text)) {
      changes.push('seoText.text (had fast pris)')
    } else {
      changes.push('seoText.text (align næste skridt)')
    }
    patch = patch.set({'seoText.text': SEO_TEXT})
  }

  if (changes.length === 0) {
    console.log(`${DOC}: already clean`)
  } else {
    console.log(`${DOC}:`)
    for (const c of changes) console.log(`  - ${c}`)
  }

  console.log(
    APPLY
      ? `Applying ${changes.length} change(s)…`
      : `Dry-run: would apply ${changes.length} change(s). Set DEMOLITION_FACTS=1 to apply.`,
  )

  if (APPLY && changes.length > 0) {
    await patch.commit({visibility: 'async'})
    console.log('Done.')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
