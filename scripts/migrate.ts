/**
 * Phase 3 migration: pours the Frontend's typed constants into the dataset.
 * Danish plain strings only (locales flattened 2026-08). Idempotent:
 * deterministic _ids + createOrReplace; Sanity dedupes identical image
 * uploads by content hash.
 *
 * Run from CMS/:  npx sanity exec scripts/migrate.ts --with-user-token
 */
import {createReadStream, existsSync} from 'node:fs'
import path from 'node:path'
import {getCliClient} from 'sanity/cli'

// ---- Frontend constants (direct TS imports; esbuild resolves the
// Frontend's own "@/*" tsconfig alias) -------------------------------------
import {
  ABOUT,
  AUDIENCES,
  FAQ,
  FOOTER,
  GALLERY,
  HERO,
  ONETEAM,
  PROCESS,
  QUOTE_FORM,
  SEOTEXT,
  SERVICES,
} from '../../grontland-dk-frontend/src/constants/home'
import {GALLERY_PHOTOS} from '../../grontland-dk-frontend/src/constants/gallery'
import {GALLERI_PAGE, GALLERY_SECTIONS} from '../../grontland-dk-frontend/src/constants/galleriPage'
import {PROJECTS, PROJECTS_LIST} from '../../grontland-dk-frontend/src/constants/projects'
import {SERVICES_PAGES} from '../../grontland-dk-frontend/src/constants/services'
import {YDELSER_INDEX} from '../../grontland-dk-frontend/src/constants/ydelserIndex'
import {
  OM_CTA,
  OM_GALLERY,
  OM_HERO,
  OM_INTRO,
  OM_META,
  OM_ONEPLAN,
  OM_TEAM,
  OM_VALUES,
} from '../../grontland-dk-frontend/src/constants/om'
import {
  KONTAKT_AUDIENCES,
  KONTAKT_FORM,
  KONTAKT_HERO,
  KONTAKT_INFO,
  KONTAKT_META,
  KONTAKT_STEPS,
} from '../../grontland-dk-frontend/src/constants/kontakt'
import {
  PRIVATE_BENEFITS,
  PRIVATE_CTA,
  PRIVATE_FAQ,
  PRIVATE_HERO,
  PRIVATE_META,
  PRIVATE_PROJECTS,
  PRIVATE_TYPES,
} from '../../grontland-dk-frontend/src/constants/privatePage'
import {
  B2B_CASE,
  B2B_CTA,
  B2B_EXPECTATIONS,
  B2B_HERO,
  B2B_META,
  B2B_MODEL,
  B2B_SCENARIOS,
  B2B_TRADES,
  B2B_WHY,
} from '../../grontland-dk-frontend/src/constants/b2b'

const client = getCliClient({apiVersion: '2025-08-15'})
// NOTE: the workspace's CMS/ and Frontend/ folders are junctions; from the
// repo's REAL location the frontend sibling is grontland-dk-frontend.
const PUBLIC_DIR = path.resolve(__dirname, '../../grontland-dk-frontend/public')

// ---- helpers ---------------------------------------------------------------
let keyCounter = 0
const key = () => `k${(keyCounter++).toString(36).padStart(4, '0')}`

const ls = (da: string) => da
const lt = (da: string) => da
const lsItem = (da: string) => da
const ref = (id: string) => ({_type: 'reference', _ref: id})
const refItem = (id: string) => ({...ref(id), _key: key()})
const slugOf = (href: string) => href.split('/').filter(Boolean).pop() as string

type Cta = {label: string; href: string}
const cta = (c: Cta) => ({_type: 'ctaLink', label: ls(c.label), href: c.href})
const ctaItem = (c: Cta) => ({...cta(c), _key: key()})

const seo = (title: string, description: string) => ({
  _type: 'seoMeta',
  title: ls(title),
  description: lt(description),
})

const fact = (f: {label: string; value: string}) => ({
  _type: 'fact',
  _key: key(),
  label: ls(f.label),
  value: ls(f.value),
})

