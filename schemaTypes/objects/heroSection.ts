import {defineField, defineType} from 'sanity'

/* Inner-page hero — rendered by the frontend's shared PageHero.
   trustChips only render on pages whose layout shows them (services). */
export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Eyebrow label', type: 'string'}),
    defineField({name: 'h1', title: 'H1', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'sub', title: 'Sub line', type: 'text', validation: (r) => r.required()}),
    defineField({name: 'image', title: 'Photo', type: 'imageWithAlt'}),
    defineField({
      name: 'ctas',
      title: 'CTAs (first = primary)',
      type: 'array',
      of: [{type: 'ctaLink'}],
      validation: (r) => r.max(2),
    }),
    defineField({
      name: 'trustChips',
      title: 'Trust chips',
      type: 'array',
      of: [{type: 'string'}],
      validation: (r) => r.max(3),
    }),
  ],
  preview: {select: {title: 'h1'}},
})
