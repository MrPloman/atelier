// src/generate/ts.ts
import type { ResolvedToken } from "@/types";
import { serializeTokenValue } from "./serialize";

type TreeNode = { [key: string]: TreeNode | string };

function camelCase(kebab: string): string {
    return kebab.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

// DECISIÓN A: cuando un token expande a varios campos (typography, strokeStyle
// objeto), en TS se anida como objeto real en vez de aplanarse con guiones
// (a diferencia de CSS/SCSS, donde --typography-heading-font-family es plano).
function setDeep(
    tree: TreeNode,
    pathParts: string[],
    value: string | Record<string, string>,
): void {
    const [head, ...rest] = pathParts;
    if (!head) {
        throw new Error("Path parts cannot be empty");
    }

    if (rest.length === 0) {
        if (typeof value === "string") {
            tree[head] = value;
        } else {
            const leaf: TreeNode = (tree[head] as TreeNode) ?? {};
            for (const [field, fieldValue] of Object.entries(value)) {
                leaf[camelCase(field)] = fieldValue;
            }
            tree[head] = leaf;
        }
        return;
    }

    const child: TreeNode = (tree[head] as TreeNode) ?? {};
    tree[head] = child;
    setDeep(child, rest, value);
}

function renderTree(tree: TreeNode, indent = 2): string {
    const pad = " ".repeat(indent);
    return Object.entries(tree)
        .map(([key, value]) =>
            typeof value === "string"
                ? `${pad}${key}: ${JSON.stringify(value)},`
                : `${pad}${key}: {\n${renderTree(value, indent + 2)}\n${pad}},`,
        )
        .join("\n");
}

export function generateTS(tokens: Map<string, ResolvedToken>): string {
    const tree: TreeNode = {};

    for (const [path, token] of tokens) {
        setDeep(tree, path.split("."), serializeTokenValue(token));
    }

    return `export const tokens = {\n${renderTree(tree)}\n} as const;\n`;
}
