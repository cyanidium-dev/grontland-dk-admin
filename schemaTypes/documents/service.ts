import {defineField, defineType} from 'sanity'

/* Service page — mirrors Frontend/Preview service content.
   Fixed section order lives in the frontend route; editors fill the fields.
   No public price list (removed Aug 2026 — forespørgsel CTAs). */
export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({name: 'nav', title: 'Name (nav/footer label)', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'nav'},
      validation: (r) => r.required(),
    }),
    defineField({name: 'order', title: 'Menu order', type: 'number'}),
    defineField({
      name: 'cardDesc',
      title: 'Card description (home teaser + /ydelser index; falls back to hero sub)',
      type: 'text',
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seoMeta', validation: (r) => r.required()}),
    defineField({name: 'hero', title: 'Hero', type: 'heroSection', validation: (r) => r.required()}),
    defineField({name: 'scope', title: 'Scope ("Hvad laver vi")', type: 'cardGrid', validation: (r) => r.required()}),
    defineField({name: 'process', title: 'Process', type: 'stepsSection', validation: (r) => r.required()}),
    defineField({name: 'ctaImage', title: 'Closing CTA photo', type: 'imageWithAlt'}),
    defineField({
      name: 'cases',
      title: 'Case projects (1–2)',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'project'}]}],
      validation: (r) => r.max(2),
    }),
    defineField({
      name: 'galleryCategory',
      title: 'Gallery category (photo strip)',
      type: 'reference',
      to: [{type: 'galleryCategory'}],
      validation: (r) => r.required(),
    }),
    defineField({name: 'faq', title: 'FAQ', type: 'faqSection', validation: (r) => r.required()}),
    defineField({name: 'seoText', title: 'SEO text block', type: 'seoTextSection', validation: (r) => r.required()}),
  ],
  orderings: [{title: 'Menu order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'nav', subtitle: 'slug.current'}},
})
