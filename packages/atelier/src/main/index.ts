import { accessibility } from "../rules/accessability";
import { brokenReferences } from "../rules/brokenReferences";
import { orphanedTokens } from "../rules/orphanedTokens";
import { unreferencedCSS } from "../rules/unreferencedCSS";
import { Result } from "../types";

export function mainChecker(tokens: unknown): Result[] {
    return [
        brokenReferences(tokens),
        orphanedTokens(tokens),
        unreferencedCSS(tokens),
        accessibility(tokens),
    ];
}
