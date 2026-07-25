import { accessibility } from "../rules/accessability";
import { brokenReferences } from "../rules/broken-references";
import { orphanedTokens } from "../rules/orphaned-tokens";
import { unreferencedCSS } from "../rules/unreferenced-css";
import { Result } from "../types";

export function mainChecker(tokens: unknown): Result[] {
    return [
        brokenReferences(tokens),
        orphanedTokens(tokens),
        unreferencedCSS(tokens),
        accessibility(tokens),
    ];
}
