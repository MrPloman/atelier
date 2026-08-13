# Atelier

A TypeScript-first design token pipeline built on the [DTCG](https://www.designtokens.org/) format. Resolves, validates, transforms, and generates CSS/SCSS/TS from your tokens — and catches broken references before they reach production.

- 🔗 Broken references and circular aliases — for simple tokens _and_ compound token fields (`shadow`, `typography`, `border`...)
- 🧩 Full DTCG coverage — all 13 token types, including the six compound types
- 🧬 Per-field shape validation — diagnostics point at the exact broken field, not just "invalid token"
- 🔄 Composable transform pipeline (unit conversion, color space conversion, ...)
- 📦 Three generators — CSS custom properties, SCSS variables, typed TS constants
- 🛡️ `DotPaths<T>` — turns a token document into an autocomplete-safe, typo-proof union of paths
- ✅ Exits non-zero in CI — a build with unresolved tokens never succeeds silently

> **Status:** `resolve` → `validate` → `transform` → `generate` is stable and published (v1.0). Linting rules beyond reference resolution — orphaned tokens, unreferenced CSS variables, contrast checks — are on the [roadmap](#roadmap), not implemented yet. See [DECISIONS.md](./docs/DECISIONS.md) for the reasoning behind the bigger calls.

## Example

```bash
npx atelier build --config ./atelier.config.ts

✗ broken.a [cycle]
  Cyclic reference detected at iteratorMap().
  Cycle: broken.a → broken.b → broken.a

1 error(s)
  wrote ./dist/tokens.css
```

The valid tokens are still written — `broken.a` and `broken.b` are the only ones excluded. The process exits with code `1` regardless, so a CI pipeline never treats a partially-broken build as a success.

## Usage

### CLI

```typescript
// atelier.config.ts
import { defineConfig } from "@mrploman/atelier";

export default defineConfig({
    input: "./tokens/tokens.json",
    output: "./dist/tokens",
    formats: ["css", "scss", "ts"],
});
```

```bash
npx atelier build
```

### Library

```typescript
import { buildTokens, generateCSS } from "@mrploman/atelier";

const { tokens, errors } = buildTokens(rawJson);

if (errors.length > 0) {
    console.warn(errors);
}

console.log(generateCSS(tokens));
```

## Error handling philosophy

Atelier distinguishes between two fundamentally different classes of failure, and they behave differently on purpose.

### Structural errors — thrown

A structural error means the input isn't recognizable as a token document in the first place: malformed JSON, or a node that is neither a valid group nor a valid token shape.

These are thrown as exceptions, not collected. There's no meaningful way to "keep going" when the document itself isn't coherent — there's no partial result worth returning, because there's nothing valid to iterate over.

You'll encounter this from:

- `JSON.parse` failures (invalid JSON syntax)
- `walk()`, when it encounters a node that doesn't match `RawGroup` or `RawToken`

```typescript
try {
    const result = parseTokens(rawJson);
} catch (error) {
    // the document itself is broken — not a token-level problem
}
```

### Content errors — collected as `Diagnostic[]`

A content error means the document _is_ structurally valid — every node has the correct shape — but something about its meaning is wrong: a circular reference, a reference pointing to a token that doesn't exist, or a token with no resolvable `$type`.

These are never thrown. `resolveAll()` (and by extension `parseTokens()`) processes every token in the document regardless of whether earlier ones failed, and returns all problems at once:

```typescript
const { resolved, errors } = parseTokens(rawJson);

if (errors.length > 0) {
    // errors is the full list of content-level problems in the document —
    // not just the first one encountered
}
```

### Why the split

A document with a broken structure isn't a "document with some errors" — it's not a token document at all, so there's nothing sensible to report piece by piece. A document with valid structure but a cyclic reference somewhere _is_ a real token document with a real, specific, reportable problem — and whoever's consuming it deserves to see every such problem in one pass, not just the first one that happened to be hit.

## Roadmap

Reference resolution (broken links, cycles — both simple and compound) is real and covered by tests today. These are not yet implemented:

- Orphaned tokens — defined but never referenced anywhere
- Unreferenced CSS variables — used in code but not defined as a token
- WCAG contrast checks on semantic color pairs
- `atelier check` as a standalone command distinct from `build`

## Why not Style Dictionary?

WIP

## Packages

- `packages/atelier` — the library and CLI

## License

MIT
