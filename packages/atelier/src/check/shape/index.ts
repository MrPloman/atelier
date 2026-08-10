import type { ResolvedToken, UnvalidatedResolvedToken } from "@/types";
import type { ShapeResult } from "../types";
import { validateBorderValue } from "./border";
import { validateColorValue } from "./color";
import { validateCubicBezierValue } from "./cubicBezier";
import { validateDimensionValue } from "./dimension";
import { validateDurationValue } from "./duration";
import { validateFontFamilyValue } from "./fontFamily";
import { validateFontWeightValue } from "./fontWeight";
import { validateNumberValue } from "./number";
import { validateTransitionValue } from "./transition";
import { validateTypographyValue } from "./typography";

export function checkTokenShape(token: UnvalidatedResolvedToken): ShapeResult<ResolvedToken> {
    const { path, type, value, references } = token;

    if (type === undefined) {
        return {
            ok: false,
            error: {
                severity: "error",
                code: "missing-type",
                path,
                hint: `Token has no resolvable $type — not set on the token itself, and not inherited from any parent group.`,
            },
        };
    }

    switch (type) {
        case "color": {
            const result = validateColorValue(value, path);
            if (!result.ok) return result;
            return { ok: true, value: { path, type, value: result.value, references } };
        }
        case "dimension": {
            const result = validateDimensionValue(value, path);
            if (!result.ok) return result;
            return { ok: true, value: { path, type, value: result.value, references } };
        }
        case "number": {
            const result = validateNumberValue(value, path);
            if (!result.ok) return result;
            return { ok: true, value: { path, type, value: result.value, references } };
        }
        case "duration": {
            const result = validateDurationValue(value, path);
            if (!result.ok) return result;
            return { ok: true, value: { path, type, value: result.value, references } };
        }
        case "fontWeight": {
            const result = validateFontWeightValue(value, path);
            if (!result.ok) return result;
            return {
                ok: true,
                value: { path, type, value: result.value, references },
            };
        }
        case "fontFamily": {
            const result = validateFontFamilyValue(value, path);
            if (!result.ok) return result;
            return {
                ok: true,
                value: { path, type, value: result.value, references },
            };
        }
        case "cubicBezier": {
            const result = validateCubicBezierValue(value, path);
            if (!result.ok) return result;
            return {
                ok: true,
                value: { path, type, value: result.value, references },
            };
        }

        case "typography": {
            const result = validateTypographyValue(value, path);
            if (!result.ok) return result;
            return {
                ok: true,
                value: { path, type, value: result.value, references },
            };
        }
        case "border": {
            const result = validateBorderValue(value, path);
            if (!result.ok) return result;
            return {
                ok: true,
                value: { path, type, value: result.value, references },
            };
        }
        case "transition": {
            const result = validateTransitionValue(value, path);
            if (!result.ok) return result;
            return {
                ok: true,
                value: { path, type, value: result.value, references },
            };
        }
        case "shadow":
        case "gradient":
        case "strokeStyle":
            return {
                ok: false,
                error: {
                    severity: "warning",
                    code: "unsupported-type",
                    path,
                    hint: `Token type "${type}" is not yet supported by Atelier's shape validation.`,
                },
            };

        default: {
            const _exhaustiveCheck: never = type;
            return _exhaustiveCheck;
        }
    }
}
