// src/check/shape/gradient.ts
import type { GradientStop, GradientValue } from "@/types";
import type { ShapeResult } from "../types";
import { validateColorValue } from "./color";

export function validateGradientValue(value: unknown, path: string): ShapeResult<GradientValue> {
    if (!Array.isArray(value)) {
        return {
            ok: false,
            error: {
                severity: "error",
                code: "invalid-shape",
                path,
                hint: `Expected an array of gradient stops for gradient value, got ${typeof value}`,
            },
        };
    }

    if (value.length === 0) {
        return {
            ok: false,
            error: {
                severity: "error",
                code: "invalid-shape",
                path,
                hint: `Expected a non-empty array of gradient stops, got an empty array`,
            },
        };
    }

    const resolvedStops: GradientStop[] = [];

    for (let i = 0; i < value.length; i++) {
        const stop = value[i];

        if (typeof stop !== "object" || stop === null) {
            return {
                ok: false,
                error: {
                    severity: "error",
                    code: "invalid-shape",
                    path: `${path}[${i}]`,
                    hint: `Expected an object for gradient stop, got ${typeof stop}`,
                },
            };
        }

        const candidate = stop as Record<string, unknown>;

        const colorResult = validateColorValue(candidate.color, `${path}[${i}].color`);
        if (!colorResult.ok) return colorResult;

        // Sin validación de rango [0,1] — mismo criterio que fontWeight: solo forma, no rango.
        if (typeof candidate.position !== "number" || Number.isNaN(candidate.position)) {
            return {
                ok: false,
                error: {
                    severity: "error",
                    code: "invalid-shape",
                    path: `${path}[${i}].position`,
                    hint: `Expected a number for gradient stop position, got ${typeof candidate.position}`,
                },
            };
        }

        resolvedStops.push({ color: colorResult.value, position: candidate.position });
    }

    return { ok: true, value: resolvedStops };
}
