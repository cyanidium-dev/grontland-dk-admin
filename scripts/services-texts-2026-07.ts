/**
 * Masonry / Turnkey / Carpentry / Painting page text edits per the four
 * client specs (2026-07-24, Gront_Land_DK_*_EN_edits.md): ~38 EN field
 * rewrites + DA masonry parity (the "private og offentlige bygherrer"
 * audience error exists in the Danish source too, and the "same craft" FAQ
 * is replaced in both languages). Prices/timelines kept verbatim — client
 * to confirm before publication (workspace docs/client-open-questions.md).
 * Idempotent set-patches.
 *
 * Run from CMS/:  npx sanity exec scripts/services-texts-2026-07.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-08-15'})

const SETS: Record<string, Record<string, string>> = {
  // ------------------------------------------------------------- masonry
  'service-murerarbejde': {
    'hero.sub.en':
      'Façade renovation, bathroom work, tiling, repointing and tiled roofs for homeowners and contractors. Careful preparation helps ensure a durable, consistent finish.',
    'hero.trustChips[_key=="k005l"].en': 'Homeowners and contractors',
    'scope.items[_key=="k005p"].desc.en':
      'Bathroom work, from wet-room sealing to wall and floor tiling.',
    'scope.items[_key=="k005q"].title.en': 'Wall and floor tiling',
    'scope.items[_key=="k005q"].desc.en':
      'Tiles and natural stone for floors and walls, indoors and outdoors.',
    'prices.note.en':
      'Indicative starting price, excluding VAT. You always receive a fixed quote before work begins.',
    'process.steps[_key=="k005w"].title.en': 'A clear quote and schedule',
    'process.steps[_key=="k005w"].desc.en':
      'You receive the price, materials and timeline in writing. Most jobs take 3–15 working days, depending on the scope.',
    'faq.items[_key=="k0061"].a.en':
      'Façade rendering starts at DKK 300/m² excl. VAT. The total price depends on the condition of the façade and the preparation required. You receive a fixed quote after an inspection.',
    'faq.items[_key=="k0062"].a.en':
      'Yes. We handle wet-room sealing, wall and floor tiling, and grouting, and can include painting and carpentry in the same plan.',
    'faq.items[_key=="k0063"].a.en':
      'Most jobs take 3–15 working days. Façade renovation is planned to minimise disruption to residents.',
    'faq.items[_key=="k0065"].q.en': 'Can façade work be combined with painting?',
    'faq.items[_key=="k0065"].a.en':
      'Yes. We can coordinate masonry, surface preparation and painting under one plan with one responsible contact.',
    'seoText.text.en':
      'Grønt Land DK provides masonry and façade work for homeowners and contractors in Copenhagen and Greater Copenhagen. We renovate façades, carry out repointing and tiling, repair tiled roofs, and complete masonry for renovations, conversions and extensions. Bathroom and façade work can also be coordinated with painting and carpentry under one plan and one responsible contact. Façade rendering starts at DKK 300/m² excl. VAT, and most masonry jobs take 3–15 working days. Send us a short description and a few photos of the job, and we will reply within 24 hours.',
    'seo.description.en':
      'Masonry and façade work in Copenhagen: rendering from DKK 300/m², bathrooms, tiling and repointing. Typical timeline: 3–15 working days.',
    // DA parity — audience error + replaced FAQ (same rationale as EN)
    'hero.trustChips[_key=="k005l"].da': 'Boligejere og entreprenører',
    'hero.sub.da':
      'Facaderenovering, badeværelser, fliser, fugearbejde og tegltag, udført for boligejere og entreprenører. Murværket skal holde i årtier, så vi går mere op i forarbejdet end i at blive hurtigt færdige.',
    'faq.items[_key=="k0065"].q.da': 'Kan facadearbejde kombineres med malerarbejde?',
    'faq.items[_key=="k0065"].a.da':
      'Ja. Vi kan koordinere murerarbejde, forberedelse af overflader og malerarbejde i én plan med én ansvarlig kontakt.',
  },
  // ------------------------------------------------------------- turnkey
  'service-totalentreprise': {
    'hero.sub.en':
      'You bring the ideas, and we develop the solutions and coordinate the entire project, so you do not have to manage several trades yourself. A typical home renovation takes 4–10 weeks.',
    'scope.items[_key=="k007q"].desc.en':
      'Bathroom renovation with natural-stone tiles and concealed lighting, plus fitting a new kitchen and utility room.',
    'scope.items[_key=="k007r"].desc.en':
      'New solid-wood floors, ceilings with recessed spotlights, and finishing work on walls and other surfaces.',
    'scope.items[_key=="k007s"].desc.en':
      'Custom-built cabinetry, storage solutions and specialist rooms — including a wine cellar with integrated lighting in Skodsborg.',
    'scope.items[_key=="k007t"].title.en': 'Unexpected issues',
    'scope.items[_key=="k007t"].desc.en':
      'Renovation can reveal unexpected issues. We adjust the plan, coordinate the necessary work and keep you informed.',
    'process.steps[_key=="k007u"].desc.en':
      'You tell us how you want the home to function, and we propose practical solutions.',
    'process.steps[_key=="k007v"].title.en': 'One plan and one clear agreement',
    'process.steps[_key=="k007v"].desc.en':
      'All agreed trades are included in one timeline, with a clear quote and one responsible contact from start to handover.',
    'process.steps[_key=="k007w"].desc.en':
      'The work is completed in the agreed sequence, and you receive regular updates without having to coordinate each trade yourself.',
    'faq.items[_key=="k0080"].a.en':
      'One agreement covers the entire renovation: all agreed trades, one timeline and one responsible contact. You describe how you want the home to function, and we handle planning, coordination and execution.',
    'faq.items[_key=="k0081"].a.en':
      'A typical home renovation takes 4–10 weeks, depending on the scope. The trades are scheduled together from the start to reduce delays between stages.',
    'faq.items[_key=="k0082"].a.en':
      'The cost depends on the scope, condition of the property and selected materials. After a walk-through, you receive a clear quote covering the price, scope and process before work begins.',
    'faq.items[_key=="k0083"].a.en':
      'If unexpected issues arise, we assess them, explain the available options and adjust the plan with your approval. One responsible contact coordinates the required trades.',
    'faq.items[_key=="k0084"].a.en':
      'In Skodsborg, we completed a full interior renovation of a villa, including solid-wood floors, custom joinery, a wine cellar with integrated lighting, natural-stone bathroom finishes, a new kitchen and a utility room.',
    'seoText.text.en':
      'Grønt Land DK provides turnkey and full home renovation in Copenhagen and Greater Copenhagen. We coordinate masonry, carpentry, painting and other agreed trades under one project plan with one responsible contact. The work can include bathrooms, kitchens, flooring, ceilings, custom joinery and technical installations. A typical home renovation takes 4–10 weeks, depending on the scope. Before work begins, you receive a clear quote, timeline and description of the agreed work. Tell us about your project, and we will reply within 24 hours with the next step.',
  },
  // ----------------------------------------------------------- carpentry
  'service-tomrerarbejde': {
    'hero.sub.en':
      'Timber decks, roofing, flooring, kitchen fitting, doors and windows — as standalone projects or as part of a renovation. A durable result starts with the right structure.',
    'scope.items[_key=="k0071"].desc.en':
      'Roof structures and repairs, either as standalone projects or as part of a renovation.',
    'scope.items[_key=="k0072"].desc.en':
      'New timber flooring, including solid wood, laid level with clean transitions.',
    'scope.items[_key=="k0073"].desc.en':
      'Kitchen and interior fitting with careful alignment and precise finishing.',
    'prices.note.en':
      'Indicative starting price, excluding VAT. You always receive a fixed quote before work begins.',
    'process.steps[_key=="k0078"].title.en': 'A clear quote and plan',
    'process.steps[_key=="k0078"].desc.en':
      'You receive the price, materials and timeline in writing. Most jobs take 1–4 weeks, depending on the scope.',
    'process.steps[_key=="k0079"].desc.en':
      'Load-bearing elements, levelling and foundations are completed before surfaces and finishing details are added.',
    'process.steps[_key=="k007a"].desc.en':
      'We complete the fitting and finishing, then review the finished work with you before handover.',
    'faq.items[_key=="k007c"].a.en':
      'A timber deck, including the supporting structure, starts at DKK 1,200/m² excl. VAT. The timber type and site conditions affect the final price, and you receive a fixed quote before work begins.',
    'faq.items[_key=="k007d"].a.en':
      'A typical carpentry job takes 1–4 weeks, depending on the scope. A deck is usually quicker than a roofing project, and the timeline is agreed before work begins.',
    'faq.items[_key=="k007g"].a.en':
      'Yes. We build garages, carports and sheds, from the load-bearing structure to the finished cladding.',
    'seoText.text.en':
      'Grønt Land DK provides carpentry services in Copenhagen and Greater Copenhagen. We build timber decks, roof structures, timber floors, kitchens and interiors, and fit doors and windows. We also build garages, carports and sheds. A timber deck, including the supporting structure, starts at DKK 1,200/m² excl. VAT, and most carpentry jobs take 1–4 weeks. Carpentry can also be coordinated with masonry and painting under one plan and one responsible contact. Send us a short description and a few photos of the job, and we will reply within 24 hours.',
    'seo.description.en':
      'Carpentry in Copenhagen: timber decks from DKK 1,200/m², roofing, flooring, kitchens, doors and windows. Typical timeline: 1–4 weeks.',
  },
  // ------------------------------------------------------------ painting
  'service-malerservice': {
    'hero.sub.en':
      'We paint interior and exterior surfaces, carry out skim coating and wallpapering, and apply Silkecement in wet rooms. Careful preparation helps ensure a clean, durable finish. A typical job takes 2–7 working days.',
    'scope.items[_key=="k006d"].desc.en':
      'Walls, ceilings, panelling and doors in new builds and renovation projects.',
    'scope.items[_key=="k006e"].desc.en':
      'Full skim coating for walls and ceilings that need a smooth, even surface before painting.',
    'scope.items[_key=="k006g"].title.en': 'Wet rooms and Silkecement',
    'scope.items[_key=="k006g"].desc.en':
      'Silkecement for bathrooms and other wet rooms — a durable, seamless and waterproof finish.',
    'scope.items[_key=="k006i"].desc.en':
      'Façades, sheds and outbuildings, with proper surface preparation and suitable weather conditions.',
    'process.steps[_key=="k006j"].desc.en':
      'We assess the condition, previous treatments and the preparation required for proper paint adhesion.',
    'process.steps[_key=="k006k"].desc.en':
      'You receive a fixed quote and timeline, typically 2–7 working days, plus advice on paint type and sheen.',
    'faq.items[_key=="k006o"].a.en':
      'The price depends on the area, the condition of the surfaces and the preparation required. You receive a fixed quote before work begins.',
    'faq.items[_key=="k006p"].a.en':
      'A typical painting job takes 2–7 working days. A single flat is usually quicker than a whole house, and the schedule includes preparation and drying time.',
    'faq.items[_key=="k006q"].a.en':
      'Yes, when required. We also provide full skim coating when walls need a smooth, even surface before painting. Proper preparation helps produce a cleaner final result.',
    'faq.items[_key=="k006r"].a.en':
      'Yes. We apply Silkecement in bathrooms as a waterproof, seamless alternative to tiles, and use suitable paint systems for other wet-room surfaces.',
    'seoText.text.en':
      'Grønt Land DK provides interior and exterior painting services in Copenhagen and Greater Copenhagen. We paint walls, ceilings, woodwork, floors, façades and other prepared surfaces, and also carry out skim coating, wallpapering and Silkecement finishes for wet rooms. Careful covering, filling and sanding help create a clean, durable result. Most painting jobs take 2–7 working days and are completed for a fixed quote agreed in advance. Painting can also be coordinated with masonry and carpentry under one plan and one responsible contact. Send us a short description and a few photos, and we will reply within 24 hours.',
    'seo.description.en':
      'Painting in Copenhagen: interior and exterior painting, skim coating, wallpapering and wet rooms. Typical timeline: 2–7 working days.',
  },
}

async function run() {
  for (const [id, set] of Object.entries(SETS)) {
    await client.patch(id).set(set).commit()
    console.log(`✓ ${id}: set ${Object.keys(set).length} fields`)
  }
  // Masonry DA seoText: phrase swap only — fetch + replace keeps the rest
  // of the (long) Danish paragraph byte-identical and the script idempotent.
  const daText: string = await client.fetch(
    `*[_id == "service-murerarbejde"][0].seoText.text.da`,
  )
  const swapped = daText.replace('for private og offentlige bygherrer', 'for boligejere og entreprenører')
  if (swapped !== daText) {
    await client.patch('service-murerarbejde').set({'seoText.text.da': swapped}).commit()
    console.log('✓ service-murerarbejde: seoText.text.da audience phrase swapped')
  } else {
    console.log('= service-murerarbejde: seoText.text.da already updated')
  }
}

run()
