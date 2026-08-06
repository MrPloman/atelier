import type { TokenType } from "./tokens.js";
import type { TokenValueMap } from "./values.js";

export interface ResolvedToken<T extends keyof TokenValueMap = keyof TokenValueMap> {
    path: string;
    type: T;
    value: TokenValueMap[T];
    references: string[];
}

// resolved.ts, junto a ResolvedToken
export interface UnvalidatedResolvedToken {
    path: string;
    type: TokenType | undefined;
    value: unknown;
    references: string[];
}

export type TokenSet = Map<string, ResolvedToken>;
