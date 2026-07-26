export type Diagnostic = {
    severity: "error" | "warning";
    code: string;
    path: string;
    hint?: string;
};
