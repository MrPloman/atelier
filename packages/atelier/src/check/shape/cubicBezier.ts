import type { ShapeResult } from "../types";

export function validateCubicBezierValue(
    value: unknown,
    path: string,
): ShapeResult<[number, number, number, number]> {
    if (!Array.isArray(value)) {
        return {
            ok: false,
            error: {
                severity: "error",
                code: "invalid-shape",
                path,
                hint: `Expected an array of four numbers for value, got ${typeof value}`,
            },
        };
    }
    if (value.length !== 4) {
        return {
            ok: false,
            error: {
                severity: "error",
                code: "invalid-shape",
                path,
                hint: `Expected an array of four numbers for value, got an array of ${value.length} `,
            },
        };
    }
    if (!value.every((n) => typeof n === "number" && !Number.isNaN(n))) {
        return {
            ok: false,
            error: {
                severity: "error",
                code: "invalid-shape",
                path,
                hint: `Expected an array of four numbers for value but some values inside of the array are not number`,
            },
        };
    }

    return {
        ok: true,
        value: value as [number, number, number, number],
    };
}
