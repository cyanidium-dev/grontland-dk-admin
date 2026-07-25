/**
 * Demolition & strip-out page edits per client spec (2026-07-24,
 * Gront_Land_DK_demolition_service_EN_edits.md): 11 EN rewrites + 9 DA
 * parity fields (the absolute promises and unverified claims exist in the
 * Danish source too; pure English-calque fixes are EN-only). Also unsets
 * `cases` — the referenced ARC paving project is irrelevant to demolition,
 * and the spec hides the block until a real strip-out case exists
 * (ServiceSections renders nothing for empty cases). Photos + facts are
 * pending client input (workspace docs/client-open-questions.md).
 * Idempotent set/unset patches.
 *
 * Run from CMS/:  npx sanity exec scripts/demolition-texts-2026-07.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-08-15'})

const DOC = 'service-demonteringsarbejde'

const SET: Record<string, string> = {
  // ------------------------------------------------------------------ hero
  'hero.sub.en':
    'A renovation often begins with removing what is already there. We carry out controlled strip-out work, protect the parts that remain, sort the waste and prepare the area for the next trade.',
  'hero.sub.da':
    'En renovering begynder ofte med at fjerne det gamle. Vi udfører kontrolleret demontering, beskytter det, der bliver stående, sorterer affaldet og gør området klar til næste fag.',
  // ----------------------------------------------------------------- scope
  'scope.items[_key=="k008e"].desc.en':
    'Adjoining rooms and surfaces are protected to help contain dust and debris within the work area.',
  'scope.items[_key=="k008e"].desc.da':
    'Tilstødende rum og overflader afdækkes, så støv og byggeaffald begrænses til arbejdsområdet.',
  'scope.items[_key=="k008f"].desc.en':
    'Waste is sorted and removed from the site, leaving the area clear for the next trade.',
  'scope.items[_key=="k008g"].desc.en':
    'The area is left ready for the agreed next stage of the renovation.',
  'scope.items[_key=="k008g"].desc.da':
    'Området efterlades klar til det aftalte næste trin i renoveringen.',
  // ----------------------------------------------------------------- steps
  'process.steps[_key=="k008i"].desc.en':
    'You receive a fixed quote and a plan covering access, neighbours and waste removal.',
  'process.steps[_key=="k008j"].desc.en':
    'We protect adjoining areas and carry out the strip-out in a controlled sequence. Structural elements are altered only where this has been assessed and agreed in advance.',
  'process.steps[_key=="k008j"].desc.da':
    'Vi afdækker tilstødende områder og udfører nedtagningen i en kontrolleret rækkefølge. Bærende dele ændres kun, hvor det er vurderet og aftalt på forhånd.',
  // ------------------------------------------------------------------- faq
  'faq.items[_key=="k008n"].a.en':
    'Yes. Waste is sorted and removed from the site as part of the agreed work, so you do not have to arrange disposal separately.',
  'faq.items[_key=="k008n"].a.da':
    'Ja. Affaldet sorteres og køres væk som en del af den aftalte opgave, så du ikke selv skal stå for bortskaffelse.',
  'faq.items[_key=="k008o"].a.en':
    'Yes. Strip-out can be booked as a standalone service. We can also coordinate the following renovation work under the same plan.',
  'faq.items[_key=="k008o"].a.da':
    'Ja. Demontering kan bestilles som selvstændig opgave. Vi kan også koordinere den efterfølgende renovering i samme plan.',
  'faq.items[_key=="k008p"].a.en':
    'We protect adjoining rooms, floors and furnishings and use dust-control measures suited to the job. The exact setup depends on the scope and the property.',
  'faq.items[_key=="k008p"].a.da':
    'Vi afdækker tilstødende rum, gulve og inventar og bruger støvbegrænsning, der passer til opgaven. Den præcise afdækning afhænger af omfanget og boligen.',
  'faq.items[_key=="k008q"].a.en':
    'The price depends on the scope, materials, access and volume of waste. Send photos of what needs to be removed, and you will receive a fixed quote before work begins.',
  'faq.items[_key=="k008q"].a.da':
    'Prisen afhænger af omfang, materialer, adgangsforhold og mængden af affald. Send billeder af det, der skal fjernes, så får du en fast pris, inden arbejdet går i gang.',
  // -------------------------------------------------------------- seo text
  'seoText.text.en':
    'Grønt Land DK provides demolition and strip-out services in Copenhagen and Greater Copenhagen as preparation for renovation or new construction. We remove kitchens, bathrooms, non-load-bearing partition walls, floors, ceilings and outdoor structures such as old decks, sheds and paving. Adjoining areas are protected, waste is sorted and removed, and the site is prepared for the agreed next stage. Strip-out can be booked as a standalone service or coordinated with the following renovation work. Send a short description and photos of the area, and we will reply within 24 hours with the next step.',
  'seoText.text.da':
    'Grønt Land DK udfører demonterings- og nedrivningsarbejde i København og Storkøbenhavn som forberedelse til renovering eller nybyggeri. Vi fjerner køkkener, badeværelser, ikke-bærende skillevægge, gulve, lofter og udendørs konstruktioner som gamle terrasser, skure og belægninger. Tilstødende områder afdækkes, affaldet sorteres og køres væk, og pladsen gøres klar til det aftalte næste trin. Demontering kan bestilles som selvstændig opgave eller koordineres med den efterfølgende renovering. Send en kort beskrivelse og billeder af området, så vender vi tilbage inden 24 timer med næste skridt.',
}

async function run() {
  await client.patch(DOC).set(SET).commit()
  console.log(`✓ ${DOC}: set ${Object.keys(SET).length} fields`)
  // Hide "What we've done": the only referenced case is the ARC paving
  // project, which is not demolition work (spec: hide until a real case).
  const cases = await client.fetch(`*[_id == $id][0].cases`, {id: DOC})
  if (cases && cases.length) {
    await client.patch(DOC).unset(['cases']).commit()
    console.log(`✓ ${DOC}: cases unset (was ${cases.length} ref) — block hidden`)
  } else {
    console.log(`= ${DOC}: cases already empty`)
  }
}

run()
