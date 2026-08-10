// src/check/shape/shadow.ts
import type { ShadowValue, SingleShadowValue } from "@/types";
import type { ShapeResult } from "../types";
import { validateColorValue } from "./color";
import { validateDimensionValue } from "./dimension";

function validateSingleShadowValue(value: unknown, path: string): ShapeResult<SingleShadowValue> {
    if (typeof value !== "object" || value === null) {
        return {
            ok: false,
            error: {
                severity: "error",
                code: "invalid-shape",
                path,
                hint: `Expected an object for shadow value, got ${typeof value}`,
            },
        };
    }

    const candidate = value as Record<string, unknown>;

    const colorResult = validateColorValue(candidate.color, `${path}.color`);
    if (!colorResult.ok) return colorResult;

    const offsetXResult = validateDimensionValue(candidate.offsetX, `${path}.offsetX`);
    if (!offsetXResult.ok) return offsetXResult;

    const offsetYResult = validateDimensionValue(candidate.offsetY, `${path}.offsetY`);
    if (!offsetYResult.ok) return offsetYResult;

    const blurResult = validateDimensionValue(candidate.blur, `${path}.blur`);
    if (!blurResult.ok) return blurResult;

    const spreadResult = validateDimensionValue(candidate.spread, `${path}.spread`);
    if (!spreadResult.ok) return spreadResult;

    // inset es opcional en la spec — si no viene, se aplica el default (false)
    if (candidate.inset !== undefined && typeof candidate.inset !== "boolean") {
        return {
            ok: false,
            error: {
                severity: "error",
                code: "invalid-shape",
                path: `${path}.inset`,
                hint: `Expected a boolean for shadow inset, got ${typeof candidate.inset}`,
            },
        };
    }

    return {
        ok: true,
        value: {
            color: colorResult.value,
            offsetX: offsetXResult.value,
            offsetY: offsetYResult.value,
            blur: blurResult.value,
            spread: spreadResult.value,
            inset: typeof candidate.inset === "boolean" ? candidate.inset : false,
        },
    };
}
export function validateShadowValue(value: unknown, path: string): ShapeResult<ShadowValue> {
    if (Array.isArray(value)) {
        if (value.length === 0) {
            return {
                ok: false,
                error: {
                    severity: "error",
                    code: "invalid-shape",
                    path,
                    hint: `Expected a non-empty array of shadow values, got an empty array`,
                },
            };
        }

        const resolvedShadows: SingleShadowValue[] = [];

        for (let i = 0; i < value.length; i++) {
            const itemResult = validateSingleShadowValue(value[i], `${path}[${i}]`);
            if (!itemResult.ok) return itemResult;
            resolvedShadows.push(itemResult.value);
        }

        return { ok: true, value: resolvedShadows };
    }

    return validateSingleShadowValue(value, path);
}
