// src/generate/scss.ts
import type { ResolvedToken } from "@/types";
import { serializeTokenValue } from "./serialize";

export function generateSCSS(tokens: Map<string, ResolvedToken>): string {
    const lines: string[] = [];

    for (const [path, token] of tokens) {
        const varName = path.replaceAll(".", "-");
        const serialized = serializeTokenValue(token);

        if (typeof serialized === "string") {
            lines.push(`$${varName}: ${serialized};`);
        } else {
            for (const [field, value] of Object.entries(serialized)) {
                lines.push(`$${varName}-${field}: ${value};`);
            }
        }
    }

    return lines.join("\n");
}
