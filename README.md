# grontland-dk-admin

Sanity Studio for the Grontland project.

- **Project id:** `g5o00tac` · **Dataset:** `production`
- **Stack:** Sanity Studio v5 · TypeScript · structureTool + visionTool

## Getting started

```bash
npm install
npm run dev        # studio at http://localhost:3333
```

Useful CLI (runs against g5o00tac/production via sanity.cli.ts):

```bash
npx sanity dataset list
npx sanity documents query "*[_id == 'siteSettings'][0]"
npm run deploy     # hosts the studio at *.sanity.studio
```

## Structure

```
sanity.config.ts   studio config (plugins, schema)
sanity.cli.ts      CLI project/dataset binding
schemaTypes/       content model (documents, objects) — see the outline in
                   grotland-workspace/docs/cms-then-i18n-outline.md
```

## Conventions

- **Data-storage style, not page-builder:** documents mirror the site's fixed
  section contracts (see `Frontend/src/constants/`); editors edit fields and
  array items, they do not compose page layouts.
- **Field-level localization** da/en on every text field; `en` optional until
  translated. Slugs stay Danish in both locales.
- Quote-form leads + email notification are a planned feature (not implemented).
