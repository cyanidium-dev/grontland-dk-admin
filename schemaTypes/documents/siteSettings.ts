import {defineField, defineType} from 'sanity'

/* Singleton — the single source for contact facts that the frontend today
   duplicates in four places (kontakt.ts, FOOTER, jsonld.ts, CtaBand). */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({name: 'phone', title: 'Phone (display)', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'phoneHref', title: 'Phone (tel: href)', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'email', title: 'E-mail', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'cvr', title: 'CVR', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'area', title: 'Service area', type: 'localeString', validation: (r) => r.required()}),
    defineField({name: 'hours', title: 'Opening hours', type: 'localeString'}),
    defineField({name: 'replyPromise', title: 'Reply promise (fx "Vi svarer inden 24 timer")', type: 'localeString'}),
    defineField({name: 'footerBlurb', title: 'Footer blurb', type: 'localeString'}),
    defineField({name: 'copyright', title: 'Copyright line', type: 'string'}),
  ],
  preview: {prepare: () => ({title: 'Site settings'})},
})
