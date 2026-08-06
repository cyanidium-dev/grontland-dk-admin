/**
 * ARCHIVED — DO NOT RUN. English locale fields were removed (2026-08 full
 * locale strip). Kept only as history of prior EN copy seeds/patches.
 *
 * Homepage service-card text edits per client spec (2026-07-23,
 * Gront_Land_DK_homepage_EN_edits.md): six cardDesc.en rewrites, plus the
 * Danish Paving card gains terraces + drainage (facts confirmed from the old
 * site — parity with the EN edit). Idempotent: plain `set` patches by slug.
 *
 * Run from CMS/:  npx sanity exec scripts/home-card-texts-2026-07.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-08-15'})

const EDITS: Record<string, {en?: string; da?: string}> = {
  havearbejde: {
    en: 'Decks, garden areas and outdoor spaces designed for practical use, durability and a finished look.',
  },
  belaegningsarbejde: {
    en: 'Driveways, terraces, paths and access areas with a solid base, correct drainage and a durable finish.',
    da: 'Indkørsler, terrasser, stier og adgangsarealer med stærkt underlag, korrekt afvanding og holdbar finish.',
  },
  murerarbejde: {
    en: 'Masonry and façade work for renovations, tiling and structural projects, with a focus on stability, durability and a clean finish.',
  },
  malerservice: {
    en: 'Painting with proper preparation, a clean finish and careful attention to detail.',
  },
  demonteringsarbejde: {
    en: 'Demolition, strip-out and preparatory work before renovation or new construction.',
  },
  rengoringsarbejde: {
    en: 'Post-construction cleaning and general cleaning services for private homes.',
  },
}

async function run() {
  const docs: {_id: string; slug: string; da?: string; en?: string}[] = await client.fetch(
    `*[_type == "service" && slug.current in $slugs]{_id, "slug": slug.current, "da": cardDesc.da, "en": cardDesc.en}`,
    {slugs: Object.keys(EDITS)},
  )
  for (const doc of docs) {
    const edit = EDITS[doc.slug]
    const set: Record<string, string> = {}
    if (edit.en && edit.en !== doc.en) set['cardDesc.en'] = edit.en
    if (edit.da && edit.da !== doc.da) set['cardDesc.da'] = edit.da
    if (!Object.keys(set).length) {
      console.log(`= ${doc.slug}: already up to date`)
      continue
    }
    await client.patch(doc._id).set(set).commit()
    console.log(`✓ ${doc.slug}: set ${Object.keys(set).join(', ')}`)
  }
  const missing = Object.keys(EDITS).filter((s) => !docs.some((d) => d.slug === s))
  if (missing.length) console.warn('! missing service docs:', missing.join(', '))
}

run()
