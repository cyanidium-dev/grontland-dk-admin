/**
 * Remove public from-prices on four service pages (client Aug 2026: no list
 * prices — use forespørgsel CTAs). Unsets legacy `prices` data and rewrites
 * FAQ / SEO / trust-chip strings that quote kr./m² figures.
 * Schema `priceList` + Frontend `ServicePrices` were deleted afterward —
 * this script is idempotent history for the dataset scrub only.
 *
 * Dry-run (default):  npx sanity exec scripts/remove-public-prices.ts --with-user-token
 * Apply:              REMOVE_PUBLIC_PRICES=1 npx sanity exec scripts/remove-public-prices.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-08-15'})
const APPLY = process.env.REMOVE_PUBLIC_PRICES === '1'

const DOC_IDS = [
  'service-havearbejde',
  'service-belaegningsarbejde',
  'service-murerarbejde',
  'service-tomrerarbejde',
] as const

type FaqItem = {_key?: string; q?: string; a?: string}
type ServiceDoc = {
  _id: string
  prices?: unknown
  seo?: {description?: string}
  seoText?: {text?: string}
  faq?: {items?: FaqItem[]}
  hero?: {trustChips?: string[]}
}

/** FAQ cost answers keyed by question substring (match live q text). */
const FAQ_BY_Q: Record<string, string> = {
  'Hvad koster havearbejde':
    'Det afhænger af opgaven. Send en forespørgsel med et par billeder af haven, så får du en fast pris, før vi starter.',
  'Hvad koster ny belægning':
    'Prisen afhænger af materiale og bundforhold. Send en forespørgsel med et billede af arealet, så får du en fast pris, før vi går i gang.',
  'Hvad koster facaderenovering':
    'Den samlede pris afhænger af facadens stand og forarbejdet. Send en forespørgsel med et par billeder, så får du en fast pris efter besigtigelse.',
  'Hvad koster en træterrasse':
    'Træsort og terræn påvirker prisen. Send en forespørgsel med en kort beskrivelse, så får du en fast pris, før vi bygger.',
}

const SEO_DESCRIPTION: Record<string, string> = {
  'service-havearbejde':
    'Havearbejde i København og Storkøbenhavn: terrasser, beplantning, græsplæne, træfældning og højbede. Typisk forløb 1-3 uger. Få et tilbud inden 24 timer.',
  'service-belaegningsarbejde':
    'Belægning i København: indkørsler, terrasser, trapper og støttemure i beton, granit og sandsten med korrekt bundopbygning. Få et tilbud inden 24 timer.',
  'service-murerarbejde':
    'Murerarbejde i København: facaderenovering, badeværelser, fliser, fuger og tegltag. Typisk forløb 3-15 arbejdsdage. Få et tilbud inden 24 timer.',
  'service-tomrerarbejde':
    'Tømrerarbejde i København: træterrasser, tag, gulve, køkkener, døre og vinduer. Typisk opgave 1-4 uger. Få et tilbud inden 24 timer.',
}

const SEO_TEXT: Record<string, string> = {
  'service-havearbejde':
    'Grønt Land DK udfører havearbejde i København og Storkøbenhavn for private boligejere. Vi anlægger træterrasser og havezoner, planter stauder, buske og træer, etablerer græsplæner og bygger højbede og mindre støttemure. Træfældning med rodfræsning klarer vi også, ligesom løbende pleje og vedligeholdelse efter anlægget. Mange kunder kombinerer flere opgaver, fx en ny terrasse sammen med belægning i indkørslen eller ny beplantning, når facaden alligevel renoveres. Fordi fagene er samlet i ét team, planlægges arbejdet i én rækkefølge med én ansvarlig kontakt — det sparer koordinering og giver et resultat, der hænger sammen. Et typisk privat forløb tager 1-3 uger, og du kender prisen, før vi går i gang. Se fx træterrassen i Jatoba i Gentofte under projekter, eller send en forespørgsel med en kort beskrivelse af din have, så vender vi tilbage inden 24 timer.',
  'service-belaegningsarbejde':
    'Grønt Land DK udfører alle former for belægnings- og brolæggeropgaver i København og Storkøbenhavn: indkørsler, terrasser, gangarealer, trapper og støttemure i beton- og granitprodukter. Vi arbejder for private boligejere og deltager som underentreprenør på større projekter, fx belægning og afvanding ved ARC Amager Ressourcecenter. Afvanding er en fast del af opgaven; med korrekt fald, linjedræn og brønde ledes vandet væk, før det bliver et problem for hus eller belægning. De fleste opgaver er udført på 3-10 arbejdsdage. Skal belægningen spille sammen med haven, kan vi planlægge havearbejde og belægning i én samlet plan. Send en forespørgsel med et billede af arealet, så vender vi tilbage inden 24 timer med en vurdering.',
  'service-murerarbejde':
    'Grønt Land DK udfører alle former for murerarbejde i København og Storkøbenhavn for private og offentlige bygherrer: facaderenovering, badeværelser, flise- og klinkearbejde, fugearbejde, tegltag samt nybyg, ombyg og tilbyg. Facadearbejdet er en kerneopgave; vi klargør, pudser, spartler og maler, og vi beskytter vinduer, døre og omgivelser undervejs, som ved facaderenoveringen af en privat bolig i Nordsjælland. Betonopgaver hører også til faget. I Hellerup genopbyggede vi en nedslidt betontrappe med ny forskalling, støbning og ens trinmål. De fleste murerforløb tager 3-15 arbejdsdage. Skal facaden males eller badeværelset også have nyt træværk, samler vi fagene i én plan med én ansvarlig kontakt. Send en forespørgsel med et par billeder af opgaven, så vender vi tilbage inden 24 timer.',
  'service-tomrerarbejde':
    'Grønt Land DK tilbyder tømrerarbejde i København og Storkøbenhavn, der tager hele byggeriet i betragtning, fra kælder til kvist: tagarbejde, gulvlægning, montering af køkkener og interiør, døre og vinduer samt konstruktion af garager, carporte, skure og terrasser. Terrasser er en af de opgaver, vi bygger flest af. Ved en privat bolig i Gentofte opførte vi fx en træterrasse i Jatoba med bærende konstruktion, nivellering og præcis tilpasning; hårdttræ tilgiver ikke sjusk, så udførelsen skal være nøjagtig. De fleste tømreropgaver er afsluttet på 1-4 uger. Indgår tømrerarbejdet i en større renovering, planlægges det sammen med murer og maler i én samlet plan. Send en forespørgsel med en kort beskrivelse, så vender vi tilbage inden 24 timer.',
}

