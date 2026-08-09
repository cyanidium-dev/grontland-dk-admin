/**
 * ChatExport_2026-08-09:
 * - Roskilde project (belaegning-ved-bolig): refresh gallery photo_440–447 + hero/card
 * - Murerarbejde gallery: append façade before/after (photo_448 / photo_449) in order
 *
 * Dry-run:  npx sanity exec scripts/chatexport-2026-08-09.ts --with-user-token
 * Apply:    CHATEXPORT_2026_08_09=1 npx sanity exec scripts/chatexport-2026-08-09.ts --with-user-token
 */
import {createReadStream, existsSync, readdirSync} from 'node:fs'
import path from 'node:path'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-08-15'})
const APPLY = process.env.CHATEXPORT_2026_08_09 === '1'

const PROJECT = 'project-belaegning-ved-bolig'
const MURER_CAT = 'galleryCategory-murerarbejde'

function findPhotosDir(): string {
  const candidates = [
    path.resolve(__dirname, '../../Preview/docs/ChatExport_2026-08-09/photos'),
    path.resolve(
      __dirname,
      '../../../grotland-workspace/Preview/docs/ChatExport_2026-08-09/photos',
    ),
    'C:/GitHub23/grotland-workspace/Preview/docs/ChatExport_2026-08-09/photos',
  ]
  for (const c of candidates) {
    if (existsSync(c)) return c
  }
  throw new Error(`ChatExport photos dir not found. Tried:\n${candidates.join('\n')}`)
}

const PHOTOS_DIR = findPhotosDir()

let keyCounter = 0
const key = () => `k${(keyCounter++).toString(36).padStart(4, '0')}`
const assetCache = new Map<string, string>()

function resolvePhoto(num: number): string {
  const files = readdirSync(PHOTOS_DIR).filter(
    (f) => f.startsWith(`photo_${num}@`) && !f.includes('thumb') && f.endsWith('.jpg'),
  )
  if (!files.length) throw new Error(`Missing photo_${num} in ${PHOTOS_DIR}`)
  return path.join(PHOTOS_DIR, files[0])
}

async function uploadNum(num: number): Promise<string> {
  const abs = resolvePhoto(num)
  const cached = assetCache.get(abs)
  if (cached) return cached
  const asset = await client.assets.upload('image', createReadStream(abs), {
    filename: path.basename(abs),
  })
  assetCache.set(abs, asset._id)
  console.log(`  asset photo_${num} -> ${asset._id}`)
  return asset._id
}

function imageWithAlt(assetId: string, alt: string) {
  return {
    _type: 'imageWithAlt',
    asset: {_type: 'reference', _ref: assetId},
    alt,
  }
}

type Kind = 'process' | 'result' | 'before' | 'after'

async function galleryItem(num: number, alt: string, kind: Kind) {
  const assetId = await uploadNum(num)
  return {
    _type: 'projectPhoto',
    _key: key(),
    image: imageWithAlt(assetId, alt),
    kind,
  }
}

const ROSKILDE = {
  cardDesc:
    'Sandstensbelægning, afvanding og terræn ved privat bolig i Roskilde.',
  intro:
    'Vi udførte et komplet udendørs projekt ved en privat bolig i Roskilde med fokus på funktionalitet, afvanding og æstetik.',
  task: 'Projektet blev udført i et terræn med niveauforskelle og direkte nærhed til vand, hvilket stillede krav til korrekt opbygning og dræning.',
  work: [
    'Belægning i sandsten',
    'Klinker i samme materiale for ensartet udtryk',
    'Etablering af drænrender og afvanding',
    'Gangarealer i græsarmering',
    'Støttemure i granit brosten',
  ],
  focus: [
    'Stabil bundopbygning og korrekt fald',
    'Effektiv håndtering af overfladevand',
    'Præcis tilpasning af materialer',
    'Sammenhæng mellem funktion og design',
  ],
  result:
    'Et holdbart og velafbalanceret udeområde, hvor materialer og konstruktion arbejder sammen både teknisk og visuelt.',
  heroAlt: 'Sandstensterrasse med udsigt over vandet ved privat bolig i Roskilde',
  cardAlt: 'Ny sandstensbelægning og terrænarbejde ved bolig i Roskilde',
}