// image upload with cache (path -> asset id)
const assetCache = new Map<string, string>()
async function uploadImage(src: string): Promise<string> {
  const cached = assetCache.get(src)
  if (cached) return cached
  const abs = path.join(PUBLIC_DIR, src)
  if (!existsSync(abs)) throw new Error(`Image not found: ${abs}`)
  const asset = await client.assets.upload('image', createReadStream(abs), {
    filename: path.basename(src),
  })
  assetCache.set(src, asset._id)
  console.log(`  asset ${src} -> ${asset._id}`)
  return asset._id
}

type Img = {src: string; alt: string}
async function img(i: Img, withKey = false) {
  const assetId = await uploadImage(i.src)
  return {
    _type: 'imageWithAlt',
    ...(withKey ? {_key: key()} : {}),
    asset: {_type: 'reference', _ref: assetId},
    alt: ls(i.alt),
  }
}
const imgItem = (i: Img) => img(i, true)

// ---- section builders -------------------------------------------------------
type CardIn = {title: string; desc?: string; text?: string; image?: Img; links?: Cta[]}
async function cardGrid(input: {
  h2: string
  intro?: string
  items: readonly CardIn[]
  links?: readonly Cta[]
  backgroundImage?: Img
}) {
  return {
    _type: 'cardGrid',
    h2: ls(input.h2),
    ...(input.intro ? {intro: lt(input.intro)} : {}),
    items: await Promise.all(
      input.items.map(async (c) => ({
        _type: 'card',
        _key: key(),
        title: ls(c.title),
        desc: lt(c.desc ?? c.text ?? ''),
        ...(c.image ? {image: await img(c.image)} : {}),
        ...(c.links?.length ? {links: c.links.map(ctaItem)} : {}),
      })),
    ),
    ...(input.links?.length ? {links: input.links.map(ctaItem)} : {}),
    ...(input.backgroundImage ? {backgroundImage: await img(input.backgroundImage)} : {}),
  }
}

async function stepsSection(input: {
  h2: string
  intro?: string
  steps: readonly {title: string; desc: string}[]
  cta?: Cta
  backgroundImage?: Img
}) {
  return {
    _type: 'stepsSection',
    h2: ls(input.h2),
    ...(input.intro ? {intro: lt(input.intro)} : {}),
    steps: input.steps.map((s) => ({
      _type: 'step',
      _key: key(),
      title: ls(s.title),
      desc: lt(s.desc),
    })),
    ...(input.cta ? {cta: cta(input.cta)} : {}),
    ...(input.backgroundImage ? {backgroundImage: await img(input.backgroundImage)} : {}),
  }
}

const faqSection = (input: {h2: string; items: readonly {q: string; a: string}[]}) => ({
  _type: 'faqSection',
  h2: ls(input.h2),
  items: input.items.map((i) => ({_type: 'faqItem', _key: key(), q: ls(i.q), a: lt(i.a)})),
})

async function heroSection(input: {
  label?: string
  h1: string
  sub: string
  image?: Img
  ctas?: readonly Cta[]
  trustChips?: readonly string[]
}) {
  return {
    _type: 'heroSection',
    ...(input.label ? {label: ls(input.label)} : {}),
    h1: ls(input.h1),
    sub: lt(input.sub),
    ...(input.image ? {image: await img(input.image)} : {}),
    ...(input.ctas?.length ? {ctas: input.ctas.map(ctaItem)} : {}),
    ...(input.trustChips?.length ? {trustChips: input.trustChips.map(lsItem)} : {}),
  }
}

async function ctaBand(input: {
  h2: string
  text: string
  primary: Cta
  crosslinks?: readonly Cta[]
  image?: Img
}) {
  return {
    _type: 'ctaBand',
    h2: ls(input.h2),
    text: lt(input.text),
    primary: cta(input.primary),
    ...(input.crosslinks?.length ? {crosslinks: input.crosslinks.map(ctaItem)} : {}),
    ...(input.image ? {image: await img(input.image)} : {}),
  }
}

