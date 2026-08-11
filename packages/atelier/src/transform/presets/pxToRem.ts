// src/transform/presets/pxToRem.ts
import type { DimensionValue } from "@/types";
import type { Transform } from "../transform";

export const pxToRem: Transform<"dimension"> = {
    name: "pxToRem",
    appliesTo: "dimension",
    apply: (value: DimensionValue): DimensionValue => {
        if (value.unit !== "px") return value;
        return { value: value.value / 16, unit: "rem" };
    },
};
