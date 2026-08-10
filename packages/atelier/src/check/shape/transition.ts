import { type TransitionValue } from "@/types";
import type { ShapeResult } from "../types";
import { validateCubicBezierValue } from "./cubicBezier";
import { validateDurationValue } from "./duration";

export function validateTransitionValue(
    value: unknown,
    path: string,
): ShapeResult<TransitionValue> {
    if (typeof value !== "object" || value === null) {
        return {
            ok: false,
            error: {
                severity: "error",
                code: "invalid-shape",
                path,
                hint: `Expected an object for transition value, got ${typeof value}`,
            },
        };
    }

    const candidate = value as Record<string, unknown>;

    const durationResult = validateDurationValue(candidate.duration, `${path}.duration`);
    if (!durationResult.ok) return durationResult;

    const delayResult = validateDurationValue(candidate.delay, `${path}.delay`);
    if (!delayResult.ok) return delayResult;

    const timingFunctionResult = validateCubicBezierValue(
        candidate.timingFunction,
        `${path}.timingFunction`,
    );
    if (!timingFunctionResult.ok) return timingFunctionResult;

    return {
        ok: true,
        value: {
            duration: durationResult.value,
            delay: delayResult.value,
            timingFunction: timingFunctionResult.value,
        },
    };
}
