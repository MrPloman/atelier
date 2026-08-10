// src/check/shape/strokeStyle.ts
import { STROKE_STYLE_KEYWORDS, type DimensionValue, type StrokeStyleValue } from "@/types";
import type { ShapeResult } from "../types";
import { validateDimensionValue } from "./dimension";

const LINE_CAP_VALUES = ["round", "butt", "square"] as const;

export function validateStrokeStyleValue(
    value: unknown,
    path: string,
): ShapeResult<StrokeStyleValue> {
    if (typeof value === "string") {
        if (!STROKE_STYLE_KEYWORDS.includes(value as (typeof STROKE_STYLE_KEYWORDS)[number])) {
            return {
                ok: false,
                error: {
                    severity: "error",
                    code: "invalid-shape",
                    path,
                    hint: `Expected one of (${STROKE_STYLE_KEYWORDS.join(", ")}) for strokeStyle value, got "${value}"`,
                },
            };
        }
        return { ok: true, value: value as StrokeStyleValue };
    }

    if (typeof value === "object" && value !== null) {
        const candidate = value as Record<string, unknown>;

        if (!Array.isArray(candidate.dashArray)) {
            return {
                ok: false,
                error: {
                    severity: "error",
                    code: "invalid-shape",
                    path: `${path}.dashArray`,
                    hint: `Expected an array of dimension values for dashArray, got ${typeof candidate.dashArray}`,
                },
            };
        }

        const resolvedDashArray: DimensionValue[] = [];
        for (let i = 0; i < candidate.dashArray.length; i++) {
            const itemResult = validateDimensionValue(
                candidate.dashArray[i],
                `${path}.dashArray[${i}]`,
            );
            if (!itemResult.ok) return itemResult;
            resolvedDashArray.push(itemResult.value);
        }

        if (!LINE_CAP_VALUES.some((c) => c === candidate.lineCap)) {
            return {
                ok: false,
                error: {
                    severity: "error",
                    code: "invalid-shape",
                    path: `${path}.lineCap`,
                    hint: `Expected one of (${LINE_CAP_VALUES.join(", ")}) for lineCap, got ${JSON.stringify(candidate.lineCap)}`,
                },
            };
        }

        return {
            ok: true,
            value: {
                dashArray: resolvedDashArray,
                lineCap: candidate.lineCap as "round" | "butt" | "square",
            },
        };
    }

    return {
        ok: false,
        error: {
            severity: "error",
            code: "invalid-shape",
            path,
            hint: `Expected a strokeStyle keyword or a { dashArray, lineCap } object, got ${typeof value}`,
        },
    };
}
