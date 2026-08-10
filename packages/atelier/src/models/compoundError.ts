export type CompoundResolveErrorKind = "compound-cycle" | "compound-broken-reference";

export class AtelierCompoundResolveError extends Error {
    readonly kind: CompoundResolveErrorKind;
    readonly path: string; // el token compuesto donde ocurrió el fallo
    readonly field: string; // qué campo del objeto falló (p.ej. 'color')
    readonly chain: string[]; // la cadena de compuestos abiertos hasta el fallo

    constructor(params: {
        kind: CompoundResolveErrorKind;
        path: string;
        field: string;
        chain: string[];
        message: string;
    }) {
        super(params.message);
        this.name = "AtelierCompoundResolveError";
        this.kind = params.kind;
        this.path = params.path;
        this.field = params.field;
        this.chain = params.chain;
    }
}
