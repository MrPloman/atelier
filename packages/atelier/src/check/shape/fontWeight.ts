import type { FontWeightValue } from "@/types";
import type { ShapeResult } from "../types";

const VALID_FONT_WEIGHT_KEYWORDS = [
    "thin",
    "hairline",
    "extra-light",
    "ultra-light",
    "light",
    "normal",
    "regular",
    "book",
    "medium",
    "semi-bold",
    "demi-bold",
    "bold",
    "extra-bold",
    "ultra-bold",
    "black",
    "heavy",
    "extra-black",
    "ultra-black",
] as const;

export function validateFontWeightValue(
    value: unknown,
    path: string,
): ShapeResult<FontWeightValue> {
    if (typeof value === "number") {
        if (Number.isNaN(value)) {
            return {
                ok: false,
                error: {
                    severity: "error",
                    code: "invalid-shape",
                    path,
                    hint: `Expected a valid number for fontWeight value, got NaN`,
                },
            };
        }
        return { ok: true, value };
    }

    if (typeof value === "string") {
        if (
            !VALID_FONT_WEIGHT_KEYWORDS.includes(
                value as (typeof VALID_FONT_WEIGHT_KEYWORDS)[number],
            )
        ) {
            return {
                ok: false,
                error: {
                    severity: "error",
                    code: "invalid-shape",
                    path,
                    hint: `Expected one of (${VALID_FONT_WEIGHT_KEYWORDS.join(", ")}) for fontWeight value, got "${value}"`,
                },
            };
        }
        return { ok: true, value: value as FontWeightValue };
    }

    return {
        ok: false,
        error: {
            severity: "error",
            code: "invalid-shape",
            path,
            hint: `Expected a number or a font-weight keyword for fontWeight value, got ${typeof value}`,
        },
    };
}
