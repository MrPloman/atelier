import type { TokenType } from "./tokens.js";
import type { TokenValueMap } from "./values.js";

export type ResolvedToken<T extends keyof TokenValueMap = keyof TokenValueMap> = {
    [K in T]: {
        path: string;
        type: K;
        value: TokenValueMap[K];
        references: string[];
    };
}[T];

export interface UnvalidatedResolvedToken {
    path: string;
    type: TokenType | undefined;
    value: unknown;
    references: string[];
}

export type TokenSet = Map<string, ResolvedToken>;

export type CompoundHop = { path: string; field: string };
