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

## Why not Style Dictionary?

## Packages

- `packages/atelier` — the library and CLI

## License

MIT
