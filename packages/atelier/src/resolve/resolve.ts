import type { RawToken, TokenType } from "@/types";

const flatTokens = new Map<string, RawToken>([
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

function resolve(startPath: string, _flatTokens: Map<string, RawToken>): any {
    let detectedRoutes: string[] = [];
    return iteratorMap(startPath, _flatTokens, detectedRoutes);
}

function iteratorMap(path: string, _flatTokens: Map<string, RawToken>, detectedRoutes: string[]) {
    if (!_flatTokens.get(path)?.$type && typeof _flatTokens.get(path)?.$value === "string") {
        let routeString: string = _flatTokens.get(path)?.$value as string;
        if (routesManager(routeString, detectedRoutes))
            return iteratorMap(routeString, _flatTokens, detectedRoutes);
        else {
            throw new Error("ERROR: Structure Misfunction");
        }
    } else {
        let routeString: string = routeStringParser(_flatTokens.get(path)?.$value as string);
        return {
            value: _flatTokens.get(path)?.$value,
            path: routeString,
            references: detectedRoutes,
            type: _flatTokens.get(path)?.$type as TokenType,
        };
    }
}

function routesManager(route: string, detectedRoutes: string[]): boolean {
    let _routeParsed = routeStringParser(route);
    if (!detectedRoutes.includes(_routeParsed)) {
        detectedRoutes = [...detectedRoutes, _routeParsed];
        return true;
    } else return false;
}
function routeStringParser(route: string): string {
    return route.replaceAll("{", "").replaceAll("}", "");
}

resolve("component.button.text", flatTokens);
