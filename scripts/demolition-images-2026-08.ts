/**
 * Demolition image pack (Figma Group 8, Aug 2026):
 * - Create galleryCategory-demonteringsarbejde (10 photos)
 * - Point service-demonteringsarbejde at it
 * - Set hero / process / cta / seoText images from Frontend public assets
 *
 * Dry-run:  npx sanity exec scripts/demolition-images-2026-08.ts --with-user-token
 * Apply:    DEMOLITION_IMAGES=1 npx sanity exec scripts/demolition-images-2026-08.ts --with-user-token
 */
import {createReadStream, existsSync} from 'node:fs'
import path from 'node:path'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-08-15'})
const APPLY = process.env.DEMOLITION_IMAGES === '1'

const SERVICE = 'service-demonteringsarbejde'
const CATEGORY = 'galleryCategory-demonteringsarbejde'

function findPublicDir(): string {
  const candidates = [
    path.resolve(__dirname, '../../grontland-dk-frontend/public'),
    path.resolve(__dirname, '../../Frontend/public'),
    'C:/GitHub23/grotland-workspace/Frontend/public',
  ]
  for (const c of candidates) {
    if (existsSync(path.join(c, 'images/services/demonter-hero.jpg'))) return c
  }
  throw new Error(`Frontend public dir not found. Tried:\n${candidates.join('\n')}`)
}

const PUBLIC_DIR = findPublicDir()

let keyCounter = 0
const key = () => `k${(keyCounter++).toString(36).padStart(4, '0')}`
const assetCache = new Map<string, string>()

async function uploadSrc(src: string): Promise<string> {
  const cached = assetCache.get(src)
  if (cached) return cached
  const abs = path.join(PUBLIC_DIR, src.replace(/^\//, ''))
  if (!existsSync(abs)) throw new Error(`Image not found: ${abs}`)
  const asset = await client.assets.upload('image', createReadStream(abs), {
    filename: path.basename(abs),
  })
  assetCache.set(src, asset._id)
  console.log(`  asset ${src} -> ${asset._id}`)
  return asset._id
}

function imageWithAlt(assetId: string, alt: string) {
  return {
    _type: 'imageWithAlt',
    asset: {_type: 'reference', _ref: assetId},
    alt,
  }
}

const GALLERY: {src: string; alt: string}[] = [
  {
    src: '/images/gallery/demonter-1.jpg',
    alt: 'Byggeplads under nedrivning med stillads og maskiner',
  },
  {
    src: '/images/gallery/demonter-2.jpg',
    alt: 'Indvendig strip-out med afskallet puds og blotlagt murværk',
  },
  {
    src: '/images/gallery/demonter-3.jpg',
    alt: 'Håndværker i arbejde under indvendig demontering',
  },
  {
    src: '/images/gallery/demonter-4.jpg',
    alt: 'Nedrivningsaffald og knust materiale på pladsen',
  },
  {
    src: '/images/gallery/demonter-5.jpg',
    alt: 'Rum under demontering med affaldssække ved vindue',
  },
  {
    src: '/images/gallery/demonter-6.jpg',
    alt: 'Tomt rum efter nedtagning klar til næste fag',
  },
  {
    src: '/images/gallery/demonter-7.jpg',
    alt: 'Indvendig nedrivning med blotlagte vægge og gulv',
  },
  {
    src: '/images/gallery/demonter-8.jpg',
    alt: 'Demontering af inventar og overflader i bolig',
  },
  {
    src: '/images/gallery/demonter-9.jpg',
    alt: 'Byggeplads med sorteret affald efter nedtagning',
  },
  {
    src: '/images/gallery/demonter-10.jpg',
    alt: 'Kontrolleret indvendig nedrivning i ældre bolig',
  },
]

const HERO = {
  src: '/images/services/demonter-hero.jpg',
  alt: 'Byggeplads under nedrivning med stillads, containere og gravemaskine',
}
const PROCESS = {
  src: '/images/services/demonter-process.jpg',
  alt: 'Udendørs byggeplads under demontering og klargøring',
}
const CTA = {
  src: '/images/services/demonter-cta.jpg',
  alt: 'Nedrivningsaffald sorteret i bigbags på byggeplads',
}
const SEO = [
  {
    src: '/images/services/demonter-seo-1.jpg',
    alt: 'Indvendig demontering med blotlagt murværk og affald',
  },
  {
    src: '/images/services/demonter-seo-2.jpg',
    alt: 'Rum under strip-out med affaldssække ved vinduesparti',
  },
]

async function main() {
  console.log(`Public: ${PUBLIC_DIR}`)
  console.log(APPLY ? 'Applying…' : 'Dry-run…')

  const photos = []
  for (const g of GALLERY) {
    const id = await uploadSrc(g.src)
    photos.push({_key: key(), ...imageWithAlt(id, g.alt)})
  }

  const heroId = await uploadSrc(HERO.src)
  const processId = await uploadSrc(PROCESS.src)
  const ctaId = await uploadSrc(CTA.src)
  const seoImgs = []
  for (const s of SEO) {
    const id = await uploadSrc(s.src)
    seoImgs.push({_key: key(), ...imageWithAlt(id, s.alt)})
  }

  const categoryDoc = {
    _id: CATEGORY,
    _type: 'galleryCategory',
    key: 'demonteringsarbejde',
    title: 'Demonteringsarbejde',
    description:
      'Billeder fra kontrolleret nedtagning, strip-out og oprydning før renovering.',
    cta: {
      _type: 'ctaLink',
      label: 'Se demonteringsarbejde',
      href: '/ydelser/demonteringsarbejde',
    },
    photos,
    order: 6,
  }

  if (!APPLY) {
    console.log(`Would createOrReplace ${CATEGORY} with ${photos.length} photos`)
    console.log(`Would patch ${SERVICE} galleryCategory + hero/process/cta/seo images`)
    console.log('Set DEMOLITION_IMAGES=1 to apply.')
    return
  }

  await client.createOrReplace(categoryDoc)
  console.log(`  created ${CATEGORY}`)

  await client
    .patch(SERVICE)
    .set({
      galleryCategory: {_type: 'reference', _ref: CATEGORY},
      'hero.image': imageWithAlt(heroId, HERO.alt),
      'process.backgroundImage': imageWithAlt(processId, PROCESS.alt),
      ctaImage: imageWithAlt(ctaId, CTA.alt),
      'seoText.images': seoImgs,
    })
    .commit({visibility: 'async'})
  console.log(`  patched ${SERVICE}`)
  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
