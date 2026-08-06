import {defineField, defineType} from 'sanity'

/* Internal link/CTA. href is a route path ("/kontakt", "/ydelser/havearbejde");
   routes are code, so this stays a plain string — same in both locales. */
export const ctaLink = defineType({
  name: 'ctaLink',
  title: 'Link / CTA',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'href', title: 'Path', type: 'string', validation: (r) => r.required()}),
  ],
  preview: {
    select: {title: 'label', subtitle: 'href'},
  },
})
