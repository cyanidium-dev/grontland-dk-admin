import {defineField, defineType} from 'sanity'

/* Numbered step flow — home process, service process, b2b collaboration
   model, kontakt follow-up. Rendered by NumberedSteps; backgroundImage
   switches it to the full-bleed photo treatment. */
export const stepsSection = defineType({
  name: 'stepsSection',
  title: 'Steps',
  type: 'object',
  fields: [
    defineField({name: 'h2', title: 'Heading', type: 'localeString', validation: (r) => r.required()}),
    defineField({name: 'intro', title: 'Intro line', type: 'localeText'}),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'step',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'localeString', validation: (r) => r.required()}),
            defineField({name: 'desc', title: 'Text', type: 'localeText', validation: (r) => r.required()}),
          ],
          preview: {select: {title: 'title.da', subtitle: 'desc.da'}},
        },
      ],
      validation: (r) => r.min(3).max(5),
    }),
    defineField({name: 'cta', title: 'CTA under the steps', type: 'ctaLink'}),
    defineField({name: 'backgroundImage', title: 'Background photo (full-bleed)', type: 'imageWithAlt'}),
  ],
  preview: {select: {title: 'h2.da'}},
})
