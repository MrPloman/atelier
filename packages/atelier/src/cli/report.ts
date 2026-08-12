// src/cli/report.ts
import { styleText } from "node:util";
import type { Diagnostic } from "../types";

export function reportDiagnostics(errors: Diagnostic[]): void {
    for (const diag of errors) {
        const marker = diag.severity === "error" ? styleText("red", "✗") : styleText("yellow", "⚠");
        console.log(
            `${marker} ${styleText("bold", diag.path)} ${styleText("dim", `[${diag.code}]`)}`,
        );
        if (diag.hint) {
            console.log(`  ${diag.hint.trim()}`);
        }
        console.log();
    }

    const errorCount = errors.filter((e) => e.severity === "error").length;
    const warningCount = errors.filter((e) => e.severity === "warning").length;

    const parts: string[] = [];
    if (errorCount > 0) parts.push(styleText("red", `${errorCount} error(s)`));
    if (warningCount > 0) parts.push(styleText("yellow", `${warningCount} warning(s)`));
    console.log(parts.join(", "));
}
