import { ErrorResult, ReferencesResult } from "../types";

export function brokenReferences(tokens: unknown): ReferencesResult {
    const errors: ErrorResult[] = [];
    return {
        process: "references",
        errors,
        ok: errors.every((e) => e.severity !== "error"),
        tokens: [],
    };
}
