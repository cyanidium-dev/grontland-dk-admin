import {defineField, defineType} from 'sanity'

/* Singleton — /galleri. The per-service sections derive from
   galleryCategory documents (title, description, cta, photos, order);
   only hero + seo text + CTA live here. */
export const galleriPage = defineType({
  name: 'galleriPage',
  title: 'Galleri',
  type: 'document',
  fields: [
    defineField({name: 'seo', title: 'SEO', type: 'seoMeta', validation: (r) => r.required()}),
    defineField({name: 'hero', title: 'Hero', type: 'heroSection', validation: (r) => r.required()}),
    defineField({name: 'seoText', title: 'SEO text block', type: 'seoTextSection'}),
    defineField({name: 'cta', title: 'Closing CTA', type: 'ctaBand'}),
  ],
  preview: {prepare: () => ({title: 'Galleri'})},
})
