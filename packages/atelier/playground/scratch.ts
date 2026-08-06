// packages/atelier/playground/scratch.ts
import { resolve } from "../src/resolve/resolve";
const flatTokens = new Map([
    ["a", { $value: "{b}" }],
    ["b", { $value: "10px" }],
]);

console.log(resolve("a", flatTokens));
