import { ErrorResult, Result } from "../types";

export function accessibility(tokens: unknown): Result {
    const errors: ErrorResult[] = [];
    return {
        process: "accessibility",
        errors,
        ok: errors.every((e) => e.severity !== "error"),
    };
}
