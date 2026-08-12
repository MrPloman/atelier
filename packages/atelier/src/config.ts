import type { Transform } from "./transform/transform";

// packages/atelier/src/config.ts
export interface AtelierConfig {
    input: string;
    output: string;
    formats: ("css" | "scss" | "ts")[];
    transforms?: Transform[];
}

export function defineConfig(config: AtelierConfig): AtelierConfig {
    return config;
}
