import type { DurationValue } from "@/types";
import type { ShapeResult } from "../types";

export function validateDurationValue(value: unknown, path: string): ShapeResult<DurationValue> {
    if (typeof value !== "object" || value === null || value === undefined) {
        return {
            ok: false,
            error: {
                severity: "error",
                code: "invalid-shape",
                path,
                hint: `Expected an object for duration object, got ${typeof value}`,
            },
        };
    }

    const candidate = value as Record<string, unknown>;
    if (typeof candidate.value !== "number" || Number.isNaN(candidate.value)) {
        return {
            ok: false,
            error: {
                severity: "error",
                code: "invalid-shape",
                path,
                hint: `Expected a number for duration value, got ${typeof candidate.value}`,
            },
        };
    }
    if (
        !candidate.unit ||
        typeof candidate.unit !== "string" ||
        (candidate.unit !== "ms" && candidate.unit !== "s")
    ) {
        return {
            ok: false,
            error: {
                severity: "error",
                code: "invalid-shape",
                path,
                hint: `Expected a type 'ms' or 's' for Duration unit, got ${typeof candidate.unit}`,
            },
        };
    }
    return {
        ok: true,
        value: candidate as DurationValue,
    };
}
