import {defineField, defineType} from 'sanity'

/* Photo pool per service category — powers the /galleri sections, the home
   gallery filter and every gallery strip (strips REFERENCE a category, so
   photos are stored exactly once). `key` must match the frontend's
   GalleryServiceId taxonomy. */
const CATEGORY_KEYS = [
  'havearbejde',
  'belaegning',
  'murerarbejde',
  'malerservice',
  'tomrerarbejde',
  'totalentreprise',
  'demonteringsarbejde',
]

export const galleryCategory = defineType({
  name: 'galleryCategory',
  title: 'Gallery category',
  type: 'document',
  fields: [
    defineField({
      name: 'key',
      title: 'Category key (frontend taxonomy)',
      type: 'string',
      options: {list: CATEGORY_KEYS},
      validation: (r) => r.required(),
    }),
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'description', title: 'Section description (/galleri)', type: 'text'}),
    defineField({name: 'cta', title: 'Service-page CTA (/galleri section button)', type: 'ctaLink'}),
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      of: [{type: 'imageWithAlt'}],
      validation: (r) => r.min(1),
    }),
    defineField({name: 'order', title: 'Sort order', type: 'number'}),
  ],
  orderings: [{title: 'Sort order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'key'}},
})
