// src/generate/css.ts
import type { ResolvedToken } from "@/types";
import { serializeTokenValue } from "./serialize";

export function generateCSS(tokens: Map<string, ResolvedToken>): string {
    const lines: string[] = [":root {"];

    for (const [path, token] of tokens) {
        const varName = path.replaceAll(".", "-");
        const serialized = serializeTokenValue(token);

        if (typeof serialized === "string") {
            lines.push(`  --${varName}: ${serialized};`);
        } else {
            for (const [field, value] of Object.entries(serialized)) {
                lines.push(`  --${varName}-${field}: ${value};`);
            }
        }
    }

    lines.push("}");
    return lines.join("\n");
}
