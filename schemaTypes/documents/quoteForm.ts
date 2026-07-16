import {defineField, defineType} from 'sanity'

/* Singleton — copy for the site-wide quote modal + home QuoteCta band.
   Submission handling (leads + email) is a planned feature, not implemented;
   this document only carries the labels. */
export const quoteForm = defineType({
  name: 'quoteForm',
  title: 'Quote form',
  type: 'document',
  fields: [
    defineField({name: 'h2', title: 'Heading', type: 'localeString', validation: (r) => r.required()}),
    defineField({name: 'sub', title: 'Sub line', type: 'localeText', validation: (r) => r.required()}),
    defineField({name: 'nameLabel', title: 'Field: name', type: 'localeString', validation: (r) => r.required()}),
    defineField({name: 'phoneLabel', title: 'Field: phone', type: 'localeString', validation: (r) => r.required()}),
    defineField({name: 'emailLabel', title: 'Field: e-mail', type: 'localeString', validation: (r) => r.required()}),
    defineField({name: 'whoLabel', title: 'Audience question', type: 'localeString'}),
    defineField({
      name: 'whoOptions',
      title: 'Audience options',
      type: 'array',
      of: [{type: 'localeString'}],
      validation: (r) => r.max(2),
    }),
    defineField({name: 'taskLabel', title: 'Task-type question', type: 'localeString'}),
    defineField({name: 'taskPlaceholder', title: 'Task-type placeholder', type: 'localeString'}),
    defineField({
      name: 'taskOptions',
      title: 'Task-type options',
      type: 'array',
      of: [{type: 'localeString'}],
    }),
    defineField({name: 'messageLabel', title: 'Field: message', type: 'localeString'}),
    defineField({name: 'uploadLabel', title: 'Field: upload', type: 'localeString'}),
    defineField({name: 'uploadHint', title: 'Upload hint', type: 'localeString'}),
    defineField({name: 'button', title: 'Submit button', type: 'localeString', validation: (r) => r.required()}),
    defineField({name: 'micro', title: 'Microcopy under the button', type: 'localeString'}),
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
            defineField({name: 'label', title: 'Label', type: 'localeString', validation: (r) => r.required()}),
            defineField({name: 'value', title: 'Value', type: 'localeString', validation: (r) => r.required()}),
          ],
          preview: {select: {title: 'label.da', subtitle: 'value.da'}},
        },
      ],
      validation: (r) => r.max(3),
    }),
  ],
  preview: {prepare: () => ({title: 'Quote form'})},
})
