import type { Diagnostic } from "@/types";
import type { Result } from "../types";

export function accessibility(tokens: unknown): Result {
    const errors: Diagnostic[] = [];
    return {
        process: "accessibility",
        errors,
        ok: errors.every((e) => e.severity !== "error"),
    };
}
