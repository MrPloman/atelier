import { COMPOUND_TYPES, type RawGroup, type RawToken, type TokenType } from "@/types";
import { isPlausibleNode, isRawToken } from "@/utils/type-guards";

// src/walk.ts
export function walk(document: RawGroup): {
    flatTokens: Map<string, RawToken>;
    compoundPaths: Set<string>;
} {
    const flatTokens = new Map<string, RawToken>();
    walkNode(document, "", undefined, flatTokens);
    const compoundPaths = new Set<string>();
    for (const [path, token] of flatTokens) {
        if (
            token.$type !== undefined &&
            (COMPOUND_TYPES as readonly TokenType[]).includes(token.$type)
        ) {
            compoundPaths.add(path);
        }
    }
    return { flatTokens, compoundPaths };
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
