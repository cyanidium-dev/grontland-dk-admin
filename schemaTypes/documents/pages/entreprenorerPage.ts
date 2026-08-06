import {defineField, defineType} from 'sanity'

/* Singleton — /entreprenorer (B2B landing). No testimonials by design;
   the referenced case carries the proof. Trade links derive from the
   referenced service documents. */
export const entreprenorerPage = defineType({
  name: 'entreprenorerPage',
  title: 'Entreprenører',
  type: 'document',
  fields: [
    defineField({name: 'seo', title: 'SEO', type: 'seoMeta', validation: (r) => r.required()}),
    defineField({name: 'hero', title: 'Hero', type: 'heroSection', validation: (r) => r.required()}),
    defineField({name: 'scenarios', title: 'Collaboration ways', type: 'cardGrid'}),
    defineField({name: 'expectations', title: 'Expectations', type: 'cardGrid'}),
    defineField({name: 'why', title: 'Why one partner (intro + link)', type: 'cardGrid'}),
    defineField({name: 'model', title: 'Collaboration model', type: 'stepsSection'}),
    defineField({
      name: 'caseHighlight',
      title: 'Case highlight',
      type: 'object',
      fields: [
        defineField({name: 'h2', title: 'Heading', type: 'string', validation: (r) => r.required()}),
        defineField({name: 'text', title: 'Text', type: 'text', validation: (r) => r.required()}),
        defineField({
          name: 'project',
          title: 'Project',
          type: 'reference',
          to: [{type: 'project'}],
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'ctas',
          title: 'CTAs',
          type: 'array',
          of: [{type: 'ctaLink'}],
          validation: (r) => r.max(2),
        }),
      ],
    }),
    defineField({
      name: 'trades',
      title: 'Trades covered',
      type: 'object',
      fields: [
        defineField({name: 'h2', title: 'Heading', type: 'string', validation: (r) => r.required()}),
        defineField({
          name: 'services',
          title: 'Services (links derive from these)',
          type: 'array',
          of: [{type: 'reference', to: [{type: 'service'}]}],
        }),
      ],
    }),
    defineField({name: 'cta', title: 'Closing CTA', type: 'ctaBand'}),
  ],
  preview: {prepare: () => ({title: 'Entreprenører'})},
})
