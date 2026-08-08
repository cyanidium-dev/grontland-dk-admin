/**
 * Cleaning page expand (client Aug 2026): B2B venues + post-build scope,
 * Kontaktperson Anna (name only), forespørgsel cost CTA. Gallery unchanged.
 *
 * Dry-run (default):  npx sanity exec scripts/cleaning-expand-2026-08.ts --with-user-token
 * Apply:              CLEANING_EXPAND=1 npx sanity exec scripts/cleaning-expand-2026-08.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-08-15'})
const APPLY = process.env.CLEANING_EXPAND === '1'

const DOC = 'service-rengoringsarbejde'

const CARD_DESC =
  'Byggerengøring, praktisk rengøring i private hjem og erhverv — kontorer, haller, butikker og byggepavilloner.'

const HERO_H1 = 'Rengøring efter renovering, bolig og erhverv i København'
const HERO_SUB =
  'Vi klarer byggerengøring efter håndværkerne, praktisk rengøring i private hjem og rengøring for virksomheder — kontorer, haller, butikker og byggepavilloner — så lokalerne er klar til brug, ikke bare fejet.'
const TRUST_CHIPS = ['Klar til indflytning', 'Privat og erhverv', 'Kontaktperson Anna']

const SCOPE_ITEMS: {_key: string; title: string; desc: string}[] = [
  {
    _key: 'k008y',
    title: 'Byggerengøring efter renovering',
    desc: 'Byggestøv fjernes fra gulve, flader, skabe og installationer — også i naborum — efter renovering og byggeopgaver.',
  },
  {
    _key: 'k008z',
    title: 'Vinduer og overflader',
    desc: 'Vinduer, karme, fliser og inventar rengøres efter maler-, murer- og tømrerarbejde.',
  },
  {
    _key: 'k0090',
    title: 'Praktisk rengøring i private hjem',
    desc: 'Løbende eller enkeltstående rengøring af boligen, efter aftale om omfang og hyppighed.',
  },
  {
    _key: 'k0erh1',
    title: 'Erhverv — kontorer, haller, butikker og pavilloner',
    desc: 'Rengøring af kontorer, haller, butikker og byggepavilloner — efter byggeri eller som aftalt praktisk rengøring for virksomheder.',
  },
  {
    _key: 'k0091',
    title: 'Sidste led i totalentreprisen',
    desc: 'Ved samlede renoveringer afleverer vi boligen rengjort, så du kan flytte direkte ind i resultatet.',
  },
]

const PROCESS_STEP1_DESC =
  'Efter renovering, i bolig eller erhverv, som fast aftale eller en enkelt grundig omgang; du sætter rammen.'
const PROCESS_STEP4_DESC =
  'Du får lokaler, der er klar til brug, og en aftale om næste gang, hvis rengøringen er løbende.'

const COST_FAQ_Q = 'Hvad koster rengøringsarbejde'
const COST_FAQ_A =
  'Prisen afhænger af omfang, lokaler og om det er byggerengøring eller praktisk rengøring. Send en forespørgsel, så vender vi tilbage med et tilbud, inden arbejdet kan starte.'

const B2B_FAQ_Q = 'Rengør I også kontorer, butikker og byggepavilloner?'
const B2B_FAQ_A =
  'Ja. Vi udfører rengøring for virksomheder i kontorer, haller, butikker og byggepavilloner — både efter byggeri og som aftalt praktisk rengøring. Beskriv lokalerne kort, så vender vi tilbage med næste skridt.'

const SEO_TITLE = 'Rengøring efter renovering og erhverv i København | Grønt Land DK'
const SEO_DESCRIPTION =
  'Byggerengøring, privat rengøring og erhvervsrengøring i København — kontorer, haller, butikker og byggepavilloner. Send en forespørgsel — vi svarer inden 24 timer.'

const SEO_TEXT_H2 = 'Byggerengøring, privat og erhverv i København'
const SEO_TEXT =
  'Grønt Land DK udfører rengøringsarbejde i København og Storkøbenhavn i tre spor: byggerengøring efter renovering og byggeopgaver, praktisk rengøring i private hjem, og erhvervsrengøring i kontorer, haller, butikker og byggepavilloner. Byggestøv er finere end almindeligt husstøv og lægger sig overalt, også i rum der ikke blev renoveret; derfor rengør vi systematisk, oppefra og ned, rum for rum, til lokalerne er klar til brug. For kunder med en samlet renovering hos os er rengøringen det naturlige sidste led i planen: samme team, samme aftale, og en bolig der afleveres indflytningsklar. Virksomheder kan bestille rengøring efter byggeri eller som en løbende aftale. Send en kort beskrivelse af opgaven, så vender vi tilbage inden 24 timer med et tilbud.'

type Step = {_key?: string; title?: string; desc?: string}
type FaqItem = {_key?: string; q?: string; a?: string}
type ScopeItem = {_key?: string; title?: string; desc?: string}
type Doc = {
  _id: string
  cardDesc?: string
  hero?: {h1?: string; sub?: string; trustChips?: string[]}
  scope?: {items?: ScopeItem[]}
  process?: {steps?: Step[]}
  faq?: {items?: FaqItem[]}
  seo?: {title?: string; description?: string}
  seoText?: {h2?: string; text?: string}
}

function key(): string {
  return `k${Math.random().toString(36).slice(2, 9)}`
}

function sameChips(a: string[] | undefined, b: string[]): boolean {
  if (!a || a.length !== b.length) return false
  return a.every((v, i) => v === b[i])
}

async function main() {
  const doc = await client.fetch<Doc | null>(
    `*[_id == $id][0]{_id, cardDesc, hero, scope, process, faq, seo, seoText}`,
    {id: DOC},
  )
  if (!doc) {
    console.error(`Missing doc ${DOC}`)
    process.exit(1)
  }

  const changes: string[] = []
  let patch = client.patch(DOC)

  if (doc.cardDesc !== CARD_DESC) {
    changes.push('cardDesc')
    patch = patch.set({cardDesc: CARD_DESC})
  }

  if (doc.hero?.h1 !== HERO_H1) {
    changes.push('hero.h1')
    patch = patch.set({'hero.h1': HERO_H1})
  }
  if (doc.hero?.sub !== HERO_SUB) {
    changes.push('hero.sub')
    patch = patch.set({'hero.sub': HERO_SUB})
  }
  if (!sameChips(doc.hero?.trustChips, TRUST_CHIPS)) {
    changes.push('hero.trustChips (+ Kontaktperson Anna)')
    patch = patch.set({'hero.trustChips': TRUST_CHIPS})
  }

  const liveScope = (doc.scope?.items ?? []).map((i) => ({
    _key: i._key,
    title: i.title,
    desc: i.desc,
  }))
  const scopeChanged =
    liveScope.length !== SCOPE_ITEMS.length ||
    SCOPE_ITEMS.some(
      (want, idx) =>
        liveScope[idx]?._key !== want._key ||
        liveScope[idx]?.title !== want.title ||
        liveScope[idx]?.desc !== want.desc,
    )
  if (scopeChanged) {
    changes.push(`scope.items (${SCOPE_ITEMS.length} cards)`)
    patch = patch.set({'scope.items': SCOPE_ITEMS})
  }

  const steps = doc.process?.steps ?? []
  const step1 = steps.find((s) => s._key === 'k0092') || steps.find((s) => s.title?.includes('beskriver'))
  if (step1?._key && step1.desc !== PROCESS_STEP1_DESC) {
    changes.push(`process[${step1._key}] step1`)
    patch = patch.set({[`process.steps[_key=="${step1._key}"].desc`]: PROCESS_STEP1_DESC})
  }
  const step4 = steps.find((s) => s._key === 'k0095') || steps.find((s) => s.title?.includes('Gennemgang'))
  if (step4?._key && step4.desc !== PROCESS_STEP4_DESC) {
    changes.push(`process[${step4._key}] step4`)
    patch = patch.set({[`process.steps[_key=="${step4._key}"].desc`]: PROCESS_STEP4_DESC})
  }

  let faqDirty = false
  const items: FaqItem[] = (doc.faq?.items ?? []).map((i) => ({...i}))

  const cost =
    items.find((i) => i._key === 'k0099') || items.find((i) => i.q?.includes(COST_FAQ_Q))
  if (cost && cost.a !== COST_FAQ_A) {
    cost.a = COST_FAQ_A
    faqDirty = true
    changes.push(`faq cost (${cost._key})`)
  } else if (!cost) {
    console.warn('  ! cost FAQ not found')
  }

  const hasB2b = items.some(
    (i) =>
      i.q?.includes('kontorer') ||
      i.q?.includes('byggepavillon') ||
      i.q?.includes('butikker'),
  )
  if (!hasB2b) {
    const privateIdx = items.findIndex((i) => i.q?.includes('private hjem'))
    const insertAt = privateIdx >= 0 ? privateIdx + 1 : items.length
    items.splice(insertAt, 0, {_key: key(), q: B2B_FAQ_Q, a: B2B_FAQ_A})
    faqDirty = true
    changes.push(`faq insert B2B at index ${insertAt}`)
  }

  if (faqDirty) {
    patch = patch.set({'faq.items': items})
  }

  if (doc.seo?.title !== SEO_TITLE) {
    changes.push('seo.title')
    patch = patch.set({'seo.title': SEO_TITLE})
  }
  if (doc.seo?.description !== SEO_DESCRIPTION) {
    changes.push('seo.description')
    patch = patch.set({'seo.description': SEO_DESCRIPTION})
  }
  if (doc.seoText?.h2 !== SEO_TEXT_H2) {
    changes.push('seoText.h2')
    patch = patch.set({'seoText.h2': SEO_TEXT_H2})
  }
  if (doc.seoText?.text !== SEO_TEXT) {
    changes.push('seoText.text')
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
      : `Dry-run: would apply ${changes.length} change(s). Set CLEANING_EXPAND=1 to apply.`,
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
