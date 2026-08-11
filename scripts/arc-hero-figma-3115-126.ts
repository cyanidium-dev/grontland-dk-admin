/**
 * Swap ARC project hero/card to Figma #3115:126 (photo_2026-08-09 15.37.00)
 * — linjedræn close-up with tools (no workers). Replaces photo_211 workers shot.
 *
 * Dry-run:  npx sanity exec scripts/arc-hero-figma-3115-126.ts --with-user-token
 * Apply:    ARC_HERO_FIGMA=1 npx sanity exec scripts/arc-hero-figma-3115-126.ts --with-user-token
 */
import {createReadStream, existsSync} from 'node:fs'
import path from 'node:path'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-08-15'})
const APPLY = process.env.ARC_HERO_FIGMA === '1'
const DOC = 'project-belaegning-arc-amager'

const ALT =
  'Linjedræn og afvanding under etablering på ARC Amager byggeplads'

function findHero(): string {
  const candidates = [
    path.resolve(__dirname, '../../grontland-dk-frontend/public/images/cases/arc-amager-hero.jpg'),
    path.resolve(__dirname, '../../Frontend/public/images/cases/arc-amager-hero.jpg'),
    'C:/GitHub23/grotland-workspace/Frontend/public/images/cases/arc-amager-hero.jpg',
  ]
  for (const p of candidates) {
    if (existsSync(p)) return p
  }
  throw new Error('arc-amager-hero.jpg not found under Frontend/public/images/cases')
}

async function main() {
  const abs = findHero()
  console.log(`Source: ${abs}`)
  console.log(APPLY ? 'APPLY mode' : 'Dry-run (set ARC_HERO_FIGMA=1 to apply)')

  if (!APPLY) {
    console.log('Would upload and set heroImage + cardImage')
    return
  }

  const asset = await client.assets.upload('image', createReadStream(abs), {
    filename: 'arc-amager-hero.jpg',
  })
  console.log(`  asset -> ${asset._id}`)

  const image = {
    _type: 'imageWithAlt',
    asset: {_type: 'reference', _ref: asset._id},
    alt: ALT,
  }

  await client
    .patch(DOC)
    .set({
      heroImage: image,
      cardImage: image,
    })
    .commit({visibility: 'async'})
  console.log(`  patched ${DOC}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
