# CLAUDE.md

Sanity Studio backing the Astro portfolio site at `../portfolio` (sibling repo, checked out under the same parent directory).

## Critical coupling

The studio publishes its generated types and GROQ queries as the JSR package `@adam/portfolio-sanity` (entry: `mod.ts`, manifest: `jsr.json`). The portfolio site (`../portfolio`) imports from that package — there is no filesystem dependency between the repos.

Any schema field rename or removal that touches a query field is a breaking change for consumers. When editing schema:

1. Update the matching field in `queries.ts`.
2. Run `pnpm typegen` and commit the regenerated `sanity.types.ts`.
3. Bump `version` in `jsr.json`. `pnpm publish:types:dry` to validate, then `pnpm publish:types` to ship.
4. In `../portfolio`, bump the `@adam/portfolio-sanity` version, `pnpm install`, run `pnpm exec astro check` (and grep `../portfolio/src/` for any direct field references the type system can't catch).

Don't ship a schema edit without all four steps.

## Folder convention

```
schemaTypes/
  index.ts        — single source of truth for the studio's `schemaTypes` array
  documents/      — top-level document types (resume, coverLetter, portfolioPiece, ...)
  objects/        — reusable inline objects (portfolioSection)
  fields/         — field-builder helper functions (richTextField, dateRangeFields)
structure/        — custom desk structure (groups documents into Site Content / Building Blocks / Identity)
queries.ts        — groq-tagged queries; sole input to TypeGen's query-result generation
sanity.types.ts   — generated; do not edit by hand
mod.ts            — JSR package entry point; re-exports queries.ts + sanity.types.ts
jsr.json          — JSR manifest (name, version, exports, file include list)
sanity-typegen.json — TypeGen config; `overloadClientMethods: false` keeps the output JSR-publishable
```

## Style

- Validation: `(rule) => rule.required()` — lowercase `rule`, no exceptions.
- Field names: camelCase (`startDate`, not `startdate`).
- Prefer `richTextField({ name, title, required })` over repeating `defineField({ type: 'array', of: [defineArrayMember({ type: 'block' })], ... })`.
- Prefer `dateRangeFields({ dateFormat })` over redefining `startDate`/`endDate` per document.

## Deploys

- `pnpm deploy` — pushes the studio bundle to the dev-host.
- `pnpm deploy:production` — exports dev dataset → imports into production → deploys with `.env.production`. Destructive against the production dataset (uses `--replace`); confirm with the user before running.
