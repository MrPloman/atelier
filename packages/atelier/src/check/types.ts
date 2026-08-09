import type { Diagnostic } from "@/types";

export interface Result {
    process: "references" | "orphaned" | "unreferenced" | "accessibility" | "CI";
    errors: Diagnostic[];
    ok: boolean;
}

export interface ReferencesResult extends Result {
    tokens: string[];
}

export interface OrphanedResult extends Result {
    tokens: string[];
}
export type ShapeResult<T> = { ok: true; value: T } | { ok: false; error: Diagnostic };
