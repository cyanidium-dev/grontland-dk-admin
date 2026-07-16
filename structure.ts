import type {StructureResolver} from 'sanity/structure'

const singleton = (S: Parameters<StructureResolver>[0], type: string, title: string) =>
  S.listItem().title(title).id(type).child(S.document().schemaType(type).documentId(type))

/* Desk: settings + page singletons pinned (documentId = type name),
   collections below. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Indhold')
    .items([
      singleton(S, 'siteSettings', 'Site settings'),
      singleton(S, 'quoteForm', 'Quote form'),
      S.divider(),
      singleton(S, 'homePage', 'Forside'),
      singleton(S, 'ydelserIndexPage', 'Ydelser (indeks)'),
      singleton(S, 'privatePage', 'Private kunder'),
      singleton(S, 'entreprenorerPage', 'Entreprenører'),
      singleton(S, 'projekterPage', 'Projekter (liste)'),
      singleton(S, 'galleriPage', 'Galleri'),
      singleton(S, 'omOsPage', 'Om os'),
      singleton(S, 'kontaktPage', 'Kontakt'),
      S.divider(),
      S.documentTypeListItem('service').title('Ydelser'),
      S.documentTypeListItem('project').title('Projekter'),
      S.documentTypeListItem('galleryCategory').title('Galleri-kategorier'),
    ])
