/**
 * ARCHIVED — DO NOT RUN. English locale fields were removed (2026-08 full
 * locale strip). Kept only as history of prior EN copy seeds/patches.
 */

/**
 * Proactive copy pass on the not-yet-spec'd CMS content, applying the
 * editorial rulebook derived from the client's six specs (workspace
 * docs/remaining-pages-copy-review.md): calques, absolute promises,
 * unverified claims, fixed-quote phrasing, en-dash ranges, canon audience.
 * DA parity only where the issue is content-level (absolutes) — idiomatic
 * Danish ("du sætter rammen", "i to spor", "fast rytme") stays.
 *
 * Run from CMS/:  npx sanity exec scripts/remaining-pages-copy-2026-07.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-08-15'})

const SETS: Record<string, Record<string, string>> = {
  // -------------------------------------------------------------- paving
  'service-belaegningsarbejde': {
    'hero.sub.en':
      'We lay driveways, terraces, paths and steps in concrete, granite and sandstone, and we build the base correctly, which helps keep the paving level for years. Typical timeline: 3–10 working days.',
    'hero.sub.da':
      'Vi lægger indkørsler, terrasser, stier og trapper i beton, granit og sandsten, og vi bygger bunden korrekt op, hvilket er med til at holde belægningen plan i mange år. Typisk udførelse: 3-10 arbejdsdage.',
    'hero.trustChips[_key=="k004v"].en': 'Fixed quote before start',
    'prices.note.en':
      'Indicative starting prices, excluding VAT. You always receive a fixed quote before work begins.',
    'process.steps[_key=="k0058"].desc.en':
      'Excavation, stabilising gravel and screeding with correct falls — a durable surface starts with the base.',
    'faq.items[_key=="k005c"].a.en':
      'Driveways start at DKK 800/m² excl. VAT and terraces at DKK 600/m² excl. VAT. The price depends on the material and ground conditions, and you receive a fixed quote before work begins.',
    'faq.items[_key=="k005d"].a.en':
      'A typical paving job takes 3–10 working days, depending on the area and site conditions. The timeline is agreed before work begins.',
    'faq.items[_key=="k005e"].a.en':
      'Paving is laid with correct falls, and we install linear drains or channels where needed — as on our outdoor project in Roskilde, on a sloping site right by the water.',
    'faq.items[_key=="k005g"].a.en':
      'Usually because of a poorly built base. We excavate, build up with stabilising gravel and compact in layers, which helps keep the surface level.',
    'faq.items[_key=="k005g"].a.da':
      'Oftest på grund af dårlig bundopbygning. Vi graver ud, opbygger med stabilgrus og komprimerer i lag, hvilket er med til at holde overfladen plan.',
    'seoText.text.en':
      'Grønt Land DK provides paving and cobblestone work in Copenhagen and Greater Copenhagen: driveways, terraces, walkways, steps and retaining walls in concrete and granite products. We work for private homeowners and take part as a subcontractor on larger projects, such as the paving and drainage work at ARC Amager Resource Center. Drainage is a standard part of the job — correct falls, linear drains and wells lead surface water away from the house and the paving. A terrace starts at DKK 600/m² and a driveway at DKK 800/m², both excl. VAT, and most jobs take 3–10 working days. Paving can also be planned together with garden work as one job. Send us a photo of the area, and we will reply within 24 hours with an assessment.',
    'seo.description.en':
      'Paving in Copenhagen: driveways from DKK 800/m², terraces from DKK 600/m² on a properly built base. Typical timeline: 3–10 working days.',
  },
  // ------------------------------------------------------------ cleaning
  'service-rengoringsarbejde': {
    'hero.trustChips[_key=="k008x"].en': 'A clear agreement',
    'process.steps[_key=="k0092"].desc.en':
      'After a renovation, as a recurring arrangement or a single thorough clean — you define the scope.',
    'faq.items[_key=="k0096"].a.en':
      'The thorough cleaning after a renovation or construction job: construction dust, filler and paint spots, protective film and leftover materials are removed, so the home is ready to use.',
    'faq.items[_key=="k0098"].a.en':
      'On turnkey renovations, cleaning can be included as the final stage of the plan, so the home is handed over cleaned rather than just swept. Let us know when we make the agreement, and we will include it in the quote.',
    'faq.items[_key=="k0099"].a.en':
      'The price depends on the size of the home and the scope; builders cleaning takes longer than regular cleaning. Describe the job briefly, and you will receive a fixed quote before work begins.',
    'seoText.text.en':
      'Grønt Land DK provides two kinds of cleaning in Copenhagen and Greater Copenhagen: builders cleaning after renovation and construction, and practical cleaning in private homes. Construction dust is finer than household dust and settles far beyond the renovated rooms, so we clean systematically, top down, room by room, until the home is ready to use. For clients who have a full renovation done with us, cleaning is the natural last stage of the plan: same team, same agreement, and a home handed over ready to move into. Practical cleaning in private homes is agreed in scope and frequency, from a single thorough clean to a recurring arrangement. Send a short description of the home and the job, and we will reply within 24 hours with a fixed quote.',
  },
  // -------------------------------------------------- projekter singleton
  projekterPage: {
    'sub.en':
      'See examples of renovation, paving, façades, garden work and other jobs carried out for homeowners and contractors.',
    'seo.description.en':
      'See examples of renovation, paving, façades, garden work and other jobs carried out for homeowners and contractors.',
    'cta.text.en':
      "Tell us briefly about the job, and we'll get back to you with the next step — whether you are a homeowner or a contractor.",
  },
  // ---------------------------------------------------- galleri singleton
  galleriPage: {
    'hero.sub.en':
      'These photos are from our own jobs in Copenhagen and Greater Copenhagen: decks, façades, paving, painting and full renovations. Filter by trade to see relevant work.',
    'cta.h2.en': 'Want us to look at your project?',
    'seoText.text.en':
      'Every photo in the gallery is from work Grønt Land DK has carried out itself; there are no stock photos here. You can see paving in sandstone and granite, hardwood decks, rendered façades, painting, and complete renovations like the villa in Skodsborg. Looking for something specific — such as new driveway paving or bathroom tiling — you can filter by trade. Does one of these look like your project? Send us a few photos and a short description, and we will reply within 24 hours with an assessment and the next step.',
  },
}

/* Word-level fixes inside project texts: fetch + replace so the surrounding
   copy stays byte-identical. */
