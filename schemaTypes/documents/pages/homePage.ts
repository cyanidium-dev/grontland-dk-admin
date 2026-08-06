import {defineField, defineType} from 'sanity'

/* Singleton — the home page. Section order is fixed in the frontend route:
   hero → services teaser → audiences → one-team → process → projects teaser
   → gallery teaser → about → seo text → faq. Service teaser cards derive
   from service documents (cardDesc/heroImage); gallery from galleryCategory. */
export const homePage = defineType({
  name: 'homePage',
  title: 'Forside',
  type: 'document',
  fields: [
    defineField({name: 'seo', title: 'SEO', type: 'seoMeta', validation: (r) => r.required()}),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        defineField({name: 'h1', title: 'H1', type: 'string', validation: (r) => r.required()}),
        defineField({name: 'sub', title: 'Sub line', type: 'text', validation: (r) => r.required()}),
        defineField({
          name: 'ctas',
          title: 'CTAs (first = primary)',
          type: 'array',
          of: [{type: 'ctaLink'}],
          validation: (r) => r.max(2),
        }),
        defineField({name: 'image', title: 'Main photo (right panel)', type: 'imageWithAlt', validation: (r) => r.required()}),
        defineField({
          name: 'slider',
          title: 'Photo slider (bottom left, 3)',
          type: 'array',
          of: [{type: 'imageWithAlt'}],
          validation: (r) => r.max(3),
        }),
        defineField({
          name: 'overlayCards',
          title: 'Project overlay cards (max 2)',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'overlayCard',
              fields: [
                defineField({name: 'label', title: 'Label', type: 'string'}),
                defineField({name: 'image', title: 'Photo', type: 'imageWithAlt', validation: (r) => r.required()}),
                defineField({name: 'caption', title: 'Caption', type: 'text', validation: (r) => r.required()}),
              ],
              preview: {select: {title: 'caption', media: 'image'}},
            },
          ],
          validation: (r) => r.max(2),
        }),
      ],
    }),
    defineField({name: 'servicesTeaser', title: 'Services teaser (cards from service docs)', type: 'teaserSection'}),
    defineField({name: 'audiences', title: 'Audiences (private / entreprenører)', type: 'cardGrid'}),
    defineField({name: 'oneTeam', title: 'One team (photo band — use backgroundImage)', type: 'cardGrid'}),
    defineField({name: 'process', title: 'Process (also rendered on /om-os)', type: 'stepsSection', validation: (r) => r.required()}),
    defineField({name: 'projectsTeaser', title: 'Projects teaser', type: 'teaserSection'}),
    defineField({name: 'galleryTeaser', title: 'Gallery teaser (photos from categories)', type: 'teaserSection'}),
    defineField({
      name: 'about',
      title: 'About section',
      type: 'object',
      fields: [
        defineField({name: 'h2', title: 'Heading', type: 'string', validation: (r) => r.required()}),
        defineField({name: 'text', title: 'Text', type: 'text', validation: (r) => r.required()}),
        defineField({
          name: 'facts',
          title: 'Facts',
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
        }),
        defineField({name: 'teamH3', title: 'Team sub-heading', type: 'string'}),
        defineField({name: 'teamText', title: 'Team text', type: 'text'}),
        defineField({
          name: 'trades',
          title: 'Trade tags',
          type: 'array',
          of: [{type: 'string'}],
        }),
        defineField({name: 'cta', title: 'CTA', type: 'ctaLink'}),
        defineField({name: 'image', title: 'Photo', type: 'imageWithAlt'}),
      ],
    }),
    defineField({name: 'seoText', title: 'SEO text block', type: 'seoTextSection'}),
    defineField({name: 'faq', title: 'FAQ', type: 'faqSection'}),
  ],
  preview: {prepare: () => ({title: 'Forside'})},
})
