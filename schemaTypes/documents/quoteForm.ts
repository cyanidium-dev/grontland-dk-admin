import {defineField, defineType} from 'sanity'

/* Singleton — copy for the site-wide quote modal + home QuoteCta band.
   Submission handling (leads + email) is a planned feature, not implemented;
   this document only carries the labels. */
export const quoteForm = defineType({
  name: 'quoteForm',
  title: 'Quote form',
  type: 'document',
  fields: [
    defineField({name: 'h2', title: 'Heading', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'sub', title: 'Sub line', type: 'text', validation: (r) => r.required()}),
    defineField({name: 'nameLabel', title: 'Field: name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'phoneLabel', title: 'Field: phone', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'emailLabel', title: 'Field: e-mail', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'whoLabel', title: 'Audience question', type: 'string'}),
    defineField({
      name: 'whoOptions',
      title: 'Audience options',
      type: 'array',
      of: [{type: 'string'}],
      validation: (r) => r.max(2),
    }),
    defineField({name: 'taskLabel', title: 'Task-type question', type: 'string'}),
    defineField({name: 'taskPlaceholder', title: 'Task-type placeholder', type: 'string'}),
    defineField({
      name: 'taskOptions',
      title: 'Task-type options',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({name: 'messageLabel', title: 'Field: message', type: 'string'}),
    defineField({name: 'uploadLabel', title: 'Field: upload', type: 'string'}),
    defineField({name: 'uploadHint', title: 'Upload hint', type: 'string'}),
    defineField({name: 'button', title: 'Submit button', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'micro', title: 'Microcopy under the button', type: 'string'}),
    defineField({name: 'image', title: 'Band photo (home QuoteCta)', type: 'imageWithAlt'}),
    defineField({
      name: 'reassurance',
      title: 'Reassurance rows (home QuoteCta)',
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
      validation: (r) => r.max(3),
    }),
  ],
  preview: {prepare: () => ({title: 'Quote form'})},
})
