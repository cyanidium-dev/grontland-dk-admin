import {defineField, defineType} from 'sanity'

/* Section header that teases another page or collection: heading + optional
   sub + up to two CTAs, optionally pinning specific projects. Used by the
   home services/gallery/projects teasers, om gallery strip header and the
   private "udvalgte projekter" block. The teased content itself (service
   cards, gallery photos) is derived from its own documents. */
export const teaserSection = defineType({
  name: 'teaserSection',
  title: 'Teaser section',
  type: 'object',
  fields: [
    defineField({name: 'h2', title: 'Heading', type: 'localeString', validation: (r) => r.required()}),
    defineField({name: 'sub', title: 'Sub line', type: 'localeText'}),
    defineField({
      name: 'ctas',
      title: 'CTAs',
      type: 'array',
      of: [{type: 'ctaLink'}],
      validation: (r) => r.max(2),
    }),
    defineField({
      name: 'projects',
      title: 'Pinned projects (project teasers only)',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'project'}]}],
      validation: (r) => r.max(4),
    }),
  ],
  preview: {select: {title: 'h2.da'}},
})
