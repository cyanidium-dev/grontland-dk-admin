import type {StructureResolver} from 'sanity/structure'

/* Desk: siteSettings pinned as a singleton, collections below. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Indhold')
    .items([
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.documentTypeListItem('service').title('Ydelser'),
      S.documentTypeListItem('project').title('Projekter'),
      S.documentTypeListItem('galleryCategory').title('Galleri-kategorier'),
    ])
