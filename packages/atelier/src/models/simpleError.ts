export type ResolveErrorKind = "cycle" | "broken-reference" | "unknown" | "invalid-json";

export class AtelierResolveError extends Error {
    readonly kind: ResolveErrorKind;
    readonly path: string;
    readonly references: string[];
    readonly type: string | undefined;

    constructor(params: {
        kind: ResolveErrorKind;
        path: string;
        references: string[];
        type: string | undefined;
        message: string;
    }) {
        super(params.message);
        this.name = "AtelierResolveError";
        this.kind = params.kind;
        this.path = params.path;
        this.references = params.references;
        this.type = params.type;
    }
}
