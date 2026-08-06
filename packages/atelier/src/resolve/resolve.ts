import type { RawToken, TokenType } from "@/types";

// const currentflatTokens = new Map<string, RawToken>([
//     [
//         "color.primary.blue.500",
//         {
//             $type: "color",
//             $value: {
//                 colorSpace: "srgb",
//                 components: [0.008, 0.396, 0.863],
//                 hex: "#0265DC",
//             },
//         },
//     ],

//     [
//         "color.secondary.gray.100",
//         {
//             $type: "color",
//             $value: {
//                 colorSpace: "srgb",
//                 components: [0.957, 0.961, 0.969],
//                 hex: "#F4F5F7",
//             },
//         },
//     ],

//     [
//         "semantic.text.primary",
//         {
//             // ojo: sin $type propio -- lo hereda de "semantic", que en el árbol original lo declaraba
//             $value: "{color.primary.blue.500}",
//         },
//     ],

//     [
//         "semantic.text.secondary",
//         {
//             $value: "{color.secondary.gray.100}",
//         },
//     ],

//     [
//         "semantic.background.primary",
//         {
//             $value: "{color.secondary.gray.100}",
//         },
//     ],

//     [
//         "semantic.background.secondary",
//         {
//             $value: "{color.primary.blue.500}",
//         },
//     ],

//     [
//         "component.button.text",
//         {
//             $value: "{semantic.text.primary}",
//         },
//     ],

//     [
//         "component.button.background",
//         {
//             $value: "{semantic.background.primary}",
//         },
//     ],
// ]);

// MainResolver
export function resolve(startPath: string, _flatTokens: Map<string, RawToken>): any {
    let detectedRoutes: string[] = [];
    return {
        path: startPath,

        ...iteratorMap(startPath, _flatTokens, detectedRoutes),
    };
}

// Iterator called all every cycle
function iteratorMap(path: string, _flatTokens: Map<string, RawToken>, detectedRoutes: string[]) {
    const currentToken: RawToken = _flatTokens.get(path) as RawToken;

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

    if (!valueIsNotFinal(currentToken.$value)) {
        // THIS IS FINAL VALUE

        return {
            type: currentToken.$type as TokenType,
            value: currentToken.$value,
            references: detectedRoutes,
        };
    } else {
        // THIS IMPLIES ANOTHER ITERATION
        let routeString: string = routeStringParser(currentToken.$value as string);
        const { newDetectedRoutes, routeDuplicity } = routesManager(routeString, detectedRoutes);
        if (!routeDuplicity) {
            // THERE IS NO DUPLICITY INSIDE THE ARRAY, SO GETS ANOTHER ITERATION
            return iteratorMap(routeString, _flatTokens, newDetectedRoutes);
        } else {
            const jsonInMessage = JSON.stringify({
                path: routeString,
                references: detectedRoutes,
                type: currentToken.$type ? currentToken.$type : undefined,
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
    }
}

function routesManager(
    route: string,
    detectedRoutes: string[],
): { routeDuplicity: boolean; newDetectedRoutes: string[] } {
    if (!detectedRoutes.includes(route)) {
        const newRoutes = [detectedRoutes, route].flat();
        return { routeDuplicity: false, newDetectedRoutes: newRoutes };
    } else return { routeDuplicity: true, newDetectedRoutes: detectedRoutes };
}
function routeStringParser(route: string): string {
    return route.replaceAll("{", "").replaceAll("}", "");
}

function valueIsNotFinal(value: unknown): boolean {
    if (typeof value !== "string") return false;
    return value.startsWith("{") && value.endsWith("}");
}

// resolve("component.button.text", flatTokens);
