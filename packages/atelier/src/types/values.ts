export type ColorValue = {
    colorSpace: string;
    components: number[];
    alpha?: number;
    hex?: string;
};

export type DimensionValue = {
    value: number;
    unit: "px" | "rem";
};

export type DurationValue = {
    value: number;
    unit: "ms" | "s";
};

export type CubicBezierValue = [number, number, number, number];

export type FontWeightValue =
    | "thin"
    | "hairline"
    | "extra-light"
    | "ultra-light"
    | "light"
    | "normal"
    | "regular"
    | "book"
    | "medium"
    | "semi-bold"
    | "demi-bold"
    | "bold"
    | "extra-bold"
    | "ultra-bold"
    | "black"
    | "heavy"
    | "extra-black"
    | "ultra-black"
    | number;

export interface TokenValueMap {
    color: ColorValue;
    dimension: DimensionValue;
    number: number;
    fontWeight: FontWeightValue;
    fontFamily: string | string[];
    duration: DurationValue;
    cubicBezier: CubicBezierValue;
}
