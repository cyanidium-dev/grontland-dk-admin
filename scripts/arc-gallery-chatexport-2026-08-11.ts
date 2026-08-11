/**
 * Replace ARC project gallery (wrong private/rebar placeholders) with
 * ChatExport_2026-08-11 photo_456–462. Hero/card left as-is (Figma #3115:126).
 * Resultat block uses gallery kind === "result" → photo_460 (finished pavers).
 *
 * Dry-run:  npx sanity exec scripts/arc-gallery-chatexport-2026-08-11.ts --with-user-token
 * Apply:    ARC_GALLERY_2026_08_11=1 npx sanity exec scripts/arc-gallery-chatexport-2026-08-11.ts --with-user-token
 */
import {createReadStream, existsSync} from 'node:fs'
import path from 'node:path'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-08-15'})
const APPLY = process.env.ARC_GALLERY_2026_08_11 === '1'
const DOC = 'project-belaegning-arc-amager'

type Kind = 'process' | 'result'

const GALLERY: {file: string; kind: Kind; alt: string}[] = [
  {
    file: 'arc-amager-1.jpg',
    kind: 'process',
    alt: 'Team ved linjedræn og laser under afvanding på ARC Amager',
  },
  {
    file: 'arc-amager-2.jpg',
    kind: 'process',
    alt: 'Brønde og drænkomponenter under etablering i udgravning',
  },
  {
    file: 'arc-amager-3.jpg',
    kind: 'process',
    alt: 'Hydrotec-linjerender og minigraver på ARC Amager byggeplads',
  },
  {
    file: 'arc-amager-4.jpg',
    kind: 'process',
    alt: 'Bundopbygning i sand med Amager Bakke i baggrunden',
  },
  {
    file: 'arc-amager-5.jpg',
    kind: 'result',
    alt: 'Betonbelægning med integreret metal-linjeræn på ARC Amager',
  },
  {
    file: 'arc-amager-6.jpg',
    kind: 'process',
    alt: 'Langt linjedræn langs forberedt bund til belægning',
  },
  {
    file: 'arc-amager-7.jpg',
    kind: 'process',
    alt: 'Linjedræn og afvanding under etablering på ARC Amager byggeplads',
  },
]

function findCasesDir(): string {
  const candidates = [
    path.resolve(__dirname, '../../grontland-dk-frontend/public/images/cases'),
    path.resolve(__dirname, '../../Frontend/public/images/cases'),
    'C:/GitHub23/grotland-workspace/Frontend/public/images/cases',
  ]
  for (const c of candidates) {
    if (existsSync(path.join(c, GALLERY[0].file))) return c
  }
  throw new Error(`arc-amager-1.jpg not found. Tried:\n${candidates.join('\n')}`)
}

let keyCounter = 0
const key = () => `k${(keyCounter++).toString(36).padStart(4, '0')}`

async function main() {
  const casesDir = findCasesDir()
  console.log(`Cases: ${casesDir}`)
  console.log(APPLY ? 'APPLY mode' : 'Dry-run (set ARC_GALLERY_2026_08_11=1 to apply)')

  const gallery = []
  for (const g of GALLERY) {
    const abs = path.join(casesDir, g.file)
    if (!existsSync(abs)) throw new Error(`Missing ${abs}`)
    if (!APPLY) {
      console.log(`  would upload ${g.file} (${g.kind}) — ${g.alt}`)
      continue
    }
    const asset = await client.assets.upload('image', createReadStream(abs), {
      filename: g.file,
    })
    console.log(`  asset ${g.file} -> ${asset._id}`)
    gallery.push({
      _type: 'projectPhoto',
      _key: key(),
      image: {
        _type: 'imageWithAlt',
        asset: {_type: 'reference', _ref: asset._id},
        alt: g.alt,
      },
      kind: g.kind,
    })
  }

  if (!APPLY) {
    console.log(`  dry-run: gallery → ${GALLERY.length} (result = arc-amager-5.jpg)`)
    return
  }

  await client.patch(DOC).set({gallery}).commit({visibility: 'async'})
  console.log(`  patched ${DOC} gallery (${gallery.length} photos)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
