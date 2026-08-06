import type { RawToken, TokenType } from "@/types";

const currentflatTokens = new Map<string, RawToken>([
    [
        "color.primary.blue.500",
        {
            $type: "color",
            $value: {
                colorSpace: "srgb",
                components: [0.008, 0.396, 0.863],
                hex: "#0265DC",
            },
        },
    ],

    [
        "color.secondary.gray.100",
        {
            $type: "color",
            $value: {
                colorSpace: "srgb",
                components: [0.957, 0.961, 0.969],
                hex: "#F4F5F7",
            },
        },
    ],

    [
        "semantic.text.primary",
        {
            // ojo: sin $type propio -- lo hereda de "semantic", que en el árbol original lo declaraba
            $value: "{color.primary.blue.500}",
        },
    ],

    [
        "semantic.text.secondary",
        {
            $value: "{color.secondary.gray.100}",
        },
    ],

    [
        "semantic.background.primary",
        {
            $value: "{color.secondary.gray.100}",
        },
    ],

    [
        "semantic.background.secondary",
        {
            $value: "{color.primary.blue.500}",
        },
    ],

    [
        "component.button.text",
        {
            $value: "{semantic.text.primary}",
        },
    ],

    [
        "component.button.background",
        {
            $value: "{semantic.background.primary}",
        },
    ],
]);

export function resolve(startPath: string, _flatTokens: Map<string, RawToken>): any {
    let detectedRoutes: string[] = [];
    return {
        ...iteratorMap(startPath, _flatTokens, detectedRoutes),
        path: startPath,
    };
}

function iteratorMap(path: string, _flatTokens: Map<string, RawToken>, detectedRoutes: string[]) {
    const currentToken: RawToken | undefined = _flatTokens.get(path);
    console.log(currentToken);
    if (!currentToken || !currentToken.$value) {
        const jsonInMessage = JSON.stringify({
            path,
            references: detectedRoutes,
            type: "",
        });
        throw new Error(`
                        [ERROR] Broken reference detected at iteratorMap().
                        Invalid Tokens Reference: No value detected in ${path} .
                        Failure path location in token: 
                        {
                            ${jsonInMessage}
                        }
        `);
    }
    if (currentToken && currentToken.$type && typeof currentToken.$value === "string") {
        let routeString: string = routeStringParser(currentToken.$value as string);
        if (routesManager(routeString, detectedRoutes))
            return iteratorMap(routeString, new Map().set("string", currentToken), detectedRoutes);
        else {
            const jsonInMessage = JSON.stringify({
                path: routeString,
                references: detectedRoutes,
                type: currentToken.$type ? currentToken.$type : currentToken.$value,
            });
            throw new Error(`
                        [ERROR] Duplicated reference cycled detected at iteratorMap().
                        Invalid Tokens Format: too many iterations due to invalid structure.
                        Failure path location in token: 
                            {
                                ${jsonInMessage}
                            }
                        `);
        }
    } else {
        return {
            value: currentToken.$value,
            references: detectedRoutes,
            type: currentToken.$type as TokenType,
        };
    }
}

function routesManager(
    route: string,
    detectedRoutes: string[],
): { pass: boolean; detectedRoutes: string[] } {
    let _routeParsed = routeStringParser(route);
    if (!detectedRoutes.includes(_routeParsed)) {
        detectedRoutes.push(_routeParsed);
        return { pass: true, detectedRoutes };
    } else return { pass: false, detectedRoutes };
}
function routeStringParser(route: string): string {
    return route.replaceAll("{", "").replaceAll("}", "");
}

// resolve("component.button.text", flatTokens);
