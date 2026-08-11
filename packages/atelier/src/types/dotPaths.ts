type IsToken<T> = T extends { $value: unknown } ? true : false;
export type DotPaths<T> = {
    [K in keyof T & string]: K extends "$type" | "$description"
        ? never // igual que en walkNode, estas dos claves no son paths, son metadata
        : IsToken<T[K]> extends true
          ? K // si es un token, el path es la clave misma
          : T[K] extends object
            ? // si es un objeto, el path es la clave misma, y luego se concatena con los paths de sus hijos
                  K | `${K}.${DotPaths<T[K]>}`
            : never;
}[keyof T & string];
