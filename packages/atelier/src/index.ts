export { buildTokens } from "./build";
export { checkTokenShape } from "./check/shape";
export { generateCSS } from "./generate/css";
export { generateSCSS } from "./generate/scss";
export { generateTS } from "./generate/ts";
export { parseTokens } from "./parse/parse";
export { resolve, resolveAll, resolveAllCompounds, resolveCompoundValue } from "./resolve/resolve";
export { applyTransforms, applyTransformsToValue, type Transform } from "./transform/transform";
export { walk } from "./walk/walk";

import { accessibility } from "./check/rules/accessibility";
import { brokenReferences } from "./check/rules/broken-references";
import { orphanedTokens } from "./check/rules/orphaned-tokens";
import { unreferencedCSS } from "./check/rules/unreferenced-css";
import type { Result } from "./check/types";
export { defineConfig, type AtelierConfig } from "./config";
export type {
    Diagnostic,
    DotPaths,
    RawGroup,
    RawToken,
    ResolvedToken,
    TokenType,
    UnvalidatedResolvedToken,
} from "./types";
export function mainChecker(tokens: unknown): Result[] {
    return [
        brokenReferences(tokens),
        orphanedTokens(tokens),
        unreferencedCSS(tokens),
        accessibility(tokens),
    ];
}
