/**
 * ARCHIVED — DO NOT RUN. English locale fields were removed (2026-08 full
 * locale strip). Kept only as history of prior EN copy seeds/patches.
 */

/**
 * Garden work (havearbejde) service-page text edits per client spec
 * (2026-07-23, Gront_Land_DK_garden_service_EN_edits.md): 12 EN field
 * rewrites + 2 DA parity fixes ("Fast prisramme" contradicts the indicative
 * from-prices; FAQ cost answer lacked "ekskl. moms" on the second price).
 * Prices (DKK 600/1,200 per m²) and the 1–3 week timeline stay verbatim —
 * client to confirm before publication. Idempotent set-patches.
 *
 * Run from CMS/:  npx sanity exec scripts/garden-texts-2026-07.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-08-15'})

const DOC = 'service-havearbejde'

const SET: Record<string, string> = {
  // -------------------------------------------------------------- hero (EN)
  'hero.sub.en':
    'We build decks, flower beds and lawns, plant perennials, shrubs and trees, and carry out tree felling and stump grinding. You get a clear plan, one point of contact and a typical project timeline of 1–3 weeks.',
  'hero.trustChips[_key=="k0046"].en': 'Indicative prices',
  // ------------------------------------------------------------- scope (EN)
  'scope.items[_key=="k0048"].title.en': 'Decks and outdoor living areas',
  'scope.items[_key=="k004b"].desc.en':
    'Tree felling, including in confined spaces, followed by stump grinding.',
  // ------------------------------------------------------------ prices (EN)
  'prices.note.en':
    'Indicative starting prices, excluding VAT. You always receive a fixed quote before work begins.',
  // ----------------------------------------------------------- process (EN)
  'process.steps[_key=="k004h"].desc.en':
    'A fixed quote, recommended materials and planting, and an agreed start date.',
  'process.steps[_key=="k004i"].desc.en':
    'We complete the deck, flower beds, planting and lawn in the agreed sequence and keep you updated throughout.',
  // --------------------------------------------------------------- faq (EN)
  'faq.items[_key=="k004m"].a.en':
    'It depends on the job. A paved terrace starts at DKK 600/m² excl. VAT, and a timber deck with structure starts at DKK 1,200/m² excl. VAT. Send us a few photos of your garden, and we will provide a fixed quote before work begins.',
  'faq.items[_key=="k004n"].a.en':
    'Most private garden projects take 1–3 weeks from the start. Smaller jobs, such as planting or a single tree-felling job, are usually quicker. You receive a confirmed timeline with the quote.',
  'faq.items[_key=="k004q"].a.en':
    'Yes. Our teams coordinate the work, so a new deck, driveway paving and planting can be included in one plan with one responsible contact.',
  // ---------------------------------------------------------- seo text (EN)
  'seoText.text.en':
    'Grønt Land DK provides garden work and landscaping services for homeowners in Copenhagen and Greater Copenhagen. We build timber decks and outdoor living areas, establish lawns and flower beds, plant perennials, shrubs and trees, and carry out tree felling and stump grinding. Garden work can also be coordinated with paving, carpentry and façade renovation under one plan and one responsible contact. A typical private garden project takes 1–3 weeks. Send us a short description and a few photos of your garden, and we will reply within 24 hours.',
  // -------------------------------------------------------------- meta (EN)
  'seo.description.en':
    'Garden work in Copenhagen: decks, planting, lawns and tree felling. Typical project timeline: 1–3 weeks. Get a quote within 24 hours.',
  // --------------------------------------------------------- DA parity (2)
  'hero.trustChips[_key=="k0046"].da': 'Vejledende priser',
  'faq.items[_key=="k004m"].a.da':
    'Det afhænger af opgaven. En belægningsterrasse starter ved 600 kr./m² ekskl. moms, en træterrasse med konstruktion ved 1.200 kr./m² ekskl. moms. Send et par billeder af haven, så får du en fast pris, før vi starter.',
}

async function run() {
  await client.patch(DOC).set(SET).commit()
  console.log(`✓ ${DOC}: set ${Object.keys(SET).length} fields`)
}

run()
