import {defineField, defineType} from 'sanity'

/* 120–180 word natural SEO block with 1–2 photos — home, galleri and all
   service pages. Rendered by SeoText / ServiceSeoText. */
export const seoTextSection = defineType({
  name: 'seoTextSection',
  title: 'SEO text',
  type: 'object',
  fields: [
    defineField({name: 'h2', title: 'Heading', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'text', title: 'Text (120–180 words)', type: 'text', validation: (r) => r.required()}),
    defineField({
      name: 'images',
      title: 'Photos (0–2; the galleri block renders without photos)',
      type: 'array',
      of: [{type: 'imageWithAlt'}],
      validation: (r) => r.max(2),
    }),
  ],
  preview: {select: {title: 'h2'}},
})
