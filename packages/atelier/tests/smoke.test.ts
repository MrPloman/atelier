import type { RawToken } from "@/types";
import { describe, it } from "vitest";
import { resolveAll } from "../src/resolve/resolve";

describe("smoke test", () => {
    it("sanity check", () => {
        const mapaConCiclo = new Map<string, RawToken>([
            ["b", { $value: "{a}" }],
            ["b", { $value: "{a}" }],
            ["a", { $value: "{b}" }],
        ]);

        console.log(resolveAll(mapaConCiclo, new Set<string>(["a", "b"])));
    });
});
