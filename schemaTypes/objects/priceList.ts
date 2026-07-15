import {defineField, defineType} from 'sanity'

/* From-price rows (service pages). Section hides on the frontend when
   absent — never invent prices; only client-verified rows belong here. */
export const priceList = defineType({
  name: 'priceList',
  title: 'Price list',
  type: 'object',
  fields: [
    defineField({name: 'h2', title: 'Heading', type: 'localeString', validation: (r) => r.required()}),
    defineField({name: 'note', title: 'Note (ex moms, fast pris…)', type: 'localeText', validation: (r) => r.required()}),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'priceRow',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'localeString', validation: (r) => r.required()}),
            defineField({name: 'value', title: 'Price', type: 'localeString', validation: (r) => r.required()}),
          ],
          preview: {select: {title: 'label.da', subtitle: 'value.da'}},
        },
      ],
      validation: (r) => r.min(1),
    }),
  ],
  preview: {select: {title: 'h2.da'}},
})
