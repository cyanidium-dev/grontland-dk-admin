/**
 * ARCHIVED — DO NOT RUN. English locale fields were removed (2026-08 full
 * locale strip). Kept only as history of prior EN copy seeds/patches.
 *
 * Phase 6: English content for the CMS documents the frontend reads
 * (siteSettings, gallery categories, projects, services, collection-page
 * singletons). Translations are intent-adjusted, not word-for-word.
 * Idempotent: fetches each doc, sets `.en` on locale fields per the spec
 * below (arrays zipped by index), createOrReplace.
 *
 * Run from CMS/:  npx sanity exec scripts/translate-en.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-08-15'})

type Spec = string | Spec[] | {[key: string]: Spec}

/* Walk the spec against the document: strings land as `.en` on the matching
   locale object; arrays zip by index; objects recurse by key. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function apply(node: any, spec: Spec): void {
  if (node == null || spec == null) return
  if (typeof spec === 'string') {
    if (typeof node === 'object') node.en = spec
    return
  }
  if (Array.isArray(spec)) {
    spec.forEach((s, i) => apply(node[i], s))
    return
  }
  for (const key of Object.keys(spec)) apply(node[key], spec[key])
}

const CTA_QUOTE = 'Get a quote'
const CTA_PROJECTS = 'See projects'

const EN: Record<string, Spec> = {
  // ---------------------------------------------------------------- settings
  siteSettings: {
    area: 'Copenhagen and Greater Copenhagen',
    hours: 'Monday–Friday 8:00–17:00',
    replyPromise: 'We reply within 24 hours',
    footerBlurb: 'Renovation and construction work in Copenhagen',
  },

  // ---------------------------------------------------------- gallery ×6
  'galleryCategory-havearbejde': {
    title: 'Garden work',
    description:
      'Planted beds, lawns, retaining walls and garden zones from private gardens in and around Copenhagen.',
    cta: {label: 'Read about garden work'},
    photos: [
      {alt: 'Natural-stone retaining wall by a stream in a garden'},
      {alt: 'Garden path with stone bed and new planting'},
      {alt: 'Trimmed hedges and a well-kept lawn'},
      {alt: 'Newly planted bed with heather and shrubs'},
      {alt: 'Stone bed with perennials in a garden'},
      {alt: 'Perennial bed and cobblestone paving by a house'},
    ],
  },
  'galleryCategory-belaegning': {
    title: 'Paving',
    description:
      'Driveways, walkways and steps in concrete, granite and sandstone, including drainage.',
    cta: {label: 'Read about paving'},
    photos: [
      {alt: 'New paving with granite steps and retaining wall'},
      {alt: 'Sandstone paving and grass reinforcement by a house near the water'},
      {alt: 'Herringbone brick paving at an entrance'},
      {alt: 'Terrace paving with corten steel edging'},
      {alt: 'Walkway with retaining wall and linear drain'},
      {alt: 'Drainage work on a construction site'},
    ],
  },
  'galleryCategory-murerarbejde': {
    title: 'Masonry',
    description: 'Rendered façades, tiling, tiled roofs and renovated stairs, outside and in.',
    cta: {label: 'Read about masonry'},
    photos: [
      {alt: 'Renovated outdoor stairs with new tiles'},
      {alt: 'Newly laid floor tiles with a natural-stone look'},
      {alt: 'Tiling in a bathroom'},
      {alt: 'Masonry with a new lintel in a brick wall'},
      {alt: 'Newly laid tiled roof on a house'},
      {alt: 'Roof terrace with new tiles and rendered parapet'},
    ],
  },
  'galleryCategory-malerservice': {
    title: 'Painting',
    description: 'Painting with a clean finish: walls, panelling, wallpaper and exterior surfaces.',
    cta: {label: 'Read about painting'},
    photos: [
      {alt: 'Exterior shed painted black'},
      {alt: 'Painting work in a stairwell with panelling'},
      {alt: 'Wallpapering a bedroom'},
      {alt: 'Freshly painted wall with stucco ceiling'},
      {alt: 'Painting a utility room with protective covering'},
      {alt: 'Finished living room in light tones with a sea view'},
    ],
  },
  'galleryCategory-tomrerarbejde': {
    title: 'Carpentry',
    description: 'Timber decks, floors, kitchen fitting and structures, from load-bearing parts to details.',
    cta: {label: 'Read about carpentry'},
    photos: [
      {alt: 'Finished hardwood deck by a private home'},
      {alt: 'New timber deck under construction by a modern villa'},
      {alt: 'Newly sanded and treated wooden floor in a home'},
      {alt: 'Deck under construction with load-bearing structure'},
      {alt: 'Fitting a new kitchen'},
      {alt: 'New floor in a utility room'},
    ],
  },
  'galleryCategory-totalentreprise': {
    title: 'Turnkey renovation',
    description:
      'Highlights from full renovations, including the villa in Skodsborg with joinery and a wine cellar.',
    cta: {label: 'Read about turnkey renovation'},
    photos: [
      {alt: 'New utility room with custom-built cabinets'},
      {alt: 'Custom shelving wall in a renovated living room'},
      {alt: 'Wine cellar with integrated lighting'},
      {alt: 'Fully renovated living room with new plank floors'},
      {alt: 'New staircase and joinery in a villa'},
      {alt: 'Custom-designed cabinets with built-in lighting'},
    ],
  },

  // ---------------------------------------------------------- projects ×5
  'project-terrasse-og-haveomraade': {
    title: 'Jatoba hardwood deck',
    objectType: 'Private home',
    serviceLabel: 'Garden work / deck',
    cardDesc:
      'Jatoba hardwood deck at a private home in Gentofte — solid structure, precise fitting and an exclusive outdoor space.',
    seo: {
      title: 'Jatoba hardwood deck | Grønt Land DK',
      description:
        'Jatoba hardwood deck at a private home in Gentofte — structure, foundation and fitting by Grønt Land DK.',
    },
    intro:
      'We built and fitted a Jatoba hardwood deck at a private home in Gentofte — an outdoor space that matches the house and stands up to daily use.',
    task: 'The client wanted a solid, durable deck in Jatoba, matched to the house and its surroundings. Jatoba is a hard, wear-resistant timber that demands precise workmanship and correct fitting for a long, stable life.',
    work: [
      'Building the load-bearing structure',
      'Levelling and correct foundation',
      'Fitting the Jatoba deck boards',
      'Precise adjustment and finishing',
    ],
    focus: ['Precise build and correct spacing', 'A stable structure', 'A consistent, visually clean result'],
    result:
      'The result is a solid, durable deck with an exclusive look, matched to the house and its surroundings in Gentofte.',
    facts: [
      {label: 'Location', value: 'Gentofte'},
      {label: 'Type', value: 'Private home'},
      {label: 'Material', value: 'Jatoba (hardwood)'},
      {label: 'Trade', value: 'Garden work / deck'},
      {label: 'Scope', value: 'Building and fitting a hardwood deck'},
    ],
    cardImage: {alt: 'Finished Jatoba deck by a white villa in Gentofte'},
    heroImage: {alt: 'Finished Jatoba deck by a white villa in Gentofte'},
    gallery: [
      {image: {alt: 'Load-bearing deck structure under construction in Gentofte'}},
      {image: {alt: 'Finished Jatoba deck by a white villa in Gentofte'}},
      {image: {alt: 'Deck under construction — joists and foundation'}},
      {image: {alt: 'Finished Jatoba deck by a private home'}},
    ],
  },
  'project-belaegning-ved-bolig': {
    title: 'Paving and groundwork',
    objectType: 'Private home',
    serviceLabel: 'Paving',
    cardDesc:
      'Sandstone paving, drainage and groundwork at a private home in Roskilde — a stable base and controlled surface water.',
    seo: {
      title: 'Paving and groundwork | Grønt Land DK',
      description:
        'Paving and groundwork at a private home in Roskilde — sandstone, drainage, grass reinforcement and retaining walls by Grønt Land DK.',
    },
    intro:
      'We carried out a complete outdoor project at a private home in Roskilde, focused on function, drainage and looks.',
    task: 'The client needed paving and groundwork on a site with level differences right next to the water. The job called for a correct base build-up, drainage and a coherent look across the materials.',
    work: [
      'Sandstone paving (sandstone tiles)',
      'Matching clinker tiles for a consistent look',
      'Drainage channels and water management',
      'Walkways in grass reinforcement',
      'Retaining walls in granite cobblestone',
    ],
    focus: [
      'A stable base and correct falls',
      'Effective handling of surface water',
      'Precise fitting of the materials',
      'Function and design working together',
    ],
    result:
      'The result is a durable, well-balanced outdoor space where materials and construction work together, technically and visually.',
    facts: [
      {label: 'Location', value: 'Roskilde'},
      {label: 'Type', value: 'Private home'},
      {label: 'Materials', value: 'Sandstone, granite cobbles, grass reinforcement'},
      {label: 'Trade', value: 'Paving'},
      {label: 'Scope', value: 'Paving, drainage and groundwork near water'},
    ],
    cardImage: {alt: 'New sandstone paving and groundwork at a home in Roskilde'},
    heroImage: {alt: 'New sandstone paving and groundwork at a home in Roskilde'},
    gallery: [
      {image: {alt: 'Paving and garden landscaping under construction at a home'}},
      {image: {alt: 'Finished sandstone paving and grounds at a home in Roskilde'}},
      {image: {alt: 'Paving and groundwork in progress'}},
      {image: {alt: 'New paving and groundwork at a home in Roskilde'}},
    ],
  },
  'project-facadeopgave': {
    title: 'Façade renovation',
    objectType: 'Private home',
    serviceLabel: 'Façade work',
    cardDesc:
      'Façade renovation at a private home in North Zealand — render, filler and paint with care for the finish and the surroundings.',
    seo: {
      title: 'Façade renovation | Grønt Land DK',
      description:
        'Façade renovation at a private home in North Zealand — preparation, rendering, painting and protection by Grønt Land DK.',
    },
    intro:
      'We renovated the façade of a private home in North Zealand, focused on details, finish and minimal disruption during the work.',
    task: 'The client wanted a façade renovation where the visual result mattered most. The job covered preparation, rendering and painting — with careful protection of windows, doors and the surrounding areas.',
    work: [
      'Preparing the façade',
      'Rendering and skim coating',
      'Painting the façade',
      'Protecting windows, doors and surroundings',
    ],
    focus: [
      'Clean lines and an even surface',
      'Correct preparation for a long life',
      'Minimal disruption for the client',
    ],
    result: 'The result is a refreshed façade with a clean, modern look that suits its surroundings in North Zealand.',
    facts: [
      {label: 'Location', value: 'North Zealand'},
      {label: 'Type', value: 'Private home'},
      {label: 'Trade', value: 'Façade work'},
      {label: 'Scope', value: 'Preparation, render, filler and paint'},
    ],
    cardImage: {alt: 'Façade renovation at a private home in North Zealand with covered windows'},
    heroImage: {alt: 'Façade renovation at a private home in North Zealand with covered windows'},
    gallery: [{image: {alt: 'Façade under renovation — windows covered, render and paint in progress'}}],
  },
  'project-betontrappe-hellerup': {
    title: 'Concrete stair renovation',
    objectType: 'Private home',
    serviceLabel: 'Masonry',
    cardDesc:
      'Complete renovation of a concrete stair at a private home in Hellerup — new geometry, casting and a consistent, durable look.',
    seo: {
      title: 'Concrete stair renovation | Grønt Land DK',
      description:
        'Renovation of a concrete stair at a private home in Hellerup — formwork, casting and finishing by Grønt Land DK.',
    },
    intro: 'We completely renovated an existing concrete stair at a private home in Hellerup.',
    task: 'The original structure was worn and uneven, so the stair’s geometry and surfaces had to be rebuilt — with precise, even steps and a look that suits the house.',
    work: [
      'Preparing and cleaning the existing concrete',
      'Building new formwork (steps and sides)',
      'Repairing and levelling the structure',
      'Casting and shaping new steps',
      'Finishing for an even, durable result',
    ],
    focus: ['Precise geometry and even step heights', 'A strong, stable structure', 'Visual harmony with the existing architecture'],
    result: 'The result is a solid, handsome stair with a modern, consistent look that suits the style of the house in Hellerup.',
    facts: [
      {label: 'Location', value: 'Hellerup'},
      {label: 'Type', value: 'Private home'},
      {label: 'Trade', value: 'Masonry'},
      {label: 'Scope', value: 'Renovation of an outdoor concrete stair'},
    ],
    cardImage: {alt: 'Newly renovated outdoor stair at a home in Hellerup'},
    heroImage: {alt: 'Newly renovated outdoor stair at a home in Hellerup'},
    gallery: [
      {image: {alt: 'Outdoor stair under renovation with paving in the foreground'}},
      {image: {alt: 'Finished renovated outdoor stair at a home in Hellerup'}},
      {image: {alt: 'Concrete stair and grounds under construction in Hellerup'}},
      {image: {alt: 'Newly renovated stair with tiles and a white finish'}},
      {image: {alt: 'New concrete steps with a white balustrade'}},
    ],
  },
  'project-belaegning-arc-amager': {
    title: 'Paving and drainage — ARC',
    objectType: 'Commercial construction',
    serviceLabel: 'Paving',
    cardDesc:
      'Subcontracted paving and drainage at ARC Amager Resource Center — in close cooperation with the main contractor.',
    seo: {
      title: 'Paving and drainage — ARC | Grønt Land DK',
      description:
        'Paving and drainage as subcontractor at ARC Amager Resource Center — Grønt Land DK for contractors.',
    },
    intro:
      'We took part as subcontractor in a larger project at ARC Amager Resource Center, delivering paving and drainage.',
    task: 'As subcontractor we delivered paving and drainage in close cooperation with the main contractor and the other trades on site — with correct falls, precise setting-out and a stable build-up.',
    work: [
      'Installing drainage and water-management systems',
      'Fitting linear drains and wells',
      'Preparing the base build-up',
      'Laying concrete paving',
    ],
    focus: ['Correct falls and drainage', 'Precise setting-out and execution', 'A stable, durable build-up'],
    result:
      'We took part in both the execution and the day-to-day coordination on site, so the work was delivered correctly and without delays.',
    facts: [
      {label: 'Location', value: 'Amager'},
      {label: 'Type', value: 'Commercial construction'},
      {label: 'Role', value: 'Subcontractor'},
      {label: 'Trade', value: 'Paving and drainage'},
      {label: 'Scope', value: 'ARC Amager Resource Center'},
    ],
    cardImage: {alt: 'Reinforced foundation ready for casting on a construction site'},
    heroImage: {alt: 'Reinforced foundation ready for casting on a construction site'},
    gallery: [
      {image: {alt: 'Paving and grounds under construction on a building site'}},
      {image: {alt: 'Reinforced foundation and site work at ARC Amager'}},
    ],
  },

  // ---------------------------------------------------------- services ×8
  'service-havearbejde': {
    nav: 'Garden work',
    cardDesc: 'Decks, garden zones and outdoor areas planned for use, durability and a finished look.',
    seo: {
      title: 'Garden work and landscaping in Copenhagen | Grønt Land DK',
      description:
        'Garden work in Copenhagen: decks, planting, lawns, tree felling and raised beds. Typical project 1-3 weeks. Get a quote within 24 hours.',
    },
    hero: {
      label: 'Services',
      h1: 'Garden work in Copenhagen: from a new deck to a finished garden',
      sub: 'We build decks, beds and lawns, plant perennials, shrubs and trees, and handle felling with stump grinding. You get a fixed plan, one point of contact and a typical timeline of 1-3 weeks.',
      image: {alt: 'Garden path with stone bed and new planting'},
      ctas: [{label: CTA_QUOTE}, {label: CTA_PROJECTS}],
      trustChips: ['One point of contact', 'Fixed price range', 'Typically 1-3 weeks'],
    },
    scope: {
      h2: 'What we do in the garden',
      items: [
        {title: 'Decks and garden zones', desc: 'Timber decks and areas for outdoor living, planned around use, sun and the style of the house.'},
        {title: 'Planting', desc: 'We supply and plant perennials, shrubs and trees suited to the soil and light on site.'},
        {title: 'Lawns', desc: 'New lawns or restoring the one you have.'},
        {title: 'Tree felling and stump grinding', desc: 'Felling, even where space is tight, with the stump ground out afterwards.'},
        {title: 'Raised beds and retaining walls', desc: 'Raised beds and smaller retaining walls in granite or concrete where the terrain calls for it.'},
        {title: 'Care and maintenance', desc: 'Ongoing care of beds, hedges and lawn if you want the garden kept up after the work.'},
      ],
    },
    prices: {
      h2: 'What does it cost?',
      note: 'Indicative from-prices excl. VAT. You always get a fixed price before we start.',
      rows: [
        {label: 'Paved terrace', value: 'from DKK 600/m²'},
        {label: 'Timber deck incl. structure', value: 'from DKK 1,200/m²'},
      ],
    },
    process: {
      h2: 'How a garden project runs',
      steps: [
        {title: 'We look at the garden', desc: 'Send a few photos and a short description, or we come by and measure up.'},
        {title: 'You get a price and a plan', desc: 'A fixed price, suggested materials and planting, and a date you can count on.'},
        {title: 'We do the work', desc: 'Deck, beds and lawn are built in the agreed order, and you can follow along.'},
        {title: 'Walk-through and handover', desc: 'We go through the result together, with advice on caring for the new garden.'},
      ],
      cta: {label: 'Start with a short message'},
      backgroundImage: {alt: 'Natural-stone retaining wall by a stream in a garden'},
    },
    ctaImage: {alt: 'Trimmed hedges and a well-kept lawn'},
    faq: {
      h2: 'Questions about garden work',
      items: [
        {q: 'What does garden work cost in Copenhagen?', a: 'It depends on the job. A paved terrace starts at DKK 600/m² excl. VAT, a timber deck with structure at DKK 1,200/m². Send a few photos of your garden and you get a fixed price before we start.'},
        {q: 'How long does a garden project take?', a: 'Most private garden projects take 1-3 weeks from start. Smaller jobs like planting or a single felling are quicker; you get a concrete timeline with the quote.'},
        {q: 'Do you plant as well, or only build?', a: 'Both. We supply and plant perennials, shrubs and trees, lay lawns and build raised beds. If you want the garden looked after afterwards, we offer ongoing care and maintenance.'},
        {q: 'Do you fell trees on small plots?', a: 'Yes. We fell trees and grind out the stump, including in residential areas where the house, hedge or carport is close by.'},
        {q: 'Can garden work be combined with paving or carpentry?', a: 'Yes, and it is often the best order of work. The trades are under one roof here, so a new deck, a paved driveway and planting can go into one plan with one person responsible.'},
      ],
    },
    seoText: {
      h2: 'Garden work in Copenhagen and Greater Copenhagen',
      text: 'Grønt Land DK carries out garden work in Copenhagen and Greater Copenhagen for private homeowners. We build timber decks and garden zones, plant perennials, shrubs and trees, lay lawns and build raised beds and smaller retaining walls. We also handle tree felling with stump grinding, as well as ongoing care and maintenance. Many clients combine jobs — a new deck together with a paved driveway, or new planting while the façade is being renovated anyway. Because the trades work as one team, the jobs are planned in one sequence with one person responsible; that saves coordination and gives a result that hangs together. A typical private project takes 1-3 weeks, and you know the price before we start. See the Jatoba deck in Gentofte under projects, or send a short description of your garden and we reply within 24 hours.',
      images: [{alt: 'A well-kept garden with lawn and planting'}, {alt: 'Load-bearing structure for a timber deck under construction'}],
    },
  },
  'service-belaegningsarbejde': {
    nav: 'Paving',
    cardDesc: 'Driveways, paths and access areas with a solid base, a neat finish and a long life.',
    seo: {
      title: 'Paving in Copenhagen — fixed price | Grønt Land DK',
      description:
        'Paving in Copenhagen: driveways from DKK 800/m², terraces from DKK 600/m². Concrete, granite and sandstone on a correct base. Get a quote within 24 hours.',
    },
    hero: {
      label: 'Services',
      h1: 'Paving in Copenhagen: driveways, terraces and steps that stay put',
      sub: 'We lay driveways, terraces, paths and steps in concrete, granite and sandstone, and we build the base correctly, so the paving stays level year after year. Typical timeline: 3-10 working days.',
      image: {alt: 'Herringbone brick paving at an entrance'},
      ctas: [{label: CTA_QUOTE}, {label: CTA_PROJECTS}],
      trustChips: ['Fixed price before start', 'Correct base build-up', 'Typically 3-10 working days'],
    },
    scope: {
      h2: 'What we lay',
      items: [
        {title: 'Driveways', desc: 'Hard-wearing paving in concrete or granite products, dimensioned for the weight of the car.'},
        {title: 'Terraces and walkways', desc: 'Tile paving in sandstone, concrete or clinker with a correct fall away from the house.'},
        {title: 'Steps and retaining walls', desc: 'Steps and retaining walls in concrete elements and granite, including on sloping ground.'},
        {title: 'Cobblestone work', desc: 'Granite cobbles for edging, beds and entire surfaces.'},
        {title: 'Drainage', desc: 'Linear drains, channels and wells, so surface water is led away from paving and house.'},
        {title: 'Grass reinforcement', desc: 'Drivable green surfaces where grass and paving need to work together.'},
      ],
    },
    prices: {
      h2: 'What does paving cost?',
      note: 'Indicative from-prices excl. VAT. You always get a fixed price before we start.',
      rows: [
        {label: 'Terrace', value: 'from DKK 600/m²'},
        {label: 'Driveway', value: 'from DKK 800/m²'},
      ],
    },
    process: {
      h2: 'How the paving work runs',
      steps: [
        {title: 'Measuring and ground conditions', desc: 'We look at the area, the soil and where the water should go.'},
        {title: 'Fixed price and materials', desc: 'You choose the material for the use and budget, and get a total price with a timeline.'},
        {title: 'Base build-up', desc: 'Excavation, stabilising gravel and screeding with correct falls; the base decides whether paving lasts.'},
        {title: 'Paving and finishing', desc: 'Tiles, stone or cobbles are laid, jointed and compacted, and the area is handed over swept and ready.'},
      ],
      cta: {label: 'Start with a short message'},
      backgroundImage: {alt: 'Sandstone paving and grass reinforcement by a house near the water'},
    },
    ctaImage: {alt: 'New paving with granite steps and retaining wall'},
    faq: {
      h2: 'Questions about paving',
      items: [
        {q: 'What does a new driveway cost?', a: 'Driveways start at DKK 800/m² excl. VAT and terraces at DKK 600/m². The price depends on material and ground conditions, and you get a fixed price before we start.'},
        {q: 'How long does paving work take?', a: 'Typically 3-10 working days depending on area and terrain. The timeline is fixed before we start.'},
        {q: 'What do you do about rainwater and drainage?', a: 'Paving is laid with correct falls, and we install linear drains or channels where needed. In Roskilde, for example, we solved a whole outdoor area with level differences right next to the water.'},
        {q: 'Which materials do you work with?', a: 'Concrete products, granite, sandstone, clinker and cobblestone. We advise on what suits the job, the house and the budget.'},
        {q: 'Why does paving sink, and how do you prevent it?', a: 'Almost always because of a poor base. We excavate, build up with stabilising gravel and compact in layers, so the surface stays level.'},
      ],
    },
    seoText: {
      h2: 'Paving in Copenhagen and Greater Copenhagen',
      text: 'Grønt Land DK carries out all kinds of paving and cobblestone work in Copenhagen and Greater Copenhagen: driveways, terraces, walkways, steps and retaining walls in concrete and granite products. We work for private homeowners and take part as subcontractor on larger projects, such as paving and drainage at ARC Amager Resource Center. Drainage is a fixed part of the job; with correct falls, linear drains and wells the water is led away before it becomes a problem for house or paving. A terrace starts at DKK 600/m² and a driveway at DKK 800/m², both excl. VAT, and most jobs are done in 3-10 working days. If the paving needs to work with the garden, we can plan garden work and paving as one job. Send us a photo of the area and we reply within 24 hours with an assessment.',
      images: [{alt: 'Newly laid tile paving at a private home'}, {alt: 'Walkway with retaining wall and linear drain'}],
    },
  },
  'service-murerarbejde': {
    nav: 'Masonry',
    cardDesc: 'Masonry and façade work for renovation, tiling and structures, built for stability, strength and finish.',
    seo: {
      title: 'Masonry and façade work in Copenhagen | Grønt Land DK',
      description:
        'Masonry in Copenhagen: façade renovation from DKK 300/m², bathrooms, tiling, repointing and tiled roofs. Typically 3-15 working days. Get a quote within 24 hours.',
    },
    hero: {
      label: 'Services',
      h1: 'Masonry and façade work in Copenhagen',
      sub: 'Façade renovation, bathrooms, tiling, repointing and tiled roofs, for private and public clients alike. Masonry has to last for decades, so we care more about the preparation than about finishing fast.',
      image: {alt: 'Roof terrace with new tiles and rendered parapet'},
      ctas: [{label: CTA_QUOTE}, {label: CTA_PROJECTS}],
      trustChips: ['Private and public clients', 'Fixed price before start', 'Typically 3-15 working days'],
    },
    scope: {
      h2: 'Masonry and façade jobs we take on',
      items: [
        {title: 'Façade renovation', desc: 'Preparation, rendering, skim coating and painting of façades; correct preparation is what makes it last.'},
        {title: 'Bathrooms', desc: 'Bathrooms are a speciality, from wet-room sealing to tile and clinker work.'},
        {title: 'Tile and clinker work', desc: 'Floors and walls in tiles, clinker and natural stone, outside and in.'},
        {title: 'Repointing', desc: 'Raking out and repointing brickwork that has become leaky or worn.'},
        {title: 'Tiled roofs', desc: 'Repairing and relaying tiled roofs.'},
        {title: 'New builds, conversions and extensions', desc: 'Masonry for renovations, extensions and modernisation, plus repairs and ongoing maintenance.'},
      ],
    },
    prices: {
      h2: 'What does it cost?',
      note: 'Indicative from-price excl. VAT. You always get a fixed price before we start.',
      rows: [{label: 'Façade rendering', value: 'from DKK 300/m²'}],
    },
    process: {
      h2: 'How the masonry work runs',
      steps: [
        {title: 'Inspecting the brickwork', desc: 'We assess the condition, the damage and how much preparation is needed — that rarely shows on a photo.'},
        {title: 'A quote with a fixed frame', desc: 'Price, materials and timeline in writing, typically 3-15 working days depending on the job.'},
        {title: 'Preparation and protection', desc: 'Windows, doors and surroundings are covered, and the substrate is prepared before rendering, pointing or tiling.'},
        {title: 'Execution and handover', desc: 'The work is done with clean lines and an even surface, and we walk through the result with you at handover.'},
      ],
      cta: {label: 'Start with a short message'},
      backgroundImage: {alt: 'Masonry with a new lintel in a brick wall'},
    },
    ctaImage: {alt: 'Renovated façade on a private home'},
    faq: {
      h2: 'Questions about masonry and façade work',
      items: [
        {q: 'What does façade renovation cost in Copenhagen?', a: 'Façade rendering starts at DKK 300/m² excl. VAT. The total price depends on the condition of the façade and the preparation needed, and you get a fixed price after an inspection.'},
        {q: 'Do you renovate bathrooms?', a: 'Yes, bathrooms are one of our specialities. We handle wet-room sealing, tiles, clinker and pointing, and can include the painting and carpentry in the same plan.'},
        {q: 'How long does masonry work take?', a: 'Most jobs run 3-15 working days. A façade renovation like the one we did on a private home in North Zealand is planned so the residents are disturbed as little as possible.'},
        {q: 'Do you also do smaller repairs?', a: 'Yes — cracks, loose joints, single tiles or a damaged corner. Small jobs get the same preparation as big ones.'},
        {q: 'Why is façade work part of masonry here?', a: 'Because it is the same craft: render, filler and brickwork. One responsible mason across façade and other masonry gives a more consistent result.'},
      ],
    },
    seoText: {
      h2: 'Façade renovation and masonry in Copenhagen',
      text: 'Grønt Land DK carries out all kinds of masonry in Copenhagen and Greater Copenhagen for private and public clients: façade renovation, bathrooms, tile and clinker work, repointing, tiled roofs, plus new builds, conversions and extensions. Façade work is a core job; we prepare, render, skim and paint, and we protect windows, doors and surroundings along the way, as on the façade renovation of a private home in North Zealand. Concrete work belongs to the trade too — in Hellerup we rebuilt a worn concrete stair with new formwork, casting and even step heights. Façade rendering starts at DKK 300/m² excl. VAT, and most masonry jobs take 3-15 working days. If the façade needs painting or the bathroom new joinery as well, we bring the trades together in one plan with one point of contact. Send a few photos of the job and we reply within 24 hours.',
      images: [{alt: 'Renovated façade and outdoor stair'}, {alt: 'Newly laid floor tiles with a natural-stone look'}],
    },
  },
  'service-malerservice': {
    nav: 'Painting',
    cardDesc: 'Painting with correct preparation, a clean finish and precise completion.',
    seo: {
      title: 'Painting in Copenhagen — a clean finish | Grønt Land DK',
      description:
        'Painting in Copenhagen: interior and exterior painting, full skim coating, wallpapering and wet rooms. Typical job 2-7 working days. Get a quote within 24 hours.',
    },
    hero: {
      label: 'Services',
      h1: 'Painting in Copenhagen with a clean finish and precise edges',
      sub: 'We paint every surface from concrete to woodwork, skim, wallpaper and handle wet rooms with silk cement. The preparation decides the result, so we never skip it. Typical job: 2-7 working days.',
      image: {alt: 'Finished living room in light tones with a sea view'},
      ctas: [{label: CTA_QUOTE}, {label: CTA_PROJECTS}],
      trustChips: ['Thorough preparation', 'Clean covering', 'Typically 2-7 working days'],
    },
    scope: {
      h2: 'Painting jobs we take on',
      items: [
        {title: 'Interior painting', desc: 'Walls, ceilings, panelling and doors in new builds and renovations, from the inside out.'},
        {title: 'Full skim coating', desc: 'Full skimming of any surface when the wall needs to be perfectly smooth before painting.'},
        {title: 'Wallpapering', desc: 'Hanging wallpaper and glass fibre lining with precise seams.'},
        {title: 'Wet rooms and silk cement', desc: 'Silk cement in bathrooms and other wet rooms — a durable, waterproof surface.'},
        {title: 'Woodwork, floors and basements', desc: 'Painting every surface from concrete to woodwork, including kitchens, basements and floors.'},
        {title: 'Exterior painting', desc: 'Façades, sheds and outbuildings, painted in dry weather on a correct base.'},
      ],
    },
    process: {
      h2: 'How the painting work runs',
      steps: [
        {title: 'Reviewing the surfaces', desc: 'We look at the condition, earlier treatments and what the base needs before paint will hold.'},
        {title: 'Quote and colours', desc: 'A fixed price and timeline, typically 2-7 working days, plus advice on paint and sheen for the room.'},
        {title: 'Covering and preparation', desc: 'Floors and furnishings are covered, then we skim and sand until the surface is ready.'},
        {title: 'Painting and handover', desc: 'Surfaces are painted with precise edges, and we clean up and walk through the result with you.'},
      ],
      cta: {label: 'Start with a short message'},
      backgroundImage: {alt: 'Painting work in a stairwell with panelling'},
    },
    ctaImage: {alt: 'Freshly painted wall with stucco ceiling'},
    faq: {
      h2: 'Questions about painting',
      items: [
        {q: 'What does painting cost in Copenhagen?', a: 'The price depends on the area, the condition of the surfaces and how much filling the base needs. You get a fixed price before we start, with no surprises along the way.'},
        {q: 'How long does a painting job take?', a: 'Typically 2-7 working days. A single flat is quicker than a whole house, and skimming and drying time are part of the plan from the start.'},
        {q: 'Do you skim before painting?', a: 'Yes, always as needed, and we offer full skim coating when the walls need to be perfectly smooth. The preparation is what you see in the finished result.'},
        {q: 'Do you paint bathrooms and wet rooms?', a: 'Yes. Among other things we apply silk cement in bathrooms — a waterproof surface without tiles — and paint wet rooms with the correct treatment.'},
        {q: 'Do you protect floors and furniture?', a: 'Yes, we cover floors and furnishings before the work starts, and we clean up after ourselves when we finish.'},
      ],
    },
    seoText: {
      h2: 'Painting in Copenhagen and Greater Copenhagen',
      text: 'Grønt Land DK helps with every kind of painting job in Copenhagen and Greater Copenhagen: walls, ceilings, woodwork, floors, kitchens and basements, full skim coating of any surface, wallpapering, and silk cement in bathrooms and other wet rooms. We paint in new builds and renovations, inside and out. A good result is decided before the brush touches the wall; that is why we spend the time on skimming, sanding and clean covering, and draw the lines against ceilings, panels and frames sharply. Most jobs are finished in 2-7 working days at a price fixed in advance. When we paint as part of a larger renovation, the work is coordinated with the mason and carpenter in one plan, so the surfaces are treated in the right order. Send a short description of the rooms, ideally with photos, and we reply within 24 hours.',
      images: [{alt: 'Freshly painted interior room'}, {alt: 'Wallpapering a bedroom'}],
    },
  },
  'service-tomrerarbejde': {
    nav: 'Carpentry',
    cardDesc: 'Carpentry from structure to details, as part of a renovation or as a job of its own.',
    seo: {
      title: 'Carpentry in Copenhagen — decks to roofs | Grønt Land DK',
      description:
        'Carpentry in Copenhagen: timber decks from DKK 1,200/m², roofing, floors, kitchens, doors and windows. Typical job 1-4 weeks. Get a quote within 24 hours.',
    },
    hero: {
      label: 'Services',
      h1: 'Carpentry in Copenhagen from basement to roof ridge',
      sub: 'Timber decks, roofing, floors, kitchen fitting, doors and windows — as a job of its own or as part of a renovation. The structure has to be right before the details can be.',
      image: {alt: 'Finished hardwood deck by a private home'},
      ctas: [{label: CTA_QUOTE}, {label: CTA_PROJECTS}],
      trustChips: ['One point of contact', 'Fixed price before start', 'Typically 1-4 weeks'],
    },
    scope: {
      h2: 'Carpentry jobs we take on',
      items: [
        {title: 'Timber decks', desc: 'Load-bearing structure, levelling and fitting, including hardwoods like Jatoba that demand precise workmanship.'},
        {title: 'Roofing', desc: 'Roof structures and repairs, as part of a renovation or on their own.'},
        {title: 'Floor laying', desc: 'New wooden floors and solid-wood floors, laid level with clean transitions.'},
        {title: 'Kitchens and interiors', desc: 'Fitting kitchens and other interiors, where precise adjustment is half the work.'},
        {title: 'Doors and windows', desc: 'Replacing and fitting doors and windows with tight joints and clean reveals.'},
        {title: 'Garages, carports and sheds', desc: 'Building garages, carports and sheds from foundation to finished cladding.'},
      ],
    },
    prices: {
      h2: 'What does it cost?',
      note: 'Indicative from-price excl. VAT. You always get a fixed price before we start.',
      rows: [{label: 'Timber deck incl. structure', value: 'from DKK 1,200/m²'}],
    },
    process: {
      h2: 'How the carpentry work runs',
      steps: [
        {title: 'Defining the job', desc: 'You describe what needs building or replacing, and we assess the structure and materials.'},
        {title: 'Fixed price and a drawn solution', desc: 'Price, materials and timeline, typically 1-4 weeks depending on scope.'},
        {title: 'Structure first', desc: 'Load-bearing parts, levelling and foundation are done right before surfaces and details go on.'},
        {title: 'Details and handover', desc: 'Precise fitting and finishing, and a walk-through of the finished work with you.'},
      ],
      cta: {label: 'Start with a short message'},
      backgroundImage: {alt: 'Deck under construction with load-bearing structure'},
    },
    ctaImage: {alt: 'New timber deck under construction by a modern villa'},
    faq: {
      h2: 'Questions about carpentry',
      items: [
        {q: 'What does a timber deck cost in Copenhagen?', a: 'Fitting a timber deck including the structure starts at DKK 1,200/m² excl. VAT. Timber type and terrain affect the price, and you get a fixed price before we build.'},
        {q: 'How long does a carpentry job take?', a: 'Typically 1-4 weeks depending on scope. A deck is quicker than a roofing project, and the timeline is agreed before we start.'},
        {q: 'Do you work in hardwoods like Jatoba?', a: 'Yes. In Gentofte we built a deck in Jatoba — a hard, wear-resistant timber that demands precise fitting and correct spacing to stay stable for years.'},
        {q: 'Do you fit kitchens and replace doors and windows?', a: 'Yes, we fit kitchens and other interiors and replace doors and windows, both as single jobs and as part of a larger renovation.'},
        {q: 'Do you build carports and sheds?', a: 'Yes — garages, carports and sheds belong to the trade, from load-bearing structure to finished cladding.'},
      ],
    },
    seoText: {
      h2: 'Carpentry in Copenhagen and Greater Copenhagen',
      text: 'Grønt Land DK offers carpentry in Copenhagen and Greater Copenhagen that takes the whole building into account, from basement to roof ridge: roofing, floor laying, kitchen and interior fitting, doors and windows, and building garages, carports, sheds and decks. Decks are one of the jobs we build most. At a private home in Gentofte we built a Jatoba deck with a load-bearing structure, levelling and precise fitting; hardwood does not forgive sloppy work, so the execution has to be exact. Fitting a timber deck starts at DKK 1,200/m² excl. VAT, and most carpentry jobs are finished in 1-4 weeks. When the carpentry is part of a larger renovation, it is planned together with the mason and painter in one plan. Describe your job in a short message and we reply within 24 hours.',
      images: [{alt: 'Jatoba deck under construction'}, {alt: 'Newly sanded and treated wooden floor in a home'}],
    },
  },
  'service-totalentreprise': {
    nav: 'Turnkey renovation',
    cardDesc: 'A full renovation with several trades, one plan and one responsible contact from start to handover.',
    seo: {
      title: 'Turnkey renovation in Copenhagen — one plan | Grønt Land DK',
      description:
        'Turnkey renovation in Copenhagen: a full renovation with one team, one plan and one contact. Typical project 4-10 weeks. Get a quote within 24 hours.',
    },
    hero: {
      label: 'Services',
      h1: 'Turnkey renovation in Copenhagen: one team, one plan',
      sub: 'You bring the ideas, we bring the solutions and coordinate the whole project, so you are not juggling several crews of tradespeople at once. Typical home project: 4-10 weeks.',
      image: {alt: 'Fully renovated living room with new plank floors'},
      ctas: [{label: CTA_QUOTE}, {label: CTA_PROJECTS}],
      trustChips: ['One team, one plan', 'One responsible contact', 'Typically 4-10 weeks'],
    },
    scope: {
      h2: 'What a turnkey renovation covers',
      items: [
        {title: 'Full home renovation', desc: 'A complete upgrade of the home, from technical installations to finish and details.'},
        {title: 'Coordinating every trade', desc: 'Mason, carpenter, painter and paving crew work to the same timeline and the same standard.'},
        {title: 'Bathrooms and kitchens', desc: 'Renovation with, say, natural-stone tiles and concealed lighting, plus fitting a new kitchen and utility room.'},
        {title: 'Floors, ceilings and finish', desc: 'New solid-wood floors, ceilings with built-in spots and finishing work on walls and surfaces.'},
        {title: 'Custom solutions', desc: 'Joiner-designed cabinets, storage and special rooms — in Skodsborg, for instance, a wine cellar with integrated lighting.'},
        {title: 'The unforeseen', desc: 'Renovation is rarely predictable; we handle the surprises without losing the plan.'},
      ],
    },
    process: {
      h2: 'How a turnkey renovation runs',
      steps: [
        {title: 'Your ideas, our solutions', desc: 'You tell us what the home should do, and we propose how to make it happen.'},
        {title: 'One plan, one fixed frame', desc: 'Every trade goes into one timeline with one price and one responsible contact from start to handover.'},
        {title: 'Execution across the trades', desc: 'The work is done in the right order, and you get regular updates without coordinating anything yourself.'},
        {title: 'Walk-through and handover', desc: 'The project is reviewed room by room, and the home is handed over finished and ready to use.'},
      ],
      cta: {label: 'Start with a short message'},
      backgroundImage: {alt: 'New utility room with custom-built cabinets'},
    },
    ctaImage: {alt: 'New staircase and joinery in a villa'},
    faq: {
      h2: 'Questions about turnkey renovation',
      items: [
        {q: 'What is a turnkey renovation?', a: 'One agreement covering the whole renovation: every trade, one timeline and one responsible contact. You describe what the home should do, and we handle solutions, coordination and execution.'},
        {q: 'How long does a full home renovation take?', a: 'A typical home project takes 4-10 weeks depending on scope. The timeline is planned across the trades from the start, so no one is waiting on anyone.'},
        {q: 'What does a turnkey renovation cost?', a: 'It depends entirely on the scope, so there is no meaningful square-metre price. After a walk-through of the home you get a fixed frame for price and process before the work starts.'},
        {q: 'What if unforeseen problems turn up?', a: 'Renovation demands flexibility, and that is exactly what a turnkey agreement solves: we handle the unforeseen, adjust the plan and keep you informed, instead of the problem landing between two tradespeople.'},
        {q: 'Can you show an example of a full renovation?', a: 'In Skodsborg we fully renovated a villa inside: new solid-wood floors, custom joinery, a wine cellar with integrated lighting, natural-stone bathrooms, plus a new kitchen and utility room.'},
      ],
    },
    seoText: {
      h2: 'Turnkey and full renovation in Copenhagen',
      text: 'Grønt Land DK carries out turnkey renovations in Copenhagen and Greater Copenhagen: full renovations where several trades work to one plan with one responsible contact. The client brings the ideas, and we propose how to realise them, then coordinate the project so you can spend your time on better things than managing several crews at once. Renovation is rarely predictable; that is exactly why flexibility and the ability to handle the unforeseen are part of the agreement. The villa in Skodsborg shows the range: solid-wood floors, joiner-designed cabinets, a wine cellar with custom racks, natural-stone bathrooms, a new kitchen and utility room, and ceilings with built-in spots, all in a modern Scandinavian style. A typical home project takes 4-10 weeks with a fixed frame agreed up front. Tell us about your project and we reply within 24 hours with the next step.',
      images: [{alt: 'Custom shelving wall in a renovated living room'}, {alt: 'Wine cellar with integrated lighting'}],
    },
  },
  'service-demonteringsarbejde': {
    nav: 'Demolition & strip-out',
    cardDesc: 'Take-down and preparatory work before renovation or a new build.',
    seo: {
      title: 'Demolition and strip-out in Copenhagen | Grønt Land DK',
      description:
        'Strip-out in Copenhagen: controlled removal of kitchens, bathrooms, walls and outdoor structures before renovation. Get a quote within 24 hours.',
    },
    hero: {
      label: 'Services',
      h1: 'Strip-out in Copenhagen: taking down before building up',
      sub: 'A renovation rarely starts with building something; first the old has to come down, and it has to come down in a controlled way, without damaging what stays. We strip out, sort and make ready for the next trade.',
      image: {alt: 'Reinforced foundation ready for casting on a construction site'},
      ctas: [{label: CTA_QUOTE}, {label: CTA_PROJECTS}],
      trustChips: ['Controlled take-down', 'Covering and clean-up', 'Ready for the next trade'],
    },
    scope: {
      h2: 'What we take down',
      items: [
        {title: 'Interior strip-out', desc: 'Kitchens, bathrooms, partition walls, floors and ceilings removed in preparation for renovation.'},
        {title: 'Outdoor structures', desc: 'Old decks, sheds and paving taken up before the new is built.'},
        {title: 'Covering and dust control', desc: 'Adjoining rooms and surfaces are covered, so the demolition does not spread through the home.'},
        {title: 'Sorting and removal', desc: 'The waste is sorted and driven away, so the site is clear when the next trade arrives.'},
        {title: 'Ready for build-up', desc: 'Substrates and connections are left ready — often as the first stage of a full renovation with us.'},
      ],
    },
    process: {
      h2: 'How the strip-out runs',
      steps: [
        {title: 'Reviewing the job', desc: 'We look at what comes down, what stays, and what the access is like.'},
        {title: 'Agreement and timeline', desc: 'You get a fixed price and a plan that accounts for neighbours, access and waste removal.'},
        {title: 'Covering and take-down', desc: 'We cover up, then take down in a controlled way so load-bearing parts and adjoining rooms are unharmed.'},
        {title: 'Clean-up and handover', desc: 'Waste is sorted and removed, and the area is handed over cleared and ready for building.'},
      ],
      cta: {label: 'Start with a short message'},
      backgroundImage: {alt: 'Drainage work on a construction site'},
    },
    ctaImage: {alt: 'Masonry with a new lintel in a brick wall'},
    faq: {
      h2: 'Questions about demolition and strip-out',
      items: [
        {q: 'What does strip-out work cover?', a: 'Take-down and preparatory work before renovation or a new build: kitchens, bathrooms, walls, floors, and outdoor structures like old decks and paving.'},
        {q: 'Do you remove the waste too?', a: 'Yes. The waste is sorted and driven away as part of the job, so you are not left dealing with containers and disposal.'},
        {q: 'Can you do just the demolition if others build?', a: 'Yes, strip-out can be booked on its own. Many clients let us handle the build-up too, so take-down and renovation sit in one plan.'},
        {q: 'How do you avoid dust damage in the rest of the home?', a: 'We cover adjoining rooms, floors and furnishings before we start, and control the dust at the source, so the demolition stays a local operation.'},
        {q: 'What does strip-out cost?', a: 'The price depends on scope, materials and access, so there is no fixed square-metre price. Send photos of what needs to come down and you get a fixed price before we start.'},
      ],
    },
    seoText: {
      h2: 'Demolition and strip-out in Copenhagen and Greater Copenhagen',
      text: 'Grønt Land DK carries out strip-out work in Copenhagen and Greater Copenhagen as preparation for renovation and new build-up. Inside, we take down kitchens, bathrooms, partition walls, floors and ceilings; outside, we remove old decks, sheds and paving. The take-down is controlled: adjoining rooms are covered, dust is contained, and load-bearing structures are left alone until the facts are clear. The waste is sorted and driven away, so the site is clear when the mason, carpenter or paving crew arrives. That is exactly the advantage of keeping the job with us; strip-out is in practice the first stage of most of our turnkey renovations, and when the same team plans take-down and build-up, you avoid waiting between trades. Describe what needs to come down, ideally with a few photos, and we reply within 24 hours with a fixed price.',
      images: [{alt: 'Outdoor area being relaid'}, {alt: 'Renovated outdoor stairs with new tiles'}],
    },
  },
  'service-rengoringsarbejde': {
    nav: 'Cleaning',
    cardDesc: 'Cleaning after renovation and construction, plus practical cleaning in private homes.',
    seo: {
      title: 'Post-renovation cleaning in Copenhagen | Grønt Land DK',
      description:
        'Builders cleaning in Copenhagen: thorough cleaning after renovation and construction, plus practical cleaning in private homes. Get a quote within 24 hours.',
    },
    hero: {
      label: 'Services',
      h1: 'Cleaning after renovation and construction in Copenhagen',
      sub: 'A renovation is not finished until the dust is gone. We handle the builders cleaning after the tradespeople and also offer practical cleaning in private homes, so the home is ready to live in — not just ready to hand over.',
      image: {alt: 'Freshly painted interior room'},
      ctas: [{label: CTA_QUOTE}, {label: CTA_PROJECTS}],
      trustChips: ['Ready to move in', 'Part of one plan', 'A fixed agreement'],
    },
    scope: {
      h2: 'What we clean',
      items: [
        {title: 'Builders cleaning after renovation', desc: 'Construction dust removed from floors, surfaces, cabinets and fittings — including where it settled in the rooms next door.'},
        {title: 'Windows and surfaces', desc: 'Windows, frames, tiles and fittings cleaned after painting, masonry and carpentry.'},
        {title: 'Practical cleaning in private homes', desc: 'Recurring or one-off cleaning of the home, with scope and frequency by agreement.'},
        {title: 'The last stage of a turnkey job', desc: 'On full renovations we hand the home over cleaned, so you can move straight into the result.'},
      ],
    },
    process: {
      h2: 'How the cleaning runs',
      steps: [
        {title: 'You describe the job', desc: 'After a renovation, as a recurring arrangement or a single thorough round; you set the frame.'},
        {title: 'Agreeing the scope', desc: 'We agree which rooms and surfaces are included, and when the work fits best.'},
        {title: 'The cleaning is done', desc: 'We work systematically room by room, top down, so the dust is not just moved around.'},
        {title: 'Walk-through', desc: 'You get a home ready to use — and a date for next time, if the cleaning is recurring.'},
      ],
      cta: {label: 'Start with a short message'},
      backgroundImage: {alt: 'Fully renovated living room with new plank floors'},
    },
    ctaImage: {alt: 'Finished living room in light tones with a sea view'},
    faq: {
      h2: 'Questions about cleaning',
      items: [
        {q: 'What is builders cleaning?', a: 'The thorough cleaning after a renovation or construction job: construction dust on every surface, spots of filler and paint, protective film and leftovers removed, so the home is ready to use.'},
        {q: 'Do you offer recurring cleaning in private homes?', a: 'Yes, we offer practical cleaning in private homes, both recurring and one-off. Scope and frequency are agreed to fit your everyday life.'},
        {q: 'Is cleaning included when you renovate for us?', a: 'On turnkey renovations the cleaning can go in as the final stage of the plan, so the home is handed over cleaned rather than swept. Say so when we make the agreement, and we price it in.'},
        {q: 'What does cleaning cost?', a: 'The price depends on the size of the home and the scope; builders cleaning takes more than regular cleaning. Describe the job briefly and you get a fixed price before we start.'},
      ],
    },
    seoText: {
      h2: 'Builders cleaning and private cleaning in Copenhagen',
      text: 'Grønt Land DK does cleaning work in Copenhagen and Greater Copenhagen on two tracks: builders cleaning after renovation and construction, and practical cleaning in private homes. Construction dust is finer than household dust and settles everywhere, even in rooms that were never renovated; that is why we clean systematically, top down, room by room, until the home is ready to use. For clients who have a full renovation done with us, the cleaning is the natural last stage of the plan: same team, same agreement, and a home handed over ready to move into. Practical cleaning in private homes is agreed in scope and frequency, from a single thorough round to a fixed arrangement. Send a short description of the home and the job, and we reply within 24 hours with a fixed price.',
      images: [{alt: 'New utility room with custom-built cabinets'}, {alt: 'Custom-designed cabinets with built-in lighting'}],
    },
  },

  // ---------------------------------------------------------- page singletons
  galleriPage: {
    seo: {
      title: 'Gallery — completed work in Copenhagen | Grønt Land DK',
      description:
        'See photos of completed work: paving, timber decks, façades, painting and full renovations in Copenhagen and Greater Copenhagen. Get a quote for your job.',
    },
    hero: {
      label: 'Gallery',
      h1: 'Gallery of completed work',
      sub: 'These photos are from our own jobs in Copenhagen and Greater Copenhagen: decks, façades, paving, painting and whole renovations. Use the filters and see the trade you are considering.',
      image: {alt: 'New paving with granite steps and retaining wall'},
    },
    seoText: {
      h2: 'Photos from real jobs',
      text: 'Every photo in the gallery is from work Grønt Land DK has carried out itself; there are no stock photos here. You can see paving in sandstone and granite, hardwood decks, rendered façades, painting, and complete renovations like the villa in Skodsborg. Looking for something specific — new paving for the driveway, say, or bathroom tiling — filter by trade. Does one of these look like your job? Send us a few photos and a short description, and we reply within 24 hours with an assessment and the next step.',
    },
    cta: {
      h2: 'Should we look at your job?',
      text: 'Send a short description and a few photos if you have them. We assess the job and reply within 24 hours.',
      primary: {label: CTA_QUOTE},
      crosslinks: [{label: 'See projects'}, {label: 'See services'}],
      image: {alt: 'Sandstone paving by a home near the coast'},
    },
  },
  projekterPage: {
    seo: {
      title: 'Projects | Grønt Land DK',
      description:
        'See examples of renovation, paving, façades, garden work and other jobs carried out for homeowners and businesses.',
    },
    h1: 'Projects',
    sub: 'See examples of renovation, paving, façades, garden work and other jobs carried out for homeowners and businesses.',
    emptyFilter: 'No projects in this category yet.',
    cta: {
      h2: 'Discuss your project',
      text: 'Tell us briefly about the job, and we come back with the next step — whether you are a homeowner or a contractor.',
      primary: {label: CTA_QUOTE},
      image: {alt: 'New concrete steps with a white balustrade'},
    },
  },
  ydelserIndexPage: {
    seo: {
      title: 'Services — renovation and construction in Copenhagen | Grønt Land DK',
      description:
        'See all services: garden work, paving, masonry and façades, painting, carpentry, turnkey renovation, strip-out and cleaning in Copenhagen. Get a quote within 24 hours.',
    },
    hero: {
      label: 'Services',
      h1: 'Services: renovation and construction in Copenhagen',
      sub: 'We take on interior and exterior work, as a single trade or brought together in one plan with one responsible contact. Pick a trade below and see what the job typically covers, what it costs and how the process runs.',
      image: {alt: 'Landscaped garden with stone bed and planting'},
    },
    cta: {
      h2: 'Not sure which trade your job belongs to?',
      text: 'You don’t need to know. Describe the job briefly, and we assess the scope and the trades and reply within 24 hours.',
      primary: {label: CTA_QUOTE},
      crosslinks: [{label: 'See projects'}, {label: 'Open the gallery'}],
      image: {alt: 'Paving and garden landscaping by a home'},
    },
  },
}

async function main() {
  console.log(`Translating (en) in ${client.config().projectId}/${client.config().dataset} …`)
  const tx = client.transaction()
  let count = 0
  for (const [id, spec] of Object.entries(EN)) {
    const doc = await client.getDocument(id)
    if (!doc) {
      console.warn(`  MISSING doc: ${id}`)
      continue
    }
    apply(doc, spec)
    tx.createOrReplace(doc)
    count++
  }
  await tx.commit()
  console.log(`Done: en applied to ${count} documents.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
