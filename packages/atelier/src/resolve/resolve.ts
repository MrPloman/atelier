import { AtelierCompoundResolveError } from "@/models/compoundError";
import { AtelierResolveError } from "@/models/simpleError";
import type { CompoundHop, Diagnostic, RawToken, TokenType } from "@/types";
import type { UnvalidatedResolvedToken } from "@/types/resolved";
import { COMPOUND_TYPES } from "@/types/tokens";
import { isRawToken } from "@/utils/type-guards";

export function resolveAll(_flatTokens: Map<string, RawToken>): {
    resolved: Map<string, UnvalidatedResolvedToken>;
    errors: Diagnostic[];
} {
    const globalResults: {
        resolved: Map<string, UnvalidatedResolvedToken>;
        errors: Diagnostic[];
    } = {
        resolved: new Map(),
        errors: [],
    };
    for (const path of _flatTokens.keys()) {
        try {
            globalResults.resolved.set(path, resolve(path, _flatTokens));
        } catch (error: unknown) {
            let diagnostic: Diagnostic = {
                severity: "error",
                path,
                hint: "",
                code: "",
            };
            if (error instanceof AtelierResolveError) {
                diagnostic = { ...diagnostic, hint: error.message, code: error.kind };
            } else {
                diagnostic = { ...diagnostic, hint: "unexpected_error", code: "unknown" };
            }
            globalResults.errors = [...globalResults.errors, diagnostic];
        }
    }
    return globalResults;
}

export function resolve(
    startPath: string,
    _flatTokens: Map<string, RawToken>,
): UnvalidatedResolvedToken {
    const detectedRoutes: string[] = [];
    return {
        path: startPath,
        ...iteratorMap(startPath, _flatTokens, detectedRoutes, startPath),
    };
}

// Punto de entrada público — el que van a llamar check/ y parseTokens()
export function resolveCompoundValue(
    path: string,
    compoundValue: Record<string, unknown>,
    _flatTokens: Map<string, RawToken>,
): Record<string, unknown> {
    // Siembra el hop inicial ANTES de cualquier recursión — así el propio
    // punto de partida queda vigilado desde el minuto uno, igual que
    // startPath en resolve().
    return resolveCompoundValueInner(path, compoundValue, _flatTokens, [{ path, field: "<root>" }]);
}

// Motor recursivo interno — nadie fuera de este fichero lo llama directamente
function resolveCompoundValueInner(
    path: string,
    compoundValue: Record<string, unknown>,
    _flatTokens: Map<string, RawToken>,
    detectedCompoundRoutes: CompoundHop[],
): Record<string, unknown> {
    const resolvedFields: Record<string, unknown> = {};

    for (const [field, fieldValue] of Object.entries(compoundValue)) {
        if (!valueIsNotFinal(fieldValue)) {
            resolvedFields[field] = fieldValue;
            continue;
        }

        const referencedPath = routeStringParser(fieldValue as string);
        const targetToken = _flatTokens.get(referencedPath);

        if (!targetToken || !targetToken.$value || isRawToken(targetToken) === false) {
            throw new AtelierCompoundResolveError({
                kind: "compound-broken-reference",
                path: referencedPath,
                field,
                chain: detectedCompoundRoutes.map((hop) => hop.path),
                message: `Broken reference detected at resolveCompoundValue(). Invalid Tokens Reference: No value detected in ${referencedPath}. Failure path location in token: ${JSON.stringify(
                    { path: referencedPath, type: targetToken?.$type },
                )}`,
            });
        }

        const isCompoundTarget =
            targetToken.$type !== undefined &&
            (COMPOUND_TYPES as readonly TokenType[]).includes(targetToken.$type);

        if (isCompoundTarget) {
            const { routeDuplicity, newDetectedCompoundRoutes } = compoundRoutesManager(
                referencedPath,
                field,
                detectedCompoundRoutes,
            );

            if (routeDuplicity) {
                throw new AtelierCompoundResolveError({
                    kind: "compound-cycle",
                    path: referencedPath,
                    field,
                    chain: detectedCompoundRoutes.map((hop) => hop.path),
                    message: `
                    [ERROR] Cyclic compound reference detected at resolveCompoundValue().
                    Invalid Tokens Routing: circular chain found.
                    Cycle: ${detectedCompoundRoutes.map((hop) => `${hop.path} (via "${hop.field}")`).join(" → ")} → ${referencedPath}
          `,
                });
            }

            resolvedFields[field] = resolveCompoundValueInner(
                referencedPath,
                targetToken.$value as Record<string, unknown>,
                _flatTokens,
                newDetectedCompoundRoutes,
            );
        } else {
            const simpleResolved = resolve(referencedPath, _flatTokens);
            resolvedFields[field] = simpleResolved.value;
        }
    }

    return resolvedFields;
}