const ROSKILDE_GALLERY: {num: number; kind: Kind; alt: string}[] = [
  {
    num: 440,
    kind: 'process',
    alt: 'Terrænudgravning og støttemur under opbygning i Roskilde',
  },
  {
    num: 441,
    kind: 'result',
    alt: 'Færdig gangsti med linjedræn og granitstøttemur',
  },
  {
    num: 442,
    kind: 'process',
    alt: 'Granitbrosten i støttemur under arbejde ved vand',
  },
  {
    num: 443,
    kind: 'result',
    alt: 'Terrasse, bed og belægning i niveauer ved bolig',
  },
  {
    num: 444,
    kind: 'process',
    alt: 'Udgravning og kantsten under terrænarbejde',
  },
  {
    num: 445,
    kind: 'result',
    alt: 'Sandstensbelægning med integreret afvanding',
  },
  {
    num: 446,
    kind: 'after',
    alt: 'Færdigt udeområde med sandsten og støttemure i Roskilde',
  },
  {
    num: 447,
    kind: 'after',
    alt: 'Sandstensterrasse med udsigt over vandet i Roskilde',
  },
]

const MURER_APPEND: {num: number; alt: string}[] = [
  {num: 448, alt: 'Facade før pudsning — mur med bueåbning under opbygning'},
  {num: 449, alt: 'Facade efter pudsning — færdig pudset mur med bueåbning'},
]

async function patchRoskilde() {
  console.log(`\n${PROJECT}`)
  const gallery = []
  for (const g of ROSKILDE_GALLERY) {
    gallery.push(await galleryItem(g.num, g.alt, g.kind))
  }
  const heroAsset = await uploadNum(447)
  const hero = imageWithAlt(heroAsset, ROSKILDE.heroAlt)
  const card = imageWithAlt(heroAsset, ROSKILDE.cardAlt)

  if (!APPLY) {
    console.log(`  dry-run: gallery ${gallery.length} + hero/card photo_447`)
    return
  }

  await client
    .patch(PROJECT)
    .set({
      cardDesc: ROSKILDE.cardDesc,
      intro: ROSKILDE.intro,
      task: ROSKILDE.task,
      work: ROSKILDE.work,
      focus: ROSKILDE.focus,
      result: ROSKILDE.result,
      gallery,
      heroImage: hero,
      cardImage: card,
    })
    .commit({visibility: 'async'})
  console.log('  applied')
}

async function appendMurerGallery() {
  console.log(`\n${MURER_CAT}`)
  const doc = await client.fetch<{
    photos?: {_key?: string; alt?: string; asset?: {_ref?: string}}[]
  } | null>(`*[_id == $id][0]{photos}`, {id: MURER_CAT})

  const existing = doc?.photos ?? []
  const hasBefore = existing.some((p) => /før pudsning/i.test(p.alt ?? ''))
  const hasAfter = existing.some((p) => /efter pudsning/i.test(p.alt ?? ''))
  if (hasBefore && hasAfter) {
    console.log('  façade before/after already present')
    return
  }

  const append = []
  for (const m of MURER_APPEND) {
    const assetId = await uploadNum(m.num)
    append.push({_key: key(), ...imageWithAlt(assetId, m.alt)})
  }

  const photos = [...existing, ...append]
  if (!APPLY) {
    console.log(
      `  dry-run: append before+after (photos ${existing.length} → ${photos.length})`,
    )
    return
  }

  await client.patch(MURER_CAT).set({photos}).commit({visibility: 'async'})
  console.log(`  applied (${existing.length} → ${photos.length})`)
}

async function main() {
  console.log(APPLY ? 'APPLY mode' : 'Dry-run mode (set CHATEXPORT_2026_08_09=1 to apply)')
  console.log(`Photos dir: ${PHOTOS_DIR}`)

  await patchRoskilde()
  await appendMurerGallery()

  console.log('\nDone.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
