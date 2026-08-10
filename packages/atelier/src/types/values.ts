// COLOR
export type ColorValue = {
    colorSpace: string;
    components: number[];
    alpha?: number;
    hex?: string;
};
// DIMENSION
export type DimensionValue = {
    value: number;
    unit: "px" | "rem";
};

// DURATION
export type DurationValue = {
    value: number;
    unit: "ms" | "s";
};
// CUBICBEIZER
export type CubicBezierValue = [number, number, number, number];

// BORDER
export type BorderStyleValue =
    | "none"
    | "hidden"
    | "dotted"
    | "dashed"
    | "solid"
    | "double"
    | "groove"
    | "ridge"
    | "inset"
    | "outset";

export const BORDER_STYLE_VALUES = [
    "none",
    "hidden",
    "dotted",
    "dashed",
    "solid",
    "double",
    "groove",
    "ridge",
    "inset",
    "outset",
] as const;
export type BorderValue = {
    color: ColorValue;
    width: DimensionValue;
    style: BorderStyleValue;
};

// FONTWEIGHT
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

// TRANSITION
export type TransitionValue = {
    duration: DurationValue;
    delay: DurationValue;
    timingFunction: CubicBezierValue;
};

// LineheightValue
export type LineHeightValue = number;

// Letter Spacing value
export type LetterSpacingValue = string;

// TypographyValue

export type TypographyValue = {
    fontFamily: string | string[];
    fontSize: DimensionValue;
    fontWeight: FontWeightValue;
    letterSpacing: LetterSpacingValue;
    lineHeight: LineHeightValue;
};

// GlobalToken
export interface TokenValueMap {
    color: ColorValue;
    dimension: DimensionValue;
    number: number;
    fontWeight: FontWeightValue;
    fontFamily: string | string[];
    duration: DurationValue;
    cubicBezier: CubicBezierValue;
    border: BorderValue;
    transition: TransitionValue;
    lineHeight: LineHeightValue;
    letterSpacing: LetterSpacingValue;
}
