import type { Diagnostic } from "@/types";
import type { ReferencesResult } from "../types";

export function brokenReferences(tokens: unknown): ReferencesResult {
    const errors: Diagnostic[] = [];
    return {
        process: "references",
        errors,
        ok: errors.every((e) => e.severity !== "error"),
        tokens: [],
    };
}
