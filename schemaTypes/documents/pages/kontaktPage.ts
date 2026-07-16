import {defineField, defineType} from 'sanity'

/* Singleton — /kontakt. Direct-contact rows derive from siteSettings; the
   form labels derive from the quoteForm singleton. */
export const kontaktPage = defineType({
  name: 'kontaktPage',
  title: 'Kontakt',
  type: 'document',
  fields: [
    defineField({name: 'seo', title: 'SEO', type: 'seoMeta', validation: (r) => r.required()}),
    defineField({name: 'hero', title: 'Hero', type: 'heroSection', validation: (r) => r.required()}),
    defineField({name: 'formH2', title: 'Form heading', type: 'localeString'}),
    defineField({name: 'infoH2', title: 'Direct-contact heading', type: 'localeString'}),
    defineField({name: 'infoNote', title: 'Direct-contact note (fx lørdag efter aftale)', type: 'localeString'}),
    defineField({name: 'steps', title: '"Hvad sker der, når du har skrevet?"', type: 'stepsSection'}),
    defineField({name: 'audiences', title: 'Audience cards (image + link per card)', type: 'cardGrid'}),
  ],
  preview: {prepare: () => ({title: 'Kontakt'})},
})
