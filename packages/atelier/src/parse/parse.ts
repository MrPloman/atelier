import { resolveAll, resolveAllCompounds } from "@/resolve/resolve";
import type { Diagnostic, RawGroup, UnvalidatedResolvedToken } from "@/types";
import { walk } from "@/walk/walk";

export function parseTokens(rawJson: string): {
    resolved: Map<string, UnvalidatedResolvedToken>;
    errors: Diagnostic[];
} {
    let document: RawGroup;

    try {
        document = JSON.parse(rawJson);
    } catch (error) {
        return {
            resolved: new Map(),
            errors: [
                {
                    severity: "error",
                    path: "",
                    code: "invalid-json",
                    hint: error instanceof Error ? error.message : "Unknown JSON parse error",
                },
            ],
        };
    }

    const { flatTokens, compoundPaths } = walk(document);

    const simpleResult = resolveAll(flatTokens, compoundPaths);
    const compoundResult = resolveAllCompounds(flatTokens, compoundPaths);

    return {
        resolved: new Map([...simpleResult.resolved, ...compoundResult.resolved]),
        errors: [...simpleResult.errors, ...compoundResult.errors],
    };
}
