export type UnsupportedType =
    | "typography"
    | "shadow"
    | "border"
    | "gradient"
    | "transition"
    | "strokeStyle";

export type TokenType =
    | "color"
    | "dimension"
    | "number"
    | "fontWeight"
    | "fontFamily"
    | "duration"
    | "cubicBezier"
    | UnsupportedType;

export const SUPPORTED_TYPES = [
    "color",
    "dimension",
    "number",
    "fontWeight",
    "fontFamily",
    "duration",
    "cubicBezier",
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
