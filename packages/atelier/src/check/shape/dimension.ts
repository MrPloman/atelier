// src/check/rules/type-shape.ts (o donde decidas meter las 7 funciones)
import type { DimensionValue } from "@/types";
import type { ShapeResult } from "../types";

export function validateDimensionValue(value: unknown, path: string): ShapeResult<DimensionValue> {
    if (typeof value !== "object" || value === null || value === undefined) {
        return {
            ok: false,
            error: {
                severity: "error",
                code: "invalid-shape",
                path,
                hint: `Expected an object for dimension object, got ${typeof value}`,
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
                hint: `Expected a number for dimension value, got ${typeof candidate.value}`,
            },
        };
    }
    if (
        !candidate.unit ||
        typeof candidate.unit !== "string" ||
        (candidate.unit !== "px" && candidate.unit !== "rem")
    ) {
        return {
            ok: false,
            error: {
                severity: "error",
                code: "invalid-shape",
                path,
                hint: `Expected a type 'px' or 'rem' for dimension unit, got ${typeof candidate.unit}`,
            },
        };
    }
    return {
        ok: true,
        value: candidate as DimensionValue,
    };
}
