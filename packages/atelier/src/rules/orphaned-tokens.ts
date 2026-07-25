import { ErrorResult, OrphanedResult } from "../types";

export function orphanedTokens(tokens: unknown): OrphanedResult {
    const errors: ErrorResult[] = [];
    return {
        process: "orphaned",
        errors,
        ok: errors.every((e) => e.severity !== "error"),
        tokens: [],
    };
}
