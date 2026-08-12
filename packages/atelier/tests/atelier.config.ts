import { defineConfig } from "@mrploman/atelier";
export default defineConfig({
    input: "./tokens/tokens.json",
    output: "./dist",
    formats: ["css"],
});
