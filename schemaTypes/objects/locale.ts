import {defineField, defineType} from 'sanity'

/**
 * Field-level localization (docs/cms-then-i18n-outline.md): da required,
 * en optional until translated. Every text field on the site uses one of
 * these two types.
 */
export const localeString = defineType({
  name: 'localeString',
  title: 'Localized string',
  type: 'object',
  fields: [
    defineField({name: 'da', title: 'Dansk', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'en', title: 'English', type: 'string'}),
  ],
})

export const localeText = defineType({
  name: 'localeText',
  title: 'Localized text',
  type: 'object',
  fields: [
    defineField({name: 'da', title: 'Dansk', type: 'text', rows: 4, validation: (r) => r.required()}),
    defineField({name: 'en', title: 'English', type: 'text', rows: 4}),
  ],
})
