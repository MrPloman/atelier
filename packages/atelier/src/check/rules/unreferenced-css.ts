import type { Diagnostic } from "@/types";
import type { Result } from "../types";

export function unreferencedCSS(tokens: unknown): Result {
    const errors: Diagnostic[] = [];
    return {
        process: "unreferenced",
        errors,
        ok: errors.every((e) => e.severity !== "error"),
    };
}
