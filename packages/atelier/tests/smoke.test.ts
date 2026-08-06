import { resolve } from "@/resolve/resolve";
import type { RawToken } from "@/types";
import { describe, it } from "vitest";

describe("smoke test", () => {
    it("sanity check", () => {
        const mapaConCiclo = new Map<string, RawToken>([
            ["b", { $value: "{a}" }],
            ["b", { $value: "{a}" }],
            ["a", { $value: "{b}" }],
        ]);

        console.log(resolve("b", mapaConCiclo));
    });
});
