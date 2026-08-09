/**
 * Replace wrong ARC project hero/card (fundament placeholder) with
 * ChatExport photo_211 — drainage/linjedræn on site (task #10).
 *
 * Dry-run:  npx sanity exec scripts/arc-hero-2026-08.ts --with-user-token
 * Apply:    ARC_HERO=1 npx sanity exec scripts/arc-hero-2026-08.ts --with-user-token
 */
import {createReadStream, existsSync, readdirSync} from 'node:fs'
import path from 'node:path'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-08-15'})
const APPLY = process.env.ARC_HERO === '1'
const DOC = 'project-belaegning-arc-amager'

const ALT =
  'Linjedræn og afvanding under etablering på ARC Amager byggeplads'

function findPhoto211(): string {
  const candidates = [
    path.resolve(__dirname, '../../Preview/docs/ChatExport_2026-08-05/photos'),
    path.resolve(
      __dirname,
      '../../../grotland-workspace/Preview/docs/ChatExport_2026-08-05/photos',
    ),
    'C:/GitHub23/grotland-workspace/Preview/docs/ChatExport_2026-08-05/photos',
  ]
  for (const dir of candidates) {
    if (!existsSync(dir)) continue
    const files = readdirSync(dir).filter(
      (f) => f.startsWith('photo_211@') && !f.includes('thumb') && f.endsWith('.jpg'),
    )
    if (files.length) return path.join(dir, files[0])
  }
  // Fallback: committed public copy
  const pub = [
    path.resolve(__dirname, '../../grontland-dk-frontend/public/images/cases/arc-amager-hero.jpg'),
    path.resolve(__dirname, '../../Frontend/public/images/cases/arc-amager-hero.jpg'),
  ]
  for (const p of pub) {
    if (existsSync(p)) return p
  }
  throw new Error('photo_211 / arc-amager-hero.jpg not found')
}

async function main() {
  const abs = findPhoto211()
  console.log(`Source: ${abs}`)
  if (!APPLY) {
    console.log('Dry-run: would upload and set heroImage + cardImage')
    console.log('Set ARC_HERO=1 to apply.')
    return
  }
  const asset = await client.assets.upload('image', createReadStream(abs), {
    filename: path.basename(abs),
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
  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
