import {defineField, defineType} from 'sanity'

/* Singleton — /projekter listing. The project cards derive from project
   documents; filter labels stay in code (tied to the category enum). */
export const projekterPage = defineType({
  name: 'projekterPage',
  title: 'Projekter (liste)',
  type: 'document',
  fields: [
    defineField({name: 'seo', title: 'SEO', type: 'seoMeta', validation: (r) => r.required()}),
    defineField({name: 'h1', title: 'H1', type: 'localeString', validation: (r) => r.required()}),
    defineField({name: 'sub', title: 'Sub line', type: 'localeText'}),
    defineField({name: 'emptyFilter', title: 'Empty-filter message', type: 'localeString'}),
    defineField({name: 'cta', title: 'Closing CTA', type: 'ctaBand'}),
  ],
  preview: {prepare: () => ({title: 'Projekter (liste)'})},
})
