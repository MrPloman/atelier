export interface ErrorResult {
    severity: "error" | "warning";
    codeError: string;
    path: string;
    line?: number;
    position?: number;
    hint?: string;
}

export interface Result {
    process: "references" | "orphaned" | "unreferenced" | "accessibility" | "CI";
    errors: ErrorResult[];
    ok: boolean;
}
export interface ReferencesResult extends Result {
    tokens: string[];
}
export interface OrphanedResult extends Result {
    tokens: string[];
}
