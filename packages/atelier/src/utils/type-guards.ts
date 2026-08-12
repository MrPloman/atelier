// src/utils/type-guards.ts
import { validateBorderValue } from "@/check/shape/border";
import { validateColorValue } from "@/check/shape/color";
import { validateCubicBezierValue } from "@/check/shape/cubicBezier";
import { validateDimensionValue } from "@/check/shape/dimension";
import { validateDurationValue } from "@/check/shape/duration";
import { validateFontFamilyValue } from "@/check/shape/fontFamily";
import { validateFontWeightValue } from "@/check/shape/fontWeight";
import { validateGradientValue } from "@/check/shape/gradient";
import { validateLetterSpacingValue } from "@/check/shape/letterSpacing";
import { validateLineHeightValue } from "@/check/shape/lineHeight";
import { validateShadowValue } from "@/check/shape/shadow";
import { validateStrokeStyleValue } from "@/check/shape/strokeStyle";
import { validateTransitionValue } from "@/check/shape/transition";
import { validateTypographyValue } from "@/check/shape/typography";
import type {
    BorderValue,
    ColorValue,
    CubicBezierValue,
    DimensionValue,
    DurationValue,
    FontWeightValue,
    GradientValue,
    LetterSpacingValue,
    LineHeightValue,
    RawToken,
    ResolvedToken,
    ShadowValue,
    StrokeStyleValue,
    TransitionValue,
    TypographyValue,
} from "@/types";

export function isRawToken(node: unknown): node is RawToken {
    return typeof node === "object" && node !== null && "$value" in node;
}

export function isPlausibleNode(node: unknown): node is Record<string, unknown> {
    return typeof node === "object" && node !== null;
}

export function isResolvedToken(token: unknown): token is ResolvedToken {
    return typeof token === "object" && token !== null && "type" in token && "value" in token;
}

export function isColorValue(value: unknown): value is ColorValue {
    return validateColorValue(value, "").ok;
}

export function isDimensionValue(value: unknown): value is DimensionValue {
    return validateDimensionValue(value, "").ok;
}

export function isTypographyValue(value: unknown): value is TypographyValue {
    return validateTypographyValue(value, "").ok;
}

export function isFontWeightValue(value: unknown): value is FontWeightValue {
    return validateFontWeightValue(value, "").ok;
}

export function isFontFamilyValue(value: unknown): value is string | string[] {
    return validateFontFamilyValue(value, "").ok;
}

export function isLetterSpacingValue(value: unknown): value is LetterSpacingValue {
    return validateLetterSpacingValue(value, "").ok;
}

export function isLineHeightValue(value: unknown): value is LineHeightValue {
    return validateLineHeightValue(value, "").ok;
}

export function isDurationValue(value: unknown): value is DurationValue {
    return validateDurationValue(value, "").ok;
}

export function isCubicBezierValue(value: unknown): value is CubicBezierValue {
    return validateCubicBezierValue(value, "").ok;
}

export function isBorderValue(value: unknown): value is BorderValue {
    return validateBorderValue(value, "").ok;
}

export function isTransitionValue(value: unknown): value is TransitionValue {
    return validateTransitionValue(value, "").ok;
}

export function isShadowValue(value: unknown): value is ShadowValue {
    return validateShadowValue(value, "").ok;
}

export function isGradientValue(value: unknown): value is GradientValue {
    return validateGradientValue(value, "").ok;
}

export function isStrokeStyleValue(value: unknown): value is StrokeStyleValue {
    return validateStrokeStyleValue(value, "").ok;
}
