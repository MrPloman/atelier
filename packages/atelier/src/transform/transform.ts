import type { ResolvedToken, TokenType, TokenValueMap } from "@/types";
export type Transform<T extends TokenType = TokenType> = {
    name: string;
    appliesTo: T;
    apply: (value: TokenValueMap[T]) => TokenValueMap[T];
};
export function applyTransformsToValue<T extends TokenType>(
    type: T,
    value: TokenValueMap[T],
    transforms: Transform[],
): TokenValueMap[T] {
    const applicable: Transform<T>[] = transforms.filter(
        (t) => t.appliesTo === type,
    ) as unknown as Transform<T>[];
    return applicable.reduce(
        (currentValue: TokenValueMap[T], transform: Transform<T>) => transform.apply(currentValue),
        value,
    );
}
export function applyTransforms(
    tokens: Map<string, ResolvedToken>,
    transforms: Transform[],
): Map<string, ResolvedToken> {
    const transformedTokens = new Map<string, ResolvedToken>();

    for (const [path, token] of tokens) {
        if (!token || token.type === undefined) {
            throw new Error(
                `[applyTransforms] Token at path "${path}" has no type. Cannot apply transforms.`,
            );
        }
        const transformedValue = applyTransformsToValue(token.type, token.value, transforms);
        transformedTokens.set(path, { ...token, value: transformedValue } as ResolvedToken);
    }

    return transformedTokens;
}
