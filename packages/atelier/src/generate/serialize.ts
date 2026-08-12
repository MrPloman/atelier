// src/generate/css.ts
import type {
    BorderValue,
    ColorValue,
    CubicBezierValue,
    DimensionValue,
    DurationValue,
    FontWeightValue,
    GradientValue,
    ResolvedToken,
    ShadowValue,
    SingleShadowValue,
    StrokeStyleValue,
    TransitionValue,
    TypographyValue,
} from "@/types";
import {
    isBorderValue,
    isColorValue,
    isCubicBezierValue,
    isDimensionValue,
    isDurationValue,
    isFontFamilyValue,
    isFontWeightValue,
    isGradientValue,
    isResolvedToken,
    isShadowValue,
    isStrokeStyleValue,
    isTransitionValue,
    isTypographyValue,
} from "@/utils/type-guards";

function colorToCss(value: ColorValue): string {
    const [r, g, b] = value.components.map((c) => Math.round(c * 255));
    return value.alpha !== undefined
        ? `rgba(${r}, ${g}, ${b}, ${value.alpha})`
        : `rgb(${r}, ${g}, ${b})`;
}

function dimensionToCss(value: DimensionValue): string {
    return `${value.value}${value.unit}`;
}

function durationToCss(value: DurationValue): string {
    return `${value.value}${value.unit}`;
}

function cubicBezierToCss(value: CubicBezierValue): string {
    return `cubic-bezier(${value.join(", ")})`;
}

function fontFamilyToCss(value: string | string[]): string {
    if (!Array.isArray(value)) return value;
    return value.map((f) => (f.includes(" ") ? `"${f}"` : f)).join(", ");
}

function fontWeightToCss(value: FontWeightValue): string {
    return String(value);
}

function borderToCss(value: BorderValue): string {
    return `${dimensionToCss(value.width)} ${value.style} ${colorToCss(value.color)}`;
}

function transitionToCss(value: TransitionValue): string {
    return `${durationToCss(value.duration)} ${cubicBezierToCss(value.timingFunction)} ${durationToCss(value.delay)}`;
}

function singleShadowToCss(value: SingleShadowValue): string {
    return `${value.inset ? "inset " : ""}${dimensionToCss(value.offsetX)} ${dimensionToCss(value.offsetY)} ${dimensionToCss(value.blur)} ${dimensionToCss(value.spread)} ${colorToCss(value.color)}`;
}

function shadowToCss(value: ShadowValue): string {
    return Array.isArray(value)
        ? value.map(singleShadowToCss).join(", ")
        : singleShadowToCss(value);
}

function gradientToCss(value: GradientValue): string {
    return `linear-gradient(${value.map((s) => `${colorToCss(s.color)} ${Math.round(s.position * 100)}%`).join(", ")})`;
}

// DECISIÓN 1: strokeStyle como objeto ({dashArray, lineCap}) no tiene una
// única propiedad CSS equivalente -> se expande en varias custom properties.
function strokeStyleToCss(value: StrokeStyleValue): string | Record<string, string> {
    if (typeof value === "string") return value;
    return {
        "dash-array": value.dashArray.map(dimensionToCss).join(" "),
        "line-cap": value.lineCap,
    };
}

// DECISIÓN 1 (mismo caso): typography tampoco tiene un único valor CSS ->
// se expande siempre en varias custom properties (font-family, font-size...).
function typographyToCss(value: TypographyValue): Record<string, string> {
    return {
        "font-family": fontFamilyToCss(value.fontFamily),
        "font-size": dimensionToCss(value.fontSize),
        "font-weight": fontWeightToCss(value.fontWeight),
        "letter-spacing": value.letterSpacing,
        "line-height": String(value.lineHeight),
    };
}

export function serializeTokenValue(token: ResolvedToken): string | Record<string, string> {
    if (
        !token ||
        token.type === undefined ||
        token.value === undefined ||
        token.value === null ||
        !isResolvedToken(token)
    ) {
        throw new Error(`Token at path "${token.path}" has no type.`);
    }
    // DEFENSIVE PROGRAMMING: aunque el tipo ResolvedToken garantiza que el
    // token tiene un type y un value, hacemos comprobaciones adicionales para asegurarnos de
    // que el value es del tipo correcto según el type del token. Esto ayuda a detectar errores en tiempo
    // de ejecución si los datos no cumplen con las expectativas.
    switch (token.type) {
        case "color":
            if (!isColorValue(token.value)) {
                throw new Error(`Token at path "${token.path}" has no correct value for color.`);
            }
            return colorToCss(token.value);
        case "dimension":
            if (!isDimensionValue(token.value) && !isDurationValue(token.value)) {
                throw new Error(
                    `Token at path "${token.path}" has no correct value for dimension.`,
                );
            }
            return dimensionToCss(token.value);
        case "number":
            if (typeof token.value !== "number") {
                throw new Error(`Token at path "${token.path}" has no correct value for number.`);
            }
            return String(token.value);
        case "fontWeight":
            if (!isFontWeightValue(token.value)) {
                throw new Error(
                    `Token at path "${token.path}" has no correct value for fontWeight.`,
                );
            }
            return fontWeightToCss(token.value);
        case "fontFamily":
            if (!isFontFamilyValue(token.value)) {
                throw new Error(
                    `Token at path "${token.path}" has no correct value for fontFamily.`,
                );
            }
            return fontFamilyToCss(token.value);
        case "duration":
            if (!isDurationValue(token.value)) {
                throw new Error(`Token at path "${token.path}" has no correct value for duration.`);
            }
            return durationToCss(token.value);
        case "cubicBezier":
            if (!isCubicBezierValue(token.value)) {
                throw new Error(
                    `Token at path "${token.path}" has no correct value for cubicBezier.`,
                );
            }
            return cubicBezierToCss(token.value);
        case "border":
            if (!isBorderValue(token.value)) {
                throw new Error(`Token at path "${token.path}" has no correct value for border.`);
            }
            return borderToCss(token.value);
        case "transition":
            if (!isTransitionValue(token.value)) {
                throw new Error(
                    `Token at path "${token.path}" has no correct value for transition.`,
                );
            }
            return transitionToCss(token.value);
        case "shadow":
            if (!isShadowValue(token.value)) {
                throw new Error(`Token at path "${token.path}" has no correct value for shadow.`);
            }
            return shadowToCss(token.value);
        case "gradient":
            if (!isGradientValue(token.value)) {
                throw new Error(`Token at path "${token.path}" has no correct value for gradient.`);
            }
            return gradientToCss(token.value);
        case "strokeStyle":
            if (!isStrokeStyleValue(token.value)) {
                throw new Error(
                    `Token at path "${token.path}" has no correct value for strokeStyle.`,
                );
            }
            return strokeStyleToCss(token.value);
        case "typography":
            if (!isTypographyValue(token.value)) {
                throw new Error(
                    `Token at path "${token.path}" has no correct value for typography.`,
                );
            }
            return typographyToCss(token.value);
        default: {
            const _exhaustiveCheck: never = token;
            return _exhaustiveCheck;
        }
    }
}

export function generateCSS(tokens: Map<string, ResolvedToken>): string {
    const lines: string[] = [":root {"];

    for (const [path, token] of tokens) {
        const varName = path.replaceAll(".", "-");
        const serialized = serializeTokenValue(token);

        if (typeof serialized === "string") {
            lines.push(`  --${varName}: ${serialized};`);
        } else {
            for (const [field, value] of Object.entries(serialized)) {
                lines.push(`  --${varName}-${field}: ${value};`);
            }
        }
    }

    lines.push("}");
    return lines.join("\n");
}
