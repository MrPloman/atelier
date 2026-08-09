// src/check/rules/type-shape.ts (o donde decidas meter las 7 funciones)
import type { ColorValue } from "@/types";
import type { ShapeResult } from "../types";

export function validateColorValue(value: unknown, path: string): ShapeResult<ColorValue> {
    if (typeof value !== "object" || value === null) {
        return {
            ok: false,
            error: {
                severity: "error",
                code: "invalid-shape",
                path,
                hint: `Expected an object for color value, got ${typeof value}`,
            },
        };
    }

    const candidate = value as Record<string, unknown>;

    if (
        typeof candidate.colorSpace !== "string" ||
        candidate.colorSpace === undefined ||
        !candidate.colorSpace
    ) {
        return {
            ok: false,
            error: {
                severity: "error",
                code: "invalid-shape",
                path,
                hint: `Expected 'colorSpace' to be a string, got ${typeof candidate.colorSpace}`,
            },
        };
    }

    if (
        !Array.isArray(candidate.components) ||
        !candidate.components.every((c) => typeof c === "number")
    ) {
        return {
            ok: false,
            error: {
                severity: "error",
                code: "invalid-shape",
                path,
                hint: `Expected 'components' to be number[], got ${JSON.stringify(candidate.components)}`,
            },
        };
    }

    if (candidate.alpha !== undefined && typeof candidate.alpha !== "number") {
        return {
            ok: false,
            error: {
                severity: "error",
                code: "invalid-shape",
                path,
                hint: `Expected 'alpha' to be a number if present, got ${typeof candidate.alpha}`,
            },
        };
    }

    if (candidate.hex !== undefined && typeof candidate.hex !== "string") {
        return {
            ok: false,
            error: {
                severity: "error",
                code: "invalid-shape",
                path,
                hint: `Expected 'hex' to be a string if present, got ${typeof candidate.hex}`,
            },
        };
    }

    return {
        ok: true,
        value: candidate as ColorValue,
    };
}
