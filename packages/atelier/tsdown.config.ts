import { defineConfig } from "tsdown";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    clean: true,
    sourcemap: true,
    alias: {
        "@": new URL("./src", import.meta.url).pathname,
    },
});
