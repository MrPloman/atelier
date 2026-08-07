# Atelier

Catches broken, unused, and inaccessible design tokens before they reach production.

- 🔗 Broken references and circular aliases
- 🧹 Orphaned tokens (defined but never used)
- 🚫 Unreferenced CSS variables (used in code but not defined)
- ♿ WCAG contrast failures on semantic color pairs
- ✅ Exits non-zero in CI — nothing reaches production silently

> **Status:** in development. Not usable yet. Follow along or check [DECISIONS.md](./docs/DECISIONS.md).

## Example

```bash
npx @mrploman/atelier check tokens.json

✖ 2 errors, 1 warning

ERROR  color.text.on-brand
       Broken reference: {color.palette.white} does not exist.

ERROR  contrast  color.text.default on color.surface.subtle
       Ratio 3.9:1. Minimum for AA: 4.5:1.

WARN   color.palette.blue-450
       Defined but never referenced.
```

Exits with a non-zero code — wire it into your CI and nothing broken reaches production.

## Usage

```ts
import { check } from "@mrploman/atelier";

const result = check(tokens);

if (result.some((r) => !r.ok)) {
    process.exit(1);
}
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

## Why not Style Dictionary?

## Packages

- `packages/atelier` — the library and CLI

## License

MIT