const PROJECT_REPLACES: Record<string, [string, string][]> = {
  'project-terrasse-og-haveomraade': [['an exclusive look', 'a premium look']],
  'project-betontrappe-hellerup': [
    ['concrete stair at a private home', 'concrete staircase at a private home'],
    ['the stair’s geometry', 'the staircase’s geometry'],
    ['a solid, handsome stair with', 'a solid, attractive staircase with'],
  ],
}

async function run() {
  for (const [id, set] of Object.entries(SETS)) {
    await client.patch(id).set(set).commit()
    console.log(`✓ ${id}: set ${Object.keys(set).length} fields`)
  }
  for (const [id, pairs] of Object.entries(PROJECT_REPLACES)) {
    const doc = await client.fetch(
      `*[_id == $id][0]{"intro": intro.en, "task": task.en, "result": result.en}`,
      {id},
    )
    const set: Record<string, string> = {}
    for (const [field, value] of Object.entries(doc) as [string, string][]) {
      if (!value) continue
      let next = value
      for (const [from, to] of pairs) next = next.replace(from, to)
      if (next !== value) set[`${field}.en`] = next
    }
    if (Object.keys(set).length) {
      await client.patch(id).set(set).commit()
      console.log(`✓ ${id}: replaced in ${Object.keys(set).join(', ')}`)
    } else {
      console.log(`= ${id}: already up to date`)
    }
  }
}

run()