function iteratorMap(
    path: string,
    _flatTokens: Map<string, RawToken>,
    detectedRoutes: string[],
    startPath: string,
): { type: TokenType | undefined; value: unknown; references: string[] } {
    const currentToken: RawToken = _flatTokens.get(path) as RawToken;

    if (!currentToken || !currentToken.$value || isRawToken(currentToken) === false) {
        throw new AtelierResolveError({
            kind: "broken-reference",
            path,
            references: detectedRoutes,
            type: currentToken?.$type,
            message: buildBrokenReferenceError(path, detectedRoutes, currentToken?.$type),
        });
    }

    if (!valueIsNotFinal(currentToken.$value)) {
        return {
            type: currentToken.$type as TokenType,
            value: currentToken.$value,
            references: detectedRoutes,
        };
    }

    const routeString = routeStringParser(currentToken.$value as string);
    const { newDetectedRoutes, routeDuplicity } = routesManager(
        routeString,
        detectedRoutes,
        startPath,
    );

    if (!routeDuplicity) {
        return iteratorMap(routeString, _flatTokens, newDetectedRoutes, startPath);
    } else {
        throw new AtelierResolveError({
            kind: "cycle",
            path: routeString,
            references: detectedRoutes,
            type: currentToken.$type,
            message: buildCycleError(startPath, detectedRoutes, routeString, currentToken.$type),
        });
    }
}

function routesManager(
    route: string,
    detectedRoutes: string[],
    startPath: string,
): { routeDuplicity: boolean; newDetectedRoutes: string[] } {
    const seen = [startPath, ...detectedRoutes];
    if (!seen.includes(route)) {
        return { routeDuplicity: false, newDetectedRoutes: [...detectedRoutes, route] };
    }
    return { routeDuplicity: true, newDetectedRoutes: detectedRoutes };
}

function compoundRoutesManager(
    path: string,
    field: string,
    detectedCompoundRoutes: CompoundHop[],
): { routeDuplicity: boolean; newDetectedCompoundRoutes: CompoundHop[] } {
    const alreadyOpen = detectedCompoundRoutes.some((hop) => hop.path === path);

    if (!alreadyOpen) {
        return {
            routeDuplicity: false,
            newDetectedCompoundRoutes: [...detectedCompoundRoutes, { path, field }],
        };
    }
    return { routeDuplicity: true, newDetectedCompoundRoutes: detectedCompoundRoutes };
}

function buildCycleError(
    startPath: string,
    detectedRoutes: string[],
    routeString: string,
    type: TokenType | undefined,
): string {
    const chain = [startPath, ...detectedRoutes, routeString].join(" → ");
    return `
                    [ERROR] Cyclic reference detected at iteratorMap().
                    Invalid Tokens Routing: circular chain found.
                    Cycle: ${chain}
                    Failure path location in token:
                        {
                            ${JSON.stringify({ path: routeString, references: detectedRoutes, type })}
                        }
                    `;
}

function buildBrokenReferenceError(
    path: string,
    detectedRoutes: string[],
    type: TokenType | undefined,
): string {
    return `
                    [ERROR] Broken reference detected at iteratorMap().
                    Invalid Tokens Reference: No value detected in ${path} .
                    Failure path location in token: 
                    {
                        ${JSON.stringify({ path, references: detectedRoutes, type })}
                    }
    `;
}

function routeStringParser(route: string): string {
    return route.replaceAll("{", "").replaceAll("}", "");
}

function valueIsNotFinal(value: unknown): boolean {
    if (typeof value !== "string") return false;
    return value.startsWith("{") && value.endsWith("}");
}
