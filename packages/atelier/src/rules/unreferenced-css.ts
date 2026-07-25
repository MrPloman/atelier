import type { ErrorResult, Result } from "@/types";

export function unreferencedCSS(tokens: unknown): Result {
    const errors: ErrorResult[] = [];
    return {
        process: "unreferenced",
        errors,
        ok: errors.every((e) => e.severity !== "error"),
    };
}