async function seoTextSection(input: {h2: string; text: string; images?: readonly Img[]}) {
  return {
    _type: 'seoTextSection',
    h2: ls(input.h2),
    text: lt(input.text),
    images: await Promise.all((input.images ?? []).map((i) => imgItem(i))),
  }
}

const teaser = (input: {h2: string; sub?: string; ctas?: readonly Cta[]; projectSlugs?: readonly string[]}) => ({
  _type: 'teaserSection',
  h2: ls(input.h2),
  ...(input.sub ? {sub: lt(input.sub)} : {}),
  ...(input.ctas?.length ? {ctas: input.ctas.map(ctaItem)} : {}),
  ...(input.projectSlugs?.length
    ? {projects: input.projectSlugs.map((s) => refItem(`project-${s}`))}
    : {}),
})

// ---- document builders -------------------------------------------------------
async function buildDocs() {
  const docs: Record<string, unknown>[] = []

  // siteSettings — verified client facts (chat export + old site + QUOTE_FORM)
  docs.push({
    _id: 'siteSettings',
    _type: 'siteSettings',
    phone: '91 70 01 03',
    phoneHref: 'tel:+4591700103',
    email: 'grontlanddk@gmail.com',
    cvr: '45514374',
    area: ls('København og Storkøbenhavn'),
    hours: ls('Mandag–fredag 8:00–17:00'),
    replyPromise: ls('Vi svarer inden 24 timer'),
    footerBlurb: ls(FOOTER.blurb),
    copyright: FOOTER.copyright,
  })

  // quoteForm
  docs.push({
    _id: 'quoteForm',
    _type: 'quoteForm',
    h2: ls(QUOTE_FORM.h2),
    sub: lt(QUOTE_FORM.sub),
    nameLabel: ls(QUOTE_FORM.fields.name),
    phoneLabel: ls(QUOTE_FORM.fields.phone),
    emailLabel: ls(QUOTE_FORM.fields.email),
    whoLabel: ls(QUOTE_FORM.whoLabel),
    whoOptions: QUOTE_FORM.whoOptions.map(lsItem),
    taskLabel: ls(QUOTE_FORM.taskLabel),
    taskPlaceholder: ls(QUOTE_FORM.taskPlaceholder),
    taskOptions: QUOTE_FORM.taskOptions.map(lsItem),
    messageLabel: ls(QUOTE_FORM.message),
    uploadLabel: ls(QUOTE_FORM.upload),
    uploadHint: ls(QUOTE_FORM.uploadHint),
    button: ls(QUOTE_FORM.button),
    micro: ls(QUOTE_FORM.micro),
    image: await img({src: QUOTE_FORM.image, alt: QUOTE_FORM.imageAlt}),
    reassurance: QUOTE_FORM.reassurance.map(fact),
  })

  // galleryCategory ×6 — sections + photo pool
  for (const [i, section] of GALLERY_SECTIONS.entries()) {
    const photos = GALLERY_PHOTOS.filter((p) => p.service === section.id)
    docs.push({
      _id: `galleryCategory-${section.id}`,
      _type: 'galleryCategory',
      key: section.id,
      title: ls(section.title),
      description: lt(section.description),
      cta: cta(section.cta),
      photos: await Promise.all(photos.map((p) => imgItem({src: p.src, alt: p.alt}))),
      order: i,
    })
  }

  // projects ×5
  for (const p of PROJECTS) {
    docs.push({
      _id: `project-${p.slug}`,
      _type: 'project',
      title: ls(p.title),
      slug: {_type: 'slug', current: p.slug},
      location: p.location,
      objectType: ls(p.objectType),
      category: p.category,
      primaryService: ref(`service-${slugOf(p.serviceHref)}`),
      serviceLabel: ls(p.serviceLabel),
      services: p.services.map((s) => refItem(`service-${slugOf(s.href)}`)),
      seo: seo(`${p.title} | Grønt Land DK`, p.seoDescription),
      cardDesc: lt(p.cardDesc),
      cardImage: await img({src: p.cardImage, alt: p.cardImageAlt}),
      heroImage: await img({src: p.heroImage, alt: p.heroImageAlt}),
      intro: lt(p.intro),
      task: lt(p.task),
      work: p.work.map(lsItem),
      focus: p.focus.map(lsItem),
      result: lt(p.result),
      facts: (p.facts ?? []).map(fact),
      gallery: await Promise.all(
        p.gallery.map(async (g) => ({
          _type: 'projectPhoto',
          _key: key(),
          image: await img({src: g.src, alt: g.alt}),
          kind: g.kind,
        })),
      ),
      related: p.relatedSlugs.map((s) => refItem(`project-${s}`)),
    })
  }

  // services ×8 (cardDesc from the home teaser items, matched by href)
  for (const [i, s] of SERVICES_PAGES.entries()) {
    const homeItem = SERVICES.items.find((it) => it.href === `/ydelser/${s.slug}`)
    docs.push({
      _id: `service-${s.slug}`,
      _type: 'service',
      nav: ls(s.nav),
      slug: {_type: 'slug', current: s.slug},
      order: i,
      ...(homeItem ? {cardDesc: lt(homeItem.desc)} : {}),
      seo: seo(s.metaTitle, s.metaDescription),
      hero: await heroSection({
        label: 'Ydelser',
        h1: s.h1,
        sub: s.heroSub,
        image: s.heroImage,
        // baked from the fixed ServiceHero layout
        ctas: [
          {label: 'Få et tilbud', href: '/kontakt'},
          {label: 'Se projekter', href: '/projekter'},
        ],
        trustChips: s.trustChips,
      }),
      scope: await cardGrid({h2: s.scope.h2, items: s.scope.items}),
      ...(s.prices
        ? {
            prices: {
              _type: 'priceList',
              h2: ls(s.prices.h2),
              note: lt(s.prices.note),
              rows: s.prices.rows.map((r) => ({
                _type: 'priceRow',
                _key: key(),
                label: ls(r.label),
                value: ls(r.value),
              })),
            },
          }
        : {}),
      process: await stepsSection({
        h2: s.process.h2,
        steps: s.process.steps,
        cta: {label: 'Start med en kort besked', href: '/kontakt'},
        backgroundImage: s.processImage,
      }),
      ...(s.ctaImage ? {ctaImage: await img(s.ctaImage)} : {}),
      cases: s.caseSlugs.map((c) => refItem(`project-${c}`)),
      galleryCategory: ref(`galleryCategory-${s.galleryFilter}`),
      faq: faqSection(s.faq),
      seoText: await seoTextSection(s.seoText),
    })
  }

  // homePage
  docs.push({
    _id: 'homePage',
    _type: 'homePage',
    seo: seo(
      'Grønt Land DK — Renovering og byggearbejde i København',
      'Grønt Land DK hjælper private boligejere og entreprenører med renovering, facadearbejde, belægning, tømrerarbejde, murerarbejde, malerarbejde og havearbejde i København og Storkøbenhavn.',
    ),
    hero: {
      h1: ls(HERO.h1),
      sub: lt(HERO.sub),
      ctas: [HERO.ctaPrimary, HERO.ctaSecondary].map(ctaItem),
      image: await img(HERO.image),
      slider: await Promise.all(HERO.slider.map((i) => imgItem(i))),
      overlayCards: await Promise.all(
        HERO.overlayCards.map(async (c) => ({
          _type: 'overlayCard',
          _key: key(),
          label: ls(c.label),
          image: await img(c.image),
          caption: lt(c.caption),
        })),
      ),
    },
    servicesTeaser: teaser({h2: SERVICES.h2, sub: SERVICES.sub, ctas: [SERVICES.cta]}),
    audiences: await cardGrid({
      h2: AUDIENCES.h2,
      items: AUDIENCES.cards.map((c) => ({
        title: c.title,
        desc: c.text,
        image: {src: c.image, alt: c.imageAlt},
        links: [c.cta],
      })),
    }),
    oneTeam: await cardGrid({
      h2: ONETEAM.h2,
      intro: ONETEAM.intro,
      items: ONETEAM.cards,
      backgroundImage: ONETEAM.background,
    }),
    process: await stepsSection({h2: PROCESS.h2, steps: PROCESS.steps, cta: PROCESS.cta}),
    projectsTeaser: teaser({h2: PROJECTS_LIST.h2, sub: PROJECTS_LIST.sub, ctas: [PROJECTS_LIST.cta]}),
    galleryTeaser: teaser({h2: GALLERY.h2, sub: GALLERY.sub, ctas: [GALLERY.cta]}),
    about: {
      h2: ls(ABOUT.h2),
      text: lt(ABOUT.text),
      facts: ABOUT.facts.map(fact),
      teamH3: ls(ABOUT.team.h3),
      teamText: lt(ABOUT.team.text),
      trades: ABOUT.team.trades.map(lsItem),
      cta: cta(ABOUT.cta),
      image: await img({src: ABOUT.image, alt: ABOUT.imageAlt}),
    },
    seoText: await seoTextSection({
      h2: SEOTEXT.h2,
      text: SEOTEXT.text,
      images: [{src: SEOTEXT.image, alt: SEOTEXT.imageAlt}],
    }),
    faq: faqSection(FAQ),
  })

  // omOsPage (process renders from homePage.process)
  docs.push({
    _id: 'omOsPage',
    _type: 'omOsPage',
    seo: seo(OM_META.title, OM_META.description),
    hero: await heroSection(OM_HERO),
    intro: {
      h2: ls(OM_INTRO.h2),
      text: lt(OM_INTRO.text),
      image: await img(OM_INTRO.image),
      facts: OM_INTRO.facts.map(fact),
    },
    values: await cardGrid(OM_VALUES),
    team: {
      h2: ls(OM_TEAM.h2),
      intro: lt(OM_TEAM.intro),
      members: await Promise.all(
        OM_TEAM.members.map(async (m) => ({
          _type: 'member',
          _key: key(),
          name: m.name,
          role: ls(m.role),
          ...('note' in m && m.note ? {note: ls(m.note)} : {}),
          image: await img(m.image),
          trades: m.trades.map(lsItem),
          link: cta(m.link),
        })),
      ),
    },
    onePlan: await ctaBand({
      h2: OM_ONEPLAN.h2,
      text: OM_ONEPLAN.text,
      primary: OM_ONEPLAN.ctas[0],
      crosslinks: OM_ONEPLAN.ctas.slice(1),
      image: OM_ONEPLAN.background,
    }),
    galleryTeaser: teaser({h2: OM_GALLERY.h2, sub: OM_GALLERY.sub, ctas: [OM_GALLERY.cta]}),
    cta: await ctaBand(OM_CTA),
  })

  // kontaktPage (contact rows derive from siteSettings; form from quoteForm)
  docs.push({
    _id: 'kontaktPage',
    _type: 'kontaktPage',
    seo: seo(KONTAKT_META.title, KONTAKT_META.description),
    hero: await heroSection({
      label: KONTAKT_HERO.label,
      h1: KONTAKT_HERO.h1,
      sub: KONTAKT_HERO.sub,
      image: KONTAKT_HERO.image,
      ctas: [KONTAKT_HERO.cta],
    }),
    formH2: ls(KONTAKT_FORM.h2),
    infoH2: ls(KONTAKT_INFO.h2),
    infoNote: ls(KONTAKT_INFO.note),
    steps: await stepsSection(KONTAKT_STEPS),
    audiences: await cardGrid({
      h2: KONTAKT_AUDIENCES.h2,
      items: KONTAKT_AUDIENCES.cards.map((c) => ({
        title: c.title,
        desc: c.text,
        image: c.image,
        links: [c.cta],
      })),
      links: KONTAKT_AUDIENCES.links,
    }),
  })

  // privatePage
  docs.push({
    _id: 'privatePage',
    _type: 'privatePage',
    seo: seo(PRIVATE_META.title, PRIVATE_META.description),
    hero: await heroSection(PRIVATE_HERO),
    benefits: await cardGrid(PRIVATE_BENEFITS),
    types: await cardGrid({
      h2: PRIVATE_TYPES.h2,
      items: PRIVATE_TYPES.items.map((t) => ({
        title: t.title,
        desc: t.desc,
        image: t.image,
        links: [t.service, t.example],
      })),
    }),
    projects: teaser({
      h2: PRIVATE_PROJECTS.h2,
      ctas: PRIVATE_PROJECTS.ctas,
      projectSlugs: PRIVATE_PROJECTS.slugs,
    }),
    faq: faqSection(PRIVATE_FAQ),
    cta: await ctaBand(PRIVATE_CTA),
  })

  // entreprenorerPage
  docs.push({
    _id: 'entreprenorerPage',
    _type: 'entreprenorerPage',
    seo: seo(B2B_META.title, B2B_META.description),
    hero: await heroSection(B2B_HERO),
    scenarios: await cardGrid(B2B_SCENARIOS),
    expectations: await cardGrid(B2B_EXPECTATIONS),
    why: await cardGrid({...B2B_WHY, links: [B2B_WHY.link]}),
    model: await stepsSection(B2B_MODEL),
    caseHighlight: {
      h2: ls(B2B_CASE.h2),
      text: lt(B2B_CASE.text),
      project: ref(`project-${B2B_CASE.slug}`),
      ctas: B2B_CASE.ctas.map(ctaItem),
    },
    trades: {
      h2: ls(B2B_TRADES.h2),
      services: B2B_TRADES.links.map((l) => refItem(`service-${slugOf(l.href)}`)),
    },
    cta: await ctaBand(B2B_CTA),
  })

  // projekterPage (listing)
  docs.push({
    _id: 'projekterPage',
    _type: 'projekterPage',
    seo: seo('Projekter | Grønt Land DK', PROJECTS_LIST.sub),
    h1: ls(PROJECTS_LIST.listingH1),
    sub: lt(PROJECTS_LIST.sub),
    emptyFilter: ls(PROJECTS_LIST.emptyFilter),
    cta: await ctaBand({
      h2: PROJECTS_LIST.ctaBand.h2,
      text: PROJECTS_LIST.ctaBand.sub,
      primary: {label: PROJECTS_LIST.ctaBand.button, href: '/kontakt'},
      image: {src: PROJECTS_LIST.ctaBand.image, alt: PROJECTS_LIST.ctaBand.imageAlt},
    }),
  })

  // ydelserIndexPage
  docs.push({
    _id: 'ydelserIndexPage',
    _type: 'ydelserIndexPage',
    seo: seo(YDELSER_INDEX.metaTitle, YDELSER_INDEX.metaDescription),
    hero: await heroSection({
      label: YDELSER_INDEX.hero.label,
      h1: YDELSER_INDEX.hero.h1,
      sub: YDELSER_INDEX.hero.sub,
      image: YDELSER_INDEX.hero.image,
    }),
    cta: await ctaBand(YDELSER_INDEX.cta),
  })

  // galleriPage
  docs.push({
    _id: 'galleriPage',
    _type: 'galleriPage',
    seo: seo(GALLERI_PAGE.metaTitle, GALLERI_PAGE.metaDescription),
    hero: await heroSection({
      label: GALLERI_PAGE.hero.label,
      h1: GALLERI_PAGE.hero.h1,
      sub: GALLERI_PAGE.hero.sub,
      image: GALLERI_PAGE.hero.image,
    }),
    seoText: await seoTextSection(GALLERI_PAGE.seoText),
    cta: await ctaBand(GALLERI_PAGE.cta),
  })

  return docs
}

// ---- run --------------------------------------------------------------------
async function main() {
  console.log(`Migrating into ${client.config().projectId}/${client.config().dataset} …`)
  const docs = await buildDocs()
  const tx = client.transaction()
  for (const doc of docs) tx.createOrReplace(doc as never)
  await tx.commit()
  console.log(`Done: ${docs.length} documents, ${assetCache.size} unique images uploaded.`)
  const byType = docs.reduce<Record<string, number>>((acc, d) => {
    const t = d._type as string
    acc[t] = (acc[t] ?? 0) + 1
    return acc
  }, {})
  console.table(byType)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
