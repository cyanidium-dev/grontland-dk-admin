import {defineField, defineType} from 'sanity'

/* Service page — mirrors Frontend constants/services `ServiceContent`.
   Fixed section order lives in the frontend route; editors fill the fields.
   prices is optional: the section hides when empty (never invent prices). */
export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({name: 'nav', title: 'Name (nav/footer label)', type: 'localeString', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Slug (Danish, both locales)',
      type: 'slug',
      options: {source: 'nav.da'},
      validation: (r) => r.required(),
    }),
    defineField({name: 'order', title: 'Menu order', type: 'number'}),
    defineField({name: 'seo', title: 'SEO', type: 'seoMeta', validation: (r) => r.required()}),
    defineField({name: 'hero', title: 'Hero', type: 'heroSection', validation: (r) => r.required()}),
    defineField({name: 'scope', title: 'Scope ("Hvad laver vi")', type: 'cardGrid', validation: (r) => r.required()}),
    defineField({name: 'prices', title: 'Prices (optional — hides when empty)', type: 'priceList'}),
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
  preview: {select: {title: 'nav.da', subtitle: 'slug.current'}},
})
