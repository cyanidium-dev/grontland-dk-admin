import {defineField, defineType} from 'sanity'

/* Singleton — /om-os. The process section renders from homePage.process
   (shared section, one source), so it has no field here. */
export const omOsPage = defineType({
  name: 'omOsPage',
  title: 'Om os',
  type: 'document',
  fields: [
    defineField({name: 'seo', title: 'SEO', type: 'seoMeta', validation: (r) => r.required()}),
    defineField({name: 'hero', title: 'Hero', type: 'heroSection', validation: (r) => r.required()}),
    defineField({
      name: 'intro',
      title: '"Hvem er vi" (photo + facts)',
      type: 'object',
      fields: [
        defineField({name: 'h2', title: 'Heading', type: 'string', validation: (r) => r.required()}),
        defineField({name: 'text', title: 'Text', type: 'text', validation: (r) => r.required()}),
        defineField({name: 'image', title: 'Photo (left bleed)', type: 'imageWithAlt', validation: (r) => r.required()}),
        defineField({
          name: 'facts',
          title: 'Fact chips (on the photo)',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'fact',
              fields: [
                defineField({name: 'label', title: 'Label', type: 'string', validation: (r) => r.required()}),
                defineField({name: 'value', title: 'Value', type: 'string', validation: (r) => r.required()}),
              ],
              preview: {select: {title: 'label', subtitle: 'value'}},
            },
          ],
          validation: (r) => r.max(4),
        }),
      ],
    }),
    defineField({name: 'values', title: 'Values', type: 'cardGrid'}),
    defineField({
      name: 'team',
      title: 'Team',
      type: 'object',
      fields: [
        defineField({name: 'h2', title: 'Heading', type: 'string', validation: (r) => r.required()}),
        defineField({name: 'intro', title: 'Intro', type: 'text'}),
        defineField({
          name: 'members',
          title: 'Members',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'member',
              fields: [
                defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
                defineField({name: 'role', title: 'Role', type: 'string', validation: (r) => r.required()}),
                defineField({name: 'note', title: 'Note (fx erfaring)', type: 'string'}),
                defineField({name: 'image', title: 'Photo', type: 'imageWithAlt'}),
                defineField({
                  name: 'trades',
                  title: 'Responsibilities',
                  type: 'array',
                  of: [{type: 'string'}],
                }),
                defineField({name: 'link', title: 'Service link', type: 'ctaLink'}),
              ],
              preview: {select: {title: 'name', subtitle: 'role', media: 'image'}},
            },
          ],
        }),
      ],
    }),
    defineField({name: 'onePlan', title: '"Flere fag — én plan" band', type: 'ctaBand'}),
    defineField({name: 'galleryTeaser', title: 'Gallery teaser (photos from categories)', type: 'teaserSection'}),
    defineField({name: 'cta', title: 'Closing CTA', type: 'ctaBand'}),
  ],
  preview: {prepare: () => ({title: 'Om os'})},
})
