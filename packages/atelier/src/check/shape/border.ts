import { BORDER_STYLE_VALUES, type BorderValue } from "@/types";
import type { ShapeResult } from "../types";
import { validateColorValue } from "./color";
import { validateDimensionValue } from "./dimension";

export function validateBorderValue(value: unknown, path: string): ShapeResult<BorderValue> {
    if (typeof value !== "object" || value === null) {
        return {
            ok: false,
            error: {
                severity: "error",
                code: "invalid-shape",
                path,
                hint: `Expected an object for border value, got ${typeof value}`,
            },
        };
    }

    const candidate = value as Record<string, unknown>;

    const colorResult = validateColorValue(candidate.color, `${path}.color`);
    if (!colorResult.ok) return colorResult;

    const widthResult = validateDimensionValue(candidate.width, `${path}.width`);
    if (!widthResult.ok) return widthResult;

    if (
        candidate.style === undefined ||
        candidate.style === null ||
        !BORDER_STYLE_VALUES.some((t) => t === candidate.style)
    ) {
        return {
            ok: false,
            error: {
                severity: "error",
                code: "invalid-shape",
                path: `${path}.style`,
                hint: `Expected one of (${BORDER_STYLE_VALUES.join(", ")}) for border style, got ${JSON.stringify(candidate.style)}`,
            },
        };
    }

    return {
        ok: true,
        value: {
            color: colorResult.value,
            width: widthResult.value,
            style: candidate.style as BorderValue["style"],
        },
    };
}
