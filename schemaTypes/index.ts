/**
 * Schema registry. Merge map (which site sections share which type):
 * docs/superpowers/plans/2026-07-15-cms-schemas-phase2.md in the workspace.
 */
import {ctaBand} from './objects/ctaBand'
import {ctaLink} from './objects/ctaLink'
import {cardGrid} from './objects/cardGrid'
import {faqSection} from './objects/faqSection'
import {heroSection} from './objects/heroSection'
import {imageWithAlt} from './objects/imageWithAlt'
import {seoMeta} from './objects/seoMeta'
import {seoTextSection} from './objects/seoTextSection'
import {stepsSection} from './objects/stepsSection'
import {teaserSection} from './objects/teaserSection'

import {galleryCategory} from './documents/galleryCategory'
import {project} from './documents/project'
import {quoteForm} from './documents/quoteForm'
import {service} from './documents/service'
import {siteSettings} from './documents/siteSettings'

import {entreprenorerPage} from './documents/pages/entreprenorerPage'
import {galleriPage} from './documents/pages/galleriPage'
import {homePage} from './documents/pages/homePage'
import {kontaktPage} from './documents/pages/kontaktPage'
import {omOsPage} from './documents/pages/omOsPage'
import {privatePage} from './documents/pages/privatePage'
import {projekterPage} from './documents/pages/projekterPage'
import {ydelserIndexPage} from './documents/pages/ydelserIndexPage'

export const schemaTypes = [
  // primitives
  imageWithAlt,
  ctaLink,
  seoMeta,
  // merged section objects
  heroSection,
  cardGrid,
  stepsSection,
  faqSection,
  seoTextSection,
  ctaBand,
  teaserSection,
  // settings + collections
  siteSettings,
  quoteForm,
  galleryCategory,
  project,
  service,
  // page singletons
  homePage,
  omOsPage,
  kontaktPage,
  privatePage,
  entreprenorerPage,
  projekterPage,
  ydelserIndexPage,
  galleriPage,
]