const PRICE_FIGURE_RE = /(?:\d[\d.]*)\s*kr\.?\s*\/\s*m[²2]|DKK\s*[\d,.]+/i

function faqAnswerFor(q: string | undefined): string | null {
  if (!q) return null
  for (const [needle, answer] of Object.entries(FAQ_BY_Q)) {
    if (q.includes(needle)) return answer
  }
  return null
}

function rewriteTrustChips(chips: string[] | undefined): string[] | null {
  if (!chips?.length) return null
  let changed = false
  const next = chips.map((c) => {
    if (c === 'Vejledende priser' || c === 'Fast prisramme') {
      changed = true
      return 'Fast pris før opstart'
    }
    return c
  })
  return changed ? next : null
}

async function main() {
  const docs = await client.fetch<ServiceDoc[]>(
    `*[_id in $ids]{_id, prices, seo, seoText, faq, hero}`,
    {ids: [...DOC_IDS]},
  )

  if (docs.length !== DOC_IDS.length) {
    const found = new Set(docs.map((d) => d._id))
    const missing = DOC_IDS.filter((id) => !found.has(id))
    console.warn(`Warning: missing docs: ${missing.join(', ')}`)
  }

  let touched = 0
  const tx = client.transaction()

  for (const doc of docs) {
    const changes: string[] = []
    let patch = client.patch(doc._id)

    if (doc.prices != null) {
      changes.push('unset prices')
      patch = patch.unset(['prices'])
    }

    const seoDesc = SEO_DESCRIPTION[doc._id]
    if (seoDesc && doc.seo?.description !== seoDesc) {
      if (doc.seo?.description && PRICE_FIGURE_RE.test(doc.seo.description)) {
        changes.push(`seo.description: "${doc.seo.description.slice(0, 60)}…"`)
      } else if (doc.seo?.description !== seoDesc) {
        // Still set when figure-free but drifted (e.g. garden already clean)
        changes.push('seo.description (align forespørgsel copy)')
      }
      patch = patch.set({'seo.description': seoDesc})
    }

    const seoBody = SEO_TEXT[doc._id]
    if (seoBody && doc.seoText?.text !== seoBody) {
      if (doc.seoText?.text && PRICE_FIGURE_RE.test(doc.seoText.text)) {
        changes.push('seoText.text (had kr./m²)')
      } else {
        changes.push('seoText.text (align forespørgsel copy)')
      }
      patch = patch.set({'seoText.text': seoBody})
    }

    const items = doc.faq?.items ?? []
    for (const item of items) {
      const nextA = faqAnswerFor(item.q)
      if (!nextA || !item._key || item.a === nextA) continue
      changes.push(`faq[${item._key}] q="${item.q}"`)
      patch = patch.set({[`faq.items[_key=="${item._key}"].a`]: nextA})
    }

    // Safety: any remaining FAQ answer with a figure whose q we didn't map
    for (const item of items) {
      if (!item.a || !item._key || !PRICE_FIGURE_RE.test(item.a)) continue
      if (faqAnswerFor(item.q)) continue
      console.warn(
        `  ! ${doc._id}: FAQ still has figure, unmapped q="${item.q}" — skip`,
      )
    }

    const chips = rewriteTrustChips(doc.hero?.trustChips)
    if (chips) {
      changes.push(`trustChips → ${JSON.stringify(chips)}`)
      patch = patch.set({'hero.trustChips': chips})
    }

    if (changes.length === 0) {
      console.log(`${doc._id}: already clean`)
      continue
    }

    touched += 1
    console.log(`${doc._id}:`)
    for (const c of changes) console.log(`  - ${c}`)

    if (APPLY) tx.patch(patch)
  }

  console.log(
    APPLY
      ? `Applying patches on ${touched} doc(s)…`
      : `Dry-run: would patch ${touched} doc(s). Set REMOVE_PUBLIC_PRICES=1 to apply.`,
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
