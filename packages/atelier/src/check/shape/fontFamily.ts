import type { ShapeResult } from "../types";

export function validateFontFamilyValue(
    value: unknown,
    path: string,
): ShapeResult<string | string[]> {
    if (typeof value === "string") {
        return { ok: true, value };
    }

    if (Array.isArray(value)) {
        if (value.length === 0) {
            return {
                ok: false,
                error: {
                    severity: "error",
                    code: "invalid-shape",
                    path,
                    hint: `Expected a non-empty array of strings for fontFamily value, got an empty array`,
                },
            };
        }
        if (!value.every((item) => typeof item === "string")) {
            return {
                ok: false,
                error: {
                    severity: "error",
                    code: "invalid-shape",
                    path,
                    hint: `Expected an array of strings for fontFamily value, got an array with non-string elements`,
                },
            };
        }
        return { ok: true, value };
    }

    return {
        ok: false,
        error: {
            severity: "error",
            code: "invalid-shape",
            path,
            hint: `Expected a string or array of strings for fontFamily value, got ${typeof value}`,
        },
    };
}
