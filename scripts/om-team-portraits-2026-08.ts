/**
 * Replace OmTeam work-photo placeholders with old-site portraits
 * (grontland.dk/assets/team/{oleg,andrej,aleksandr}.jpg).
 *
 * Dry-run:  npx sanity exec scripts/om-team-portraits-2026-08.ts --with-user-token
 * Apply:    OM_TEAM_PORTRAITS=1 npx sanity exec scripts/om-team-portraits-2026-08.ts --with-user-token
 */
import {createReadStream, existsSync} from 'node:fs'
import path from 'node:path'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-08-15'})
const APPLY = process.env.OM_TEAM_PORTRAITS === '1'
const DOC = 'omOsPage'

const MEMBERS = [
  {name: 'Oleg', file: 'oleg.jpg', alt: 'Oleg — ansvarlig for finish og tømrerarbejde'},
  {name: 'Andrej', file: 'andrej.jpg', alt: 'Andrej — ansvarlig for belægning og beton'},
  {name: 'Aleksandr', file: 'aleksandr.jpg', alt: 'Aleksandr — ansvarlig for landskabsarbejde'},
] as const

function findTeamDir(): string {
  const candidates = [
    path.resolve(__dirname, '../../grontland-dk-frontend/public/images/team'),
    path.resolve(__dirname, '../../Frontend/public/images/team'),
    'C:/GitHub23/grotland-workspace/Frontend/public/images/team',
  ]
  for (const c of candidates) {
    if (existsSync(path.join(c, 'oleg.jpg'))) return c
  }
  throw new Error(`team portraits not found. Tried:\n${candidates.join('\n')}`)
}

async function main() {
  const dir = findTeamDir()
  console.log(`Team dir: ${dir}`)
  console.log(APPLY ? 'APPLY mode' : 'Dry-run (set OM_TEAM_PORTRAITS=1 to apply)')

  const doc = await client.fetch<{
    team?: {h2?: string; intro?: string; members?: {_key: string; name?: string; image?: unknown}[]}
  } | null>(`*[_id == $id][0]{team}`, {id: DOC})

  const members = doc?.team?.members ?? []
  console.log(`  CMS members: ${members.length}`)
  for (const m of members) console.log(`    - ${m.name}`)

  if (!members.length) {
    console.log('  no team.members on omOsPage — Frontend still uses constants; skip CMS')
    return
  }

  const byName = new Map(MEMBERS.map((m) => [m.name, m]))
  const nextMembers = []
  for (const m of members) {
    const spec = m.name ? byName.get(m.name as (typeof MEMBERS)[number]['name']) : undefined
    if (!spec) {
      console.log(`  keep (no portrait map): ${m.name}`)
      nextMembers.push(m)
      continue
    }
    const abs = path.join(dir, spec.file)
    if (!APPLY) {
      console.log(`  would set ${m.name} → ${spec.file}`)
      nextMembers.push(m)
      continue
    }
    const asset = await client.assets.upload('image', createReadStream(abs), {
      filename: spec.file,
    })
    console.log(`  ${m.name} → ${asset._id}`)
    nextMembers.push({
      ...m,
      image: {
        _type: 'imageWithAlt',
        asset: {_type: 'reference', _ref: asset._id},
        alt: spec.alt,
      },
    })
  }

  if (!APPLY) return

  await client
    .patch(DOC)
    .set({'team.members': nextMembers})
    .commit({visibility: 'async'})
  console.log('  patched omOsPage.team.members')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
