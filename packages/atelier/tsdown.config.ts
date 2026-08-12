import { defineConfig } from "tsdown";

export default defineConfig([
    {
        entry: ["src/index.ts"],
        format: ["esm", "cjs"],
        dts: true,
        clean: true,
        sourcemap: true,
        alias: {
            "@": new URL("./src", import.meta.url).pathname,
        },
    },
    {
        entry: { cli: "src/cli/index.ts" },
        format: ["esm"],
        dts: false,
        clean: false,
        platform: "node",
        outExtensions: () => ({ js: ".js" }),
        alias: {
            "@": new URL("./src", import.meta.url).pathname,
        },
    },
]);
