import { AtelierResolveError } from "@/models/errors";
import type { Diagnostic, RawToken, TokenType } from "@/types";
import type { UnvalidatedResolvedToken } from "@/types/resolved";

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
function resolve(startPath: string, _flatTokens: Map<string, RawToken>): UnvalidatedResolvedToken {
    const detectedRoutes: string[] = [];
    return {
        path: startPath,
        ...iteratorMap(startPath, _flatTokens, detectedRoutes, startPath),
    };
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

function isRawToken(rawToken: unknown): rawToken is RawToken {
    return typeof rawToken === "object" && rawToken !== null && "$value" in rawToken;
}
