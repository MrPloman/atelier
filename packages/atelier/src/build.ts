// src/build.ts
import { checkTokenShape } from "@/check/shape";
import { parseTokens } from "@/parse/parse";
import { applyTransforms, type Transform } from "@/transform/transform";
import type { Diagnostic, ResolvedToken } from "@/types";

export function buildTokens(
    rawJson: string,
    transforms: Transform[] = [],
): {
    tokens: Map<string, ResolvedToken>;
    errors: Diagnostic[];
} {
    const { resolved, errors: resolveErrors } = parseTokens(rawJson);

    const validatedTokens = new Map<string, ResolvedToken>();
    const shapeErrors: Diagnostic[] = [];

    for (const [path, token] of resolved) {
        const shapeResult = checkTokenShape(token);
        if (shapeResult.ok) {
            validatedTokens.set(path, shapeResult.value);
        } else {
            shapeErrors.push(shapeResult.error);
        }
    }

    const transformedTokens = applyTransforms(validatedTokens, transforms);

    return {
        tokens: transformedTokens,
        errors: [...resolveErrors, ...shapeErrors],
    };
}
