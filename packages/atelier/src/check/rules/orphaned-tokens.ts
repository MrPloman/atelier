import type { Diagnostic } from "@/types";
import type { OrphanedResult } from "../types";

export function orphanedTokens(tokens: unknown): OrphanedResult {
    const errors: Diagnostic[] = [];
    return {
        process: "orphaned",
        errors,
        ok: errors.every((e) => e.severity !== "error"),
        tokens: [],
    };
}
