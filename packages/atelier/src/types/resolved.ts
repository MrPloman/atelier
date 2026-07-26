import type { TokenValueMap } from "./values.js";

export interface ResolvedToken<T extends keyof TokenValueMap = keyof TokenValueMap> {
    path: string;
    type: T;
    value: TokenValueMap[T];
    references: string[];
}

export type TokenSet = Map<string, ResolvedToken>;
