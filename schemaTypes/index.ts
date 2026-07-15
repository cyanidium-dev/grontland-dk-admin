/**
 * Schema registry. Merge map (which site sections share which type):
 * docs/superpowers/plans/2026-07-15-cms-schemas-phase2.md in the workspace.
 * Phase 2b adds the page singletons (home, om, kontakt, private, b2b,
 * ydelser index, galleri) composed from the same objects.
 */
import {ctaBand} from './objects/ctaBand'
import {ctaLink} from './objects/ctaLink'
import {cardGrid} from './objects/cardGrid'
import {faqSection} from './objects/faqSection'
import {heroSection} from './objects/heroSection'
import {imageWithAlt} from './objects/imageWithAlt'
import {localeString, localeText} from './objects/locale'
import {priceList} from './objects/priceList'
import {seoMeta} from './objects/seoMeta'
import {seoTextSection} from './objects/seoTextSection'
import {stepsSection} from './objects/stepsSection'

import {galleryCategory} from './documents/galleryCategory'
import {project} from './documents/project'
import {service} from './documents/service'
import {siteSettings} from './documents/siteSettings'

export const schemaTypes = [
  // primitives
  localeString,
  localeText,
  imageWithAlt,
  ctaLink,
  seoMeta,
  // merged section objects
  heroSection,
  cardGrid,
  stepsSection,
  faqSection,
  priceList,
  seoTextSection,
  ctaBand,
  // documents
  siteSettings,
  galleryCategory,
  project,
  service,
]
