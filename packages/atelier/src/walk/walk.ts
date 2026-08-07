import type { RawGroup, RawToken, TokenType } from "@/types";
import { isPlausibleNode, isRawToken } from "@/utils/type-guards";

// src/walk.ts
export function walk(document: RawGroup): Map<string, RawToken> {
    const flatTokens = new Map<string, RawToken>();
    walkNode(document, "", undefined, flatTokens);
    return flatTokens;
}

function errorUnexpectedNodeShape(path: string): never {
    throw new Error(
        `[walk] Unexpected node shape at path "${path}". Expected RawGroup or RawToken.`,
    );
}

function walkNode(
    node: RawGroup | RawToken,
    path: string,
    inheritedType: TokenType | undefined,
    flatTokens: Map<string, RawToken>,
): void {
    if (isRawToken(node)) {
        const resolvedType = node.$type ?? inheritedType;
        flatTokens.set(path, {
            ...node,
            ...(resolvedType !== undefined ? { $type: resolvedType } : {}),
        });
        return;
    }

    if (!isPlausibleNode(node)) {
        errorUnexpectedNodeShape(path);
    }

    const group = node;
    const typeHere = group.$type ?? inheritedType;

    for (const [key, value] of Object.entries(group)) {
        if (key === "$type" || key === "$description") continue;
        const childPath = path ? `${path}.${key}` : key;

        if (!isPlausibleNode(value)) {
            errorUnexpectedNodeShape(childPath);
        }
        walkNode(value, childPath, typeHere, flatTokens);
    }
}
