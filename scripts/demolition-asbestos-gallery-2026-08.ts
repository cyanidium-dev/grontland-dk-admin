/**
 * Append asbestos bigbags photo to galleryCategory-demonteringsarbejde.
 *
 * Dry-run:  npx sanity exec scripts/demolition-asbestos-gallery-2026-08.ts --with-user-token
 * Apply:    DEMOLITION_ASBESTOS_GALLERY=1 npx sanity exec scripts/demolition-asbestos-gallery-2026-08.ts --with-user-token
 */
import {createReadStream, existsSync} from 'node:fs'
import path from 'node:path'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-08-15'})
const APPLY = process.env.DEMOLITION_ASBESTOS_GALLERY === '1'
const CATEGORY = 'galleryCategory-demonteringsarbejde'

const PHOTO = {
  src: '/images/gallery/demonter-11.jpg',
  alt: 'Asbestaffald i mærkede bigbags efter kontrolleret nedtagning',
}

function findPublicDir(): string {
  const candidates = [
    path.resolve(__dirname, '../../grontland-dk-frontend/public'),
    path.resolve(__dirname, '../../Frontend/public'),
    'C:/GitHub23/grotland-workspace/Frontend/public',
  ]
  for (const c of candidates) {
    if (existsSync(path.join(c, PHOTO.src.replace(/^\//, '')))) return c
  }
  throw new Error(`demonter-11.jpg not found under public. Tried:\n${candidates.join('\n')}`)
}

const PUBLIC_DIR = findPublicDir()

async function main() {
  console.log(`Public: ${PUBLIC_DIR}`)
  console.log(APPLY ? 'APPLY mode' : 'Dry-run mode (set DEMOLITION_ASBESTOS_GALLERY=1 to apply)')

  const doc = await client.fetch<{
    photos?: {_key?: string; alt?: string}[]
  } | null>(`*[_id == $id][0]{photos}`, {id: CATEGORY})

  const existing = doc?.photos ?? []
  if (existing.some((p) => /asbest/i.test(p.alt ?? ''))) {
    console.log('  asbestos gallery photo already present — skip')
    return
  }

  if (!APPLY) {
    console.log(`  dry-run: photos ${existing.length} → ${existing.length + 1} (+ ${PHOTO.src})`)
    return
  }

  const abs = path.join(PUBLIC_DIR, PHOTO.src.replace(/^\//, ''))
  const asset = await client.assets.upload('image', createReadStream(abs), {
    filename: path.basename(abs),
  })
  console.log(`  asset ${PHOTO.src} -> ${asset._id}`)

  const next = [
    ...existing,
    {
      _key: `k${Date.now().toString(36)}`,
      _type: 'imageWithAlt',
      asset: {_type: 'reference', _ref: asset._id},
      alt: PHOTO.alt,
    },
  ]

  await client.patch(CATEGORY).set({photos: next}).commit({visibility: 'async'})
  console.log(`  applied (${existing.length} → ${next.length})`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
