// src/check/shape/letterSpacing.ts
import type { LetterSpacingValue } from "@/types";
import type { ShapeResult } from "../types";

const LETTER_SPACING_PATTERN = /^(normal|-?\d+(\.\d+)?(em|px|%|rem))$/;

export function validateLetterSpacingValue(
    value: unknown,
    path: string,
): ShapeResult<LetterSpacingValue> {
    if (typeof value !== "string" || !LETTER_SPACING_PATTERN.test(value)) {
        return {
            ok: false,
            error: {
                severity: "error",
                code: "invalid-shape",
                path,
                hint: `Expected "normal" or a numeric value with unit (em, px, %, rem) for letterSpacing, got ${JSON.stringify(value)}`,
            },
        };
    }

    return { ok: true, value };
}
