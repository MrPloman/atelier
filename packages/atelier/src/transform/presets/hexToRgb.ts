// src/transform/presets/hexToRgb.ts
import type { ColorValue } from "@/types";
import type { Transform } from "../transform";

export const hexToRgb: Transform<"color"> = {
    name: "hexToRgb",
    appliesTo: "color",
    apply: (value: ColorValue): ColorValue => {
        if (!value.hex) return value; // no hay hex del que partir, nada que convertir

        const hex = value.hex.replace("#", "");
        const r = parseInt(hex.slice(0, 2), 16) / 255;
        const g = parseInt(hex.slice(2, 4), 16) / 255;
        const b = parseInt(hex.slice(4, 6), 16) / 255;

        if (hex.length === 8) {
            const a = parseInt(hex.slice(6, 8), 16) / 255;
            return { ...value, colorSpace: "srgb", components: [r, g, b], alpha: a };
        }

        return { ...value, colorSpace: "srgb", components: [r, g, b] };
    },
};
