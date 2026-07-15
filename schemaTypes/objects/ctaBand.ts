import {defineField, defineType} from 'sanity'

/* Closing CTA band on every inner page. Rendered by CtaBand; the phone
   button comes from siteSettings, not from here. */
export const ctaBand = defineType({
  name: 'ctaBand',
  title: 'CTA band',
  type: 'object',
  fields: [
    defineField({name: 'h2', title: 'Heading', type: 'localeString', validation: (r) => r.required()}),
    defineField({name: 'text', title: 'Text', type: 'localeText', validation: (r) => r.required()}),
    defineField({name: 'primary', title: 'Primary CTA', type: 'ctaLink', validation: (r) => r.required()}),
    defineField({
      name: 'crosslinks',
      title: 'Crosslinks',
      type: 'array',
      of: [{type: 'ctaLink'}],
      validation: (r) => r.max(3),
    }),
    defineField({name: 'image', title: 'Photo (right bleed)', type: 'imageWithAlt'}),
  ],
  preview: {select: {title: 'h2.da'}},
})
