import {defineField, defineType} from 'sanity'

/* FAQ — home + service pages. Also feeds FAQPage JSON-LD, so answers must
   be self-contained. Rendered by FaqList. */
export const faqSection = defineType({
  name: 'faqSection',
  title: 'FAQ',
  type: 'object',
  fields: [
    defineField({name: 'h2', title: 'Heading', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'items',
      title: 'Questions',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'faqItem',
          fields: [
            defineField({name: 'q', title: 'Question', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'a', title: 'Answer', type: 'text', validation: (r) => r.required()}),
          ],
          preview: {select: {title: 'q'}},
        },
      ],
      validation: (r) => r.min(3).max(8),
    }),
  ],
  preview: {select: {title: 'h2'}},
})
