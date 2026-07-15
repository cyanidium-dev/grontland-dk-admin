import {defineField, defineType} from 'sanity'

/* Titled card list — one type for every "cards with title + text" section:
   service scope, om values, b2b collaboration ways/expectations, private
   benefits/popular tasks. Rendered by the frontend's FeatureGrid. */
export const cardGrid = defineType({
  name: 'cardGrid',
  title: 'Card grid',
  type: 'object',
  fields: [
    defineField({name: 'h2', title: 'Heading', type: 'localeString', validation: (r) => r.required()}),
    defineField({name: 'intro', title: 'Intro line', type: 'localeText'}),
    defineField({
      name: 'items',
      title: 'Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'card',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'localeString', validation: (r) => r.required()}),
            defineField({name: 'desc', title: 'Text', type: 'localeText', validation: (r) => r.required()}),
          ],
          preview: {select: {title: 'title.da', subtitle: 'desc.da'}},
        },
      ],
      validation: (r) => r.min(2),
    }),
  ],
  preview: {select: {title: 'h2.da'}},
})
