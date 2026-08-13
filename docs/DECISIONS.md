# DECISIONS.md

Architectural decisions for Atelier, with the reasoning behind them — so a future session (or a future you) doesn't have to reconstruct the "why" from scratch.

---

## The four `check/rules/*` placeholders

`src/check/rules/` has four stub functions from an early design pass, all still returning `errors: []` unconditionally: `broken-references.ts`, `orphaned-tokens.ts`, `unreferenced-css.ts`, `accessibility.ts`. They predate the real resolver, and only one of the four decisions below is settled — the other three are open design questions, not commitments.

### `broken-references` — redundant, candidate for removal

`resolve()` / `resolveAll()` already detects broken references and cycles, with more detail than this rule could add (full chain, `cycle` vs `broken-reference` distinction as separate `Diagnostic` codes). This rule's job is already done, better, by a different part of the pipeline.

**Decision:** remove this file rather than implement it. Nothing depends on it.

### `orphaned-tokens` — real gap, needs an inverted index

A token is orphaned if no other token's `references` array contains its path. Today, `references` is populated per-token (by `resolve()` / `resolveCompoundValue()`), but there's no reverse index ("who references me?") built anywhere.

**Shape of the fix:** a function operating on the `Map<ResolvedToken>` that `buildTokens()` produces — _after_ build, not inside it. Build the inverted index once (`Map<string, Set<string>>`, path → set of paths that reference it), then any `path` absent from that index is orphaned.

**Open question:** should a token referenced only by another orphan still count as "used"? (Transitive orphaning — if A is only referenced by B, and B itself is orphaned, is A also orphaned in practice?) Not decided.

### `unreferenced-css` — different in kind, crosses into "project" territory

Unlike the other three, this doesn't just need the token document — it needs the _consuming app's source_ (grep `var(--color-brand)` across `.css`/`.tsx` files) cross-referenced against generated tokens. This is the only one of the four that isn't really "a token library concern" — it's "a project-analysis tool that happens to use token output."

**Shape of the fix:** probably a separate CLI command (`atelier lint`?) rather than part of `build` — needs extra config (source file globs) that doesn't exist today, and a naming-convention assumption (CSS var name ↔ token path) that would need to be made explicit and configurable.

**Open question:** whole feature is unscoped. Worth deciding whether this belongs in Atelier core at all, or is out of scope entirely (a separate tool that consumes Atelier's output).

### `accessibility` (WCAG contrast) — most self-contained of the three real ones

Only needs pairs of already-resolved `ColorValue`s and a standard WCAG 2.1 relative-luminance contrast formula. No external dependencies, no project-source access needed.

**Shape of the fix:** operates on the final `Map<ResolvedToken>`, filtering to semantic color pairs (e.g. `color.text.default` on `color.surface.subtle`) that the check should compare.

**Open question:** how does the user declare which pairs to check? Some options: a naming convention (`*.text.*` against `*.surface.*`), an explicit list in `atelier.config.ts`, or inferring foreground/background roles from `$description`/custom metadata. Not decided — pick this first if/when implementing, since it shapes everything else about this rule.

---

## Why none of this blocks v1.0

`resolve → validate → transform → generate` (the published pipeline) doesn't depend on any of the four rules above — they're independent, additive checks on top of an already-complete pipeline. Natural candidates for "Atelier day" sessions once real usage against the crypto dashboard surfaces which of these actually matter in practice, rather than guessing priority order in the abstract.
