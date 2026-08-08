/**
 * Projects chat packs (client Aug 2026):
 * - ARC Amager: text only (hero/gallery unchanged — task #10)
 * - Hellerup: text + replace gallery from photo_412–419; hero → after shot
 * - Roskilde (belaegning-ved-bolig): text + replace gallery from photo_197–204
 * - Façade: append before/after (photo_69 / photo_439)
 * - Skodsborg: create project-totalrenovering-skodsborg + wire turnkey cases
 *
 * Dry-run:  npx sanity exec scripts/projects-chat-packs-2026-08.ts --with-user-token
 * Apply:    PROJECTS_CHAT_PACKS=1 npx sanity exec scripts/projects-chat-packs-2026-08.ts --with-user-token
 */
import {createReadStream, existsSync, readdirSync} from 'node:fs'
import path from 'node:path'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-08-15'})
const APPLY = process.env.PROJECTS_CHAT_PACKS === '1'

function findPhotosDir(): string {
  const candidates = [
    path.resolve(__dirname, '../../Preview/docs/ChatExport_2026-08-05/photos'),
    path.resolve(
      __dirname,
      '../../../grotland-workspace/Preview/docs/ChatExport_2026-08-05/photos',
    ),
    'C:/GitHub23/grotland-workspace/Preview/docs/ChatExport_2026-08-05/photos',
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

async function uploadAbs(abs: string): Promise<string> {
  const cached = assetCache.get(abs)
  if (cached) return cached
  if (!existsSync(abs)) throw new Error(`Image not found: ${abs}`)
  const asset = await client.assets.upload('image', createReadStream(abs), {
    filename: path.basename(abs),
  })
  assetCache.set(abs, asset._id)
  console.log(`  asset ${path.basename(abs)} -> ${asset._id}`)
  return asset._id
}

async function uploadNum(num: number): Promise<string> {
  return uploadAbs(resolvePhoto(num))
}

function imageWithAlt(assetId: string, alt: string) {
  return {
    _type: 'imageWithAlt',
    asset: {_type: 'reference', _ref: assetId},
    alt,
  }
}

async function galleryItem(
  num: number,
  alt: string,
  kind: 'process' | 'result' | 'before' | 'after',
) {
  const assetId = await uploadNum(num)
  return {
    _type: 'projectPhoto',
    _key: key(),
    image: imageWithAlt(assetId, alt),
    kind,
  }
}

const refItem = (id: string) => ({
  _type: 'reference',
  _ref: id,
  _key: key(),
})

// ---- copy ------------------------------------------------------------------

const ARC = {
  cardDesc:
    'Belægning og afvanding som underentreprise ved ARC Amager Ressourcecenter — tæt samarbejde med hovedentreprenør.',
  intro:
    'Som underentreprenør leverede vi belægning og afvanding på ARC Amager Ressourcecenter.',
  task: 'Opgaven krævede korrekt fald, præcis opmåling og stabil bundopbygning i samarbejde med hovedentreprenør og øvrige fag på pladsen.',
  work: [
    'Etablering af dræn- og afvandingssystemer',
    'Montering af linjedræn og brønde',
    'Forberedelse af bundopbygning',
    'Udlægning af betonbelægning',
  ],
  focus: [
    'Korrekt fald og afvanding',
    'Præcis opmåling og udførelse',
    'Stabil, holdbar opbygning',
  ],
  result:
    'Arbejdet blev koordineret løbende på pladsen, så belægning og afvanding blev afleveret korrekt og til tiden.',
}

const HELLERUP = {
  cardDesc:
    'Renovering af udvendig betontrappe i Hellerup — ny geometri, støbning og et ensartet, holdbart udtryk.',
  intro:
    'Komplet renovering af en slidt betontrappe ved privat bolig i Hellerup.',
  task: 'Den gamle trappe var ujævn og nedslidt. Vi genopbyggede geometri og overflader med præcise trinmål, tilpasset husets stil.',
  work: [
    'Forberedelse og rensning af eksisterende beton',
    'Ny forskalling til trin og sider',
    'Reparation og nivellering af konstruktionen',
    'Støbning og formgivning af nye trin',
    'Efterbehandling til et ensartet resultat',
  ],
  focus: [
    'Præcis geometri og ens trinmål',
    'Stabil konstruktion',
    'Visuel integration med huset',
  ],
  result:
    'En solid, ensartet trappe med moderne udtryk, der passer til boligen i Hellerup.',
  heroAlt: 'Færdig renoveret udvendig betontrappe ved bolig i Hellerup',
}

const ROSKILDE = {
  cardDesc:
    'Sandstensbelægning, afvanding og terræn ved privat bolig i Roskilde.',
  intro:
    'Udendørs projekt i Roskilde med belægning, afvanding og terrænarbejde.',
  task: 'Niveauforskelle og nærhed til vand krævede stabil bund, dræn og et sammenhængende materialeudtryk.',
  work: [
    'Belægning i sandsten',
    'Klinker i samme materiale',
    'Drænrender og afvanding',
    'Gangarealer i græsarmering',
    'Støttemure i granit brosten',
  ],
  focus: [
    'Stabil bund og korrekt fald',
    'Håndtering af overfladevand',
    'Præcis materialetilpasning',
  ],
  result:
    'Et holdbart udeområde, hvor belægning, dræn og terræn arbejder sammen teknisk og visuelt.',
}

const SKODSBORG = {
  title: 'Totalrenovering af villa',
  slug: 'totalrenovering-skodsborg',
  location: 'Skodsborg',
  objectType: 'Privat bolig',
  category: 'private' as const,
  serviceLabel: 'Totalentreprise',
  cardDesc:
    'Indvendig totalrenovering af villa i Skodsborg — gulve, snedkerløsninger, vinkælder, badeværelser, køkken og bryggers.',
  seoTitle: 'Totalrenovering af villa i Skodsborg | Grønt Land DK',
  seoDescription:
    'Totalrenovering af villa i Skodsborg: massive trægulve, snedkerløsninger, vinkælder, naturstensbadeværelser, køkken og bryggers — Grønt Land DK.',
  intro:
    'Vi totalrenoverede en villa i Skodsborg indvendigt som samlet entreprise med én plan og én ansvarlig kontakt.',
  task: 'Bygherren ønskede en gennemgående indvendig fornyelse: gulve, snedkerarbejde, vådrum, køkken/bryggers og særlige rum — uden selv at styre flere faggrupper.',
  work: [
    'Nye gulve i massivt træ',
    'Specialdesignede snedkerløsninger og skabe',
    'Vinkælder med integreret belysning',
    'Badeværelser i natursten',
    'Nyt køkken og bryggers',
    'Lofter med indbyggede spots',
  ],
  focus: [
    'Én plan på tværs af fag',
    'Snedkerdetaljer og særlige rum',
    'Indflytningsklart resultat',
  ],
  result:
    'Villaen blev afleveret med sammenhængende indvendige overflader, specialsnedkeri og vådrum/køkken klar til brug.',
  facts: [
    {label: 'Lokation', value: 'Skodsborg'},
    {label: 'Type', value: 'Privat bolig'},
    {label: 'Fag', value: 'Totalentreprise'},
    {label: 'Omfang', value: 'Indvendig totalrenovering'},
  ],
  heroAlt: 'Totalrenoveret villa i Skodsborg — indvendigt resultat',
  cardAlt: 'Indvendig totalrenovering af villa i Skodsborg',
}

type Kind = 'process' | 'result' | 'before' | 'after'

/** Hellerup 412–419 (no 416): early process, late after. */
const HELLERUP_GALLERY: {num: number; kind: Kind; alt: string}[] = [
  {num: 412, kind: 'process', alt: 'Betontrappe under renovering i Hellerup'},
  {num: 413, kind: 'process', alt: 'Forskalling og opbygning af trin i Hellerup'},
  {num: 414, kind: 'process', alt: 'Støbning af nye trin under arbejde'},
  {num: 415, kind: 'process', alt: 'Trappe under opbygning ved privat bolig'},
  {num: 417, kind: 'after', alt: 'Nye betontrin efter støbning i Hellerup'},
  {num: 418, kind: 'after', alt: 'Færdig overflade på renoveret trappe'},
  {num: 419, kind: 'after', alt: 'Færdig renoveret udvendig trappe i Hellerup'},
]

/** Roskilde 197–204: process → result/after. */
const ROSKILDE_GALLERY: {num: number; kind: Kind; alt: string}[] = [
  {num: 197, kind: 'process', alt: 'Terræn og belægning under opbygning i Roskilde'},
  {num: 198, kind: 'process', alt: 'Bundopbygning og afvanding under arbejde'},
  {num: 199, kind: 'process', alt: 'Udlægning af sandstensbelægning'},
  {num: 200, kind: 'process', alt: 'Belægning og terræn undervejs'},
  {num: 201, kind: 'result', alt: 'Sandstensbelægning ved bolig i Roskilde'},
  {num: 202, kind: 'result', alt: 'Afvanding og belægning i sammenhæng'},
  {num: 203, kind: 'after', alt: 'Færdigt udeområde med sandsten i Roskilde'},
  {num: 204, kind: 'after', alt: 'Afleveret belægning og terræn ved bolig'},
]

/** Skodsborg 254–263: process then result. */
const SKODSBORG_GALLERY: {num: number; kind: Kind; alt: string}[] = [
  {num: 254, kind: 'process', alt: 'Totalrenovering undervejs i villa Skodsborg'},
  {num: 255, kind: 'process', alt: 'Indvendigt arbejde under renovering'},
  {num: 256, kind: 'process', alt: 'Gulve og snedkerarbejde under opbygning'},
  {num: 257, kind: 'process', alt: 'Vådrum og overflader under arbejde'},
  {num: 258, kind: 'process', alt: 'Køkken og bryggers under renovering'},
  {num: 259, kind: 'result', alt: 'Færdigt rum efter totalrenovering i Skodsborg'},
  {num: 260, kind: 'result', alt: 'Snedkerløsninger i renoveret villa'},
  {num: 261, kind: 'result', alt: 'Indvendigt resultat — Skodsborg villa'},
  {num: 262, kind: 'after', alt: 'Afleveret indvendig renovering i Skodsborg'},
  {num: 263, kind: 'after', alt: 'Færdig totalrenoveret villa i Skodsborg'},
]

async function patchArc() {
  const id = 'project-belaegning-arc-amager'
  console.log(`\n${id} (text only)`)
  if (!APPLY) {
    console.log('  dry-run: would set cardDesc/intro/task/work/focus/result')
    return
  }
  await client
    .patch(id)
    .set({
      cardDesc: ARC.cardDesc,
      intro: ARC.intro,
      task: ARC.task,
      work: ARC.work,
      focus: ARC.focus,
      result: ARC.result,
    })
    .commit({visibility: 'async'})
  console.log('  applied')
}

async function patchHellerup() {
  const id = 'project-betontrappe-hellerup'
  console.log(`\n${id}`)
  const gallery = []
  for (const g of HELLERUP_GALLERY) {
    gallery.push(await galleryItem(g.num, g.alt, g.kind))
  }
  const heroAsset = await uploadNum(419)
  const hero = imageWithAlt(heroAsset, HELLERUP.heroAlt)
  if (!APPLY) {
    console.log(`  dry-run: gallery ${gallery.length} + hero photo_419`)
    return
  }
  await client
    .patch(id)
    .set({
      cardDesc: HELLERUP.cardDesc,
      intro: HELLERUP.intro,
      task: HELLERUP.task,
      work: HELLERUP.work,
      focus: HELLERUP.focus,
      result: HELLERUP.result,
      gallery,
      heroImage: hero,
      cardImage: hero,
    })
    .commit({visibility: 'async'})
  console.log('  applied')
}

async function patchRoskilde() {
  const id = 'project-belaegning-ved-bolig'
  console.log(`\n${id}`)
  const gallery = []
  for (const g of ROSKILDE_GALLERY) {
    gallery.push(await galleryItem(g.num, g.alt, g.kind))
  }
  if (!APPLY) {
    console.log(`  dry-run: gallery ${gallery.length} (hero unchanged)`)
    return
  }
  await client
    .patch(id)
    .set({
      cardDesc: ROSKILDE.cardDesc,
      intro: ROSKILDE.intro,
      task: ROSKILDE.task,
      work: ROSKILDE.work,
      focus: ROSKILDE.focus,
      result: ROSKILDE.result,
      gallery,
    })
    .commit({visibility: 'async'})
  console.log('  applied')
}

async function patchFacade() {
  const id = 'project-facadeopgave'
  console.log(`\n${id}`)
  const doc = await client.fetch<{gallery?: {_key?: string; kind?: string; image?: {alt?: string}}[]} | null>(
    `*[_id == $id][0]{gallery}`,
    {id},
  )
  const existing = doc?.gallery ?? []
  const hasBefore = existing.some((g) => g.kind === 'before' && /før renovering/i.test(g.image?.alt ?? ''))
  const hasAfter = existing.some((g) => g.kind === 'after' && /efter renovering/i.test(g.image?.alt ?? ''))
  if (hasBefore && hasAfter) {
    console.log('  façade before/after already present')
    return
  }
  const before = await galleryItem(
    69,
    'Facade før renovering — privat bolig',
    'before',
  )
  const after = await galleryItem(
    439,
    'Facade efter renovering — privat bolig',
    'after',
  )
  const gallery = [...existing, before, after]
  if (!APPLY) {
    console.log(`  dry-run: append before+after (gallery ${existing.length} → ${gallery.length})`)
    return
  }
  await client.patch(id).set({gallery}).commit({visibility: 'async'})
  console.log('  applied')
}

async function createSkodsborg() {
  const id = 'project-totalrenovering-skodsborg'
  console.log(`\n${id}`)
  const gallery = []
  for (const g of SKODSBORG_GALLERY) {
    gallery.push(await galleryItem(g.num, g.alt, g.kind))
  }
  const heroAsset = await uploadNum(263)
  const hero = imageWithAlt(heroAsset, SKODSBORG.heroAlt)
  const card = imageWithAlt(heroAsset, SKODSBORG.cardAlt)

  const doc = {
    _id: id,
    _type: 'project',
    title: SKODSBORG.title,
    slug: {_type: 'slug', current: SKODSBORG.slug},
    location: SKODSBORG.location,
    objectType: SKODSBORG.objectType,
    category: SKODSBORG.category,
    primaryService: {_type: 'reference', _ref: 'service-totalentreprise'},
    serviceLabel: SKODSBORG.serviceLabel,
    services: [refItem('service-totalentreprise')],
    seo: {
      _type: 'seoMeta',
      title: SKODSBORG.seoTitle,
      description: SKODSBORG.seoDescription,
    },
    cardDesc: SKODSBORG.cardDesc,
    cardImage: card,
    heroImage: hero,
    intro: SKODSBORG.intro,
    task: SKODSBORG.task,
    work: SKODSBORG.work,
    focus: SKODSBORG.focus,
    result: SKODSBORG.result,
    facts: SKODSBORG.facts.map((f) => ({
      _type: 'fact',
      _key: key(),
      label: f.label,
      value: f.value,
    })),
    gallery,
    related: [
      refItem('project-betontrappe-hellerup'),
      refItem('project-facadeopgave'),
      refItem('project-terrasse-og-haveomraade'),
    ],
  }

  if (!APPLY) {
    console.log(`  dry-run: createOrReplace with gallery ${gallery.length}`)
    return
  }
  await client.createOrReplace(doc)
  console.log('  created/replaced')

  const te = await client.fetch<{cases?: {_ref: string; _key?: string}[]} | null>(
    `*[_id == "service-totalentreprise"][0]{cases}`,
  )
  const cases = te?.cases ?? []
  if (!cases.some((c) => c._ref === id)) {
    await client
      .patch('service-totalentreprise')
      .set({cases: [refItem(id), ...cases]})
      .commit({visibility: 'async'})
    console.log('  wired into service-totalentreprise.cases')
  } else {
    console.log('  already in service-totalentreprise.cases')
  }
}

async function main() {
  console.log(APPLY ? 'APPLY mode' : 'Dry-run mode (set PROJECTS_CHAT_PACKS=1 to apply)')
  console.log(`Photos dir: ${PHOTOS_DIR}`)

  await patchArc()
  await patchHellerup()
  await patchRoskilde()
  await patchFacade()
  await createSkodsborg()

  console.log('\nDone.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
