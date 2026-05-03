# Portfolio Sanity Studio

The content backend for [adamknee.com](https://adamknee.com) (Astro + Cloudflare). It owns the schema for the resume, cover letter, and portfolio gallery; the Astro site at `../portfolio` consumes it via GROQ.

- **Sanity project ID:** `0gpal1hv`
- **Datasets:** `development` (default for local), `production`
- **Studio host:** `knee-portfolio` (deployed at `https://knee-portfolio.sanity.studio`)

---

## Setup

```bash
pnpm install
cp .env.example .env   # fill in real values
pnpm dev               # http://localhost:3333
```

`.env` and `.env.production` provide `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`, and `SANITY_STUDIO_HOST` to the Studio config (see `sanity.config.ts`).

---

## Scripts

| Script | What it does |
|---|---|
| `pnpm dev` | Run the Studio locally against the dataset configured in `.env` (default: `development`). |
| `pnpm build` | Build the production bundle into `./dist`. |
| `pnpm typecheck` | `tsc --noEmit` over the studio code. |
| `pnpm typegen` | Extract schema → JSON, then generate `sanity.types.ts` (document types + query result types). Commit the result. |
| `pnpm typegen:extract` | Schema-only extract step (rarely run on its own). |
| `pnpm publish:types` | Publish the generated types + queries to JSR as `@adam/portfolio-sanity`. Bump `version` in `jsr.json` first. Interactive auth on first run. |
| `pnpm publish:types:dry` | Same as above with `--dry-run` — validates the package without publishing. |
| `pnpm lint` | ESLint (flat config in `eslint.config.mjs`). |
| `pnpm format` | Prettier write + lint. |
| `pnpm dataset:export` | Export the `development` dataset to `./dataset-backups`. |
| `pnpm dataset:export:production` | Export the `production` dataset to `./dataset-backups`. |
| `pnpm dataset:import:production` | Import the latest `development` export into `production` (replaces). |
| `pnpm deploy` | Deploy the Studio to its `development`-bound host. |
| `pnpm deploy:production` | Full prod deploy: export dev → import to prod → deploy Studio with `.env.production`. |
| `pnpm deploy:all` | Run `deploy` then `deploy:production` back-to-back. |
| `pnpm deploy:graphql` / `pnpm deploy:graphql:production` | Publish the GraphQL API for dev/prod. |

---

## Schema map

Documents live in `schemaTypes/documents/`. Reusable objects in `schemaTypes/objects/`. Shared field-builder helpers in `schemaTypes/fields/`.

**Top-level content (edited directly):**
- `resume` → references `logo`, `contactInfo`, `experience[]`, `education[]`, `skills[]`. Has `slug`, `educationEnabled` toggle, and a rich-text `highlights` field.
- `coverLetter` → references `logo` + `contactInfo`. Holds the per-letter prose (`openingParagraph`, `keyHighlights`, `closingParagraph`, etc.).
- `portfolioGallery` → references `portfolioPiece[]`, ordered. Has a `slug` and `showTagsFilter` toggle.

**Building blocks (referenced by the above):**
- `portfolioPiece` → `tags[]` (refs to `tag`), inline `sections[]` (each is a `portfolioSection` object), plus `featuredImage`, `launchUrl`, `repoUrl`.
- `experience`, `education` → use the shared `dateRangeFields` helper for `startDate` / `endDate`.
- `skills` → titled rich-text section.
- `tag` → label + slug, used for portfolio piece classification.

**Identity:**
- `contactInfo` → name, title, email, `socials[]` (refs to `social`).
- `social` → platform + URL.
- `logo` → SVG and/or PNG file (validates that at least one is provided).

The custom desk structure (`structure/index.ts`) groups the document list into **Site Content**, **Building Blocks**, and **Identity**.

---

## Coupling with the portfolio site

The Astro site (`../portfolio`) reads from this Studio via three queries defined in `queries.ts` and consumed in `portfolio/src/utils/sanity.ts`:

- `RESUME_QUERY` — uses `resume.slug.current`, dereferences `logo`, `contactInfo`, `experience[]`, `education[]`, `skills[]`. Reads `educationEnabled` and `highlights`.
- `COVER_LETTER_QUERY` — uses `coverLetter._id`, dereferences `logo` + `contactInfo`, reads every cover-letter prose field.
- `PORTFOLIO_GALLERY_QUERY` — uses `portfolioGallery.slug.current`, dereferences `pieces[]` and (per piece) `tags[]`, projects `featuredImage.asset->url` to `featuredImageUrl` and `image.asset->url` to `imageUrl` inside each section.

The portfolio consumes both the queries and the generated types via the published JSR package `@adam/portfolio-sanity` — there is **no filesystem dependency** between the repos.

**Renaming or removing any field these queries touch is a breaking change for the portfolio site.** When you make schema edits:

1. Update `queries.ts` in the same change.
2. Run `pnpm typegen`, commit the regenerated `sanity.types.ts`.
3. Bump `version` in `jsr.json`, then `pnpm publish:types`.
4. In `../portfolio`, bump the dep version and `pnpm install && pnpm exec astro check` to surface any breaks.

---

## TypeGen + JSR publishing

`pnpm typegen` runs `sanity schema extract` then `sanity typegen generate`, reading the queries in `queries.ts` and producing `sanity.types.ts`.

The studio's `mod.ts` re-exports both files as the public surface of the `@adam/portfolio-sanity` JSR package (config in `jsr.json`). The portfolio consumes it as:

```ts
import {
  RESUME_QUERY,
  type RESUME_QUERY_RESULT
} from '@adam/portfolio-sanity';
```

`overloadClientMethods: false` is set in `sanity-typegen.json` so the generated file omits the `declare module '@sanity/client'` augmentation — JSR rejects ambient module declarations as "slow types."

### Publish flow

```bash
pnpm typegen                       # regenerate sanity.types.ts
# bump "version" in jsr.json
pnpm publish:types:dry             # validate
pnpm publish:types                 # interactive auth on first run; OAuth flow opens in browser
```

In the portfolio repo, then bump `@adam/portfolio-sanity` to the new version and `pnpm install`.

---

## Conventions

- **Validation arg name:** `(rule) => rule.required()` — lowercase, consistent across all schemas.
- **Field naming:** camelCase (`startDate`, not `startdate`). Field renames are breaking — see *Coupling* above.
- **Folder layout:** `documents/` for document types, `objects/` for reusable inline objects, `fields/` for field-builder helpers. Keep the flat `schemaTypes/index.ts` as the only export surface.
- **Shared helpers:** prefer `richTextField` (block-array shorthand) and `dateRangeFields` (start/end date pair) over repeating field definitions.

---

## Deploy flow

The "ship a content/schema change to prod" sequence:

```bash
# 1. Make schema/queries edits, run typegen, commit.
pnpm typegen
git add . && git commit

# 2. Optional: edit content in the development dataset via `pnpm dev`.

# 3. Push schema + content to production.
pnpm deploy:production
# (= dataset:export → dataset:import:production → sanity deploy with .env.production)

# Or do dev-host + prod in one step:
pnpm deploy:all
```
