import type { LineHeightValue } from "@/types";
import type { ShapeResult } from "../types";

export function validateLineHeightValue(
    value: unknown,
    path: string,
): ShapeResult<LineHeightValue> {
    if (typeof value !== "number" || Number.isNaN(value)) {
        return {
            ok: false,
            error: {
                severity: "error",
                code: "invalid-shape",
                path,
                hint: `Expected a number for lineHeight value, got ${typeof value}`,
            },
        };
    }

    return { ok: true, value };
}
