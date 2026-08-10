import { type TypographyValue } from "@/types";
import type { ShapeResult } from "../types";
import { validateDimensionValue } from "./dimension";
import { validateFontFamilyValue } from "./fontFamily";
import { validateFontWeightValue } from "./fontWeight";
import { validateLetterSpacingValue } from "./letterSpacing";
import { validateLineHeightValue } from "./lineHeight";

export function validateTypographyValue(
    value: unknown,
    path: string,
): ShapeResult<TypographyValue> {
    if (typeof value !== "object" || value === null || value === undefined) {
        return {
            ok: false,
            error: {
                severity: "error",
                code: "invalid-shape",
                path,
                hint: `Expected an object for typography value, got ${typeof value}`,
            },
        };
    }

    const candidate = value as Record<string, unknown>;

    const fontFamilyResult = validateFontFamilyValue(candidate.fontFamily, `${path}.fontFamily`);
    if (!fontFamilyResult.ok) return fontFamilyResult;

    const fontSizeResult = validateDimensionValue(candidate.fontSize, `${path}.fontSize`);
    if (!fontSizeResult.ok) return fontSizeResult;

    const fontWeightResult = validateFontWeightValue(candidate.fontWeight, `${path}.fontWeight`);
    if (!fontWeightResult.ok) return fontWeightResult;

    const letterSpacingResult = validateLetterSpacingValue(
        candidate.letterSpacing,
        `${path}.letterSpacing`,
    );
    if (!letterSpacingResult.ok) return letterSpacingResult;

    const lineHeightResult = validateLineHeightValue(candidate.lineHeight, `${path}.lineHeight`);
    if (!lineHeightResult.ok) return lineHeightResult;

    return {
        ok: true,
        value: {
            fontFamily: fontFamilyResult.value,
            fontSize: fontSizeResult.value,
            fontWeight: fontWeightResult.value,
            letterSpacing: letterSpacingResult.value,
            lineHeight: lineHeightResult.value,
        },
    };
}
