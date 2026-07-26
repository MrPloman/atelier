import { accessibility } from "./check/rules/accessibility";
import { brokenReferences } from "./check/rules/broken-references";
import { orphanedTokens } from "./check/rules/orphaned-tokens";
import { unreferencedCSS } from "./check/rules/unreferenced-css";
import type { Result } from "./check/types";

export function mainChecker(tokens: unknown): Result[] {
    return [
        brokenReferences(tokens),
        orphanedTokens(tokens),
        unreferencedCSS(tokens),
        accessibility(tokens),
    ];
}
