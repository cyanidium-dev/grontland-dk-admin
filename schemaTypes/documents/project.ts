import {defineField, defineType} from 'sanity'

/* Project case — mirrors Frontend constants/projects.ts `Project`.
   Services on the card become references to service documents. */
export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (r) => r.required(),
    }),
    defineField({name: 'location', title: 'Location', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'objectType', title: 'Object type (fx privat bolig)', type: 'string'}),
    defineField({
      name: 'category',
      title: 'Audience',
      type: 'string',
      options: {list: ['private', 'b2b'], layout: 'radio'},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'primaryService',
      title: 'Primary service',
      type: 'reference',
      to: [{type: 'service'}],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'serviceLabel',
      title: 'Card chip label (fx "Havearbejde / terrasse"; falls back to the service name)',
      type: 'string',
    }),
    defineField({
      name: 'services',
      title: 'Service tags',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'service'}]}],
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seoMeta', validation: (r) => r.required()}),
    defineField({name: 'cardDesc', title: 'Card description', type: 'text', validation: (r) => r.required()}),
    defineField({name: 'cardImage', title: 'Card photo', type: 'imageWithAlt', validation: (r) => r.required()}),
    defineField({name: 'heroImage', title: 'Hero photo', type: 'imageWithAlt', validation: (r) => r.required()}),
    defineField({name: 'intro', title: 'Intro', type: 'text', validation: (r) => r.required()}),
    defineField({name: 'task', title: 'The task', type: 'text', validation: (r) => r.required()}),
    defineField({
      name: 'work',
      title: 'Work performed (bullets)',
      type: 'array',
      of: [{type: 'string'}],
      validation: (r) => r.min(2),
    }),
    defineField({
      name: 'focus',
      title: 'Focus points (bullets)',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({name: 'result', title: 'Result', type: 'text', validation: (r) => r.required()}),
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
    defineField({
      name: 'gallery',
      title: 'Project gallery',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'projectPhoto',
          fields: [
            defineField({name: 'image', title: 'Photo', type: 'imageWithAlt', validation: (r) => r.required()}),
            defineField({
              name: 'kind',
              title: 'Kind',
              type: 'string',
              options: {list: ['process', 'result', 'before', 'after']},
              validation: (r) => r.required(),
            }),
          ],
          preview: {select: {title: 'image.alt', subtitle: 'kind'}},
        },
      ],
    }),
    defineField({
      name: 'related',
      title: 'Related projects',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'project'}]}],
    }),
  ],
  preview: {select: {title: 'title', subtitle: 'location', media: 'cardImage'}},
})
