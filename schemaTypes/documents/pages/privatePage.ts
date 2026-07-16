import {defineField, defineType} from 'sanity'

/* Singleton — /private (audience landing for homeowners). Popular-task
   cards use cardGrid items with image + two links (service + example). */
export const privatePage = defineType({
  name: 'privatePage',
  title: 'Private kunder',
  type: 'document',
  fields: [
    defineField({name: 'seo', title: 'SEO', type: 'seoMeta', validation: (r) => r.required()}),
    defineField({name: 'hero', title: 'Hero', type: 'heroSection', validation: (r) => r.required()}),
    defineField({name: 'benefits', title: 'Benefits', type: 'cardGrid'}),
    defineField({name: 'types', title: 'Popular tasks (image + links per card)', type: 'cardGrid'}),
    defineField({name: 'projects', title: 'Selected projects', type: 'teaserSection'}),
    defineField({name: 'faq', title: 'FAQ', type: 'faqSection'}),
    defineField({name: 'cta', title: 'Closing CTA', type: 'ctaBand'}),
  ],
  preview: {prepare: () => ({title: 'Private kunder'})},
})
