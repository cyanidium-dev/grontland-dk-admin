import {defineField, defineType} from 'sanity'

/* Titled card list — one type for every "cards with title + text" section:
   service scope, om values, b2b ways/expectations/why, private benefits and
   popular tasks, kontakt/home audience cards (those use image + links), and
   home one-team (uses backgroundImage). Rendered by FeatureGrid or its
   styled per-page variants. */
export const cardGrid = defineType({
  name: 'cardGrid',
  title: 'Card grid',
  type: 'object',
  fields: [
    defineField({name: 'h2', title: 'Heading', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'intro', title: 'Intro line', type: 'text'}),
    defineField({
      name: 'items',
      title: 'Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'card',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'desc', title: 'Text', type: 'text', validation: (r) => r.required()}),
            defineField({name: 'image', title: 'Photo (card layouts with images)', type: 'imageWithAlt'}),
            defineField({
              name: 'links',
              title: 'Links (fx service + example)',
              type: 'array',
              of: [{type: 'ctaLink'}],
              validation: (r) => r.max(2),
            }),
          ],
          preview: {select: {title: 'title', subtitle: 'desc', media: 'image'}},
        },
      ],
      validation: (r) => r.min(2),
    }),
    defineField({
      name: 'links',
      title: 'Section links (below the grid)',
      type: 'array',
      of: [{type: 'ctaLink'}],
      validation: (r) => r.max(2),
    }),
    defineField({name: 'backgroundImage', title: 'Background photo (full-bleed band)', type: 'imageWithAlt'}),
  ],
  preview: {select: {title: 'h2'}},
})
