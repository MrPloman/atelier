import type { RawToken } from "@/types/tokens";

// src/utils/type-guards.ts
export function isRawToken(node: unknown): node is RawToken {
    return typeof node === "object" && node !== null && "$value" in node;
}

export function isPlausibleNode(node: unknown): node is Record<string, unknown> {
    return typeof node === "object" && node !== null;
}
