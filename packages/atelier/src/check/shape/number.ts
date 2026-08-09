import type { ShapeResult } from "../types";

export function validateNumberValue(value: unknown, path: string): ShapeResult<number> {
    if (typeof value !== "number" || Number.isNaN(value)) {
        return {
            ok: false,
            error: {
                severity: "error",
                code: "invalid-shape",
                path,
                hint: `Expected a number for number value, got ${typeof value}`,
            },
        };
    }

    return {
        ok: true,
        value: value as number,
    };
}
