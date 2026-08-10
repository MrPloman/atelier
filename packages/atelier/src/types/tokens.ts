export type SimpleType =
    | "color"
    | "dimension"
    | "number"
    | "fontWeight"
    | "fontFamily"
    | "duration"
    | "cubicBezier";
export type CompoundType =
    | "typography"
    | "shadow"
    | "border"
    | "gradient"
    | "transition"
    | "strokeStyle";

export type TokenType = SimpleType | CompoundType;

export const SIMPLE_TYPES = [
    "color",
    "dimension",
    "number",
    "fontWeight",
    "fontFamily",
    "duration",
    "cubicBezier",
] as const satisfies readonly TokenType[];

export const COMPOUND_TYPES = [
    "typography",
    "shadow",
    "border",
    "gradient",
    "transition",
    "strokeStyle",
] as const satisfies readonly TokenType[];

export type RawToken = {
    $value: unknown;
    $type?: TokenType;
};

export type RawGroup = {
    $type?: TokenType;
    $description?: string;
    [key: string]: RawGroup | RawToken | TokenType | string | undefined;
};
