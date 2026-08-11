// // // // // playground/scratch.ts

// // // // // ============================================================
// // // // // A) DEBEN TENER ÉXITO — sin typos
// // // // // ============================================================

// // // // // A1. Valor directo, sin referencia
// // // // // resolve('a', a1) -> Esperado: { path: 'a', type: undefined, value: '10px', references: [] }
// // // // // (type: undefined porque el fixture no lleva $type — depende de si tu resolve()
// // // // // ya maneja ese caso o todavía está pendiente)

// // // // const a1 = new Map([["a", { $value: "10px", type: "color" }]]);

// // // // // DONE

// // // // // A2. Un solo salto de alias
// // // // // resolve('a', a2) -> Esperado: { path: 'a', type: undefined, value: '10px', references: ['b'] }
// // // // // references debería llevar el rastro de los alias por los que pasó — si tu resolve()
// // // // // todavía no rellena ese array, es algo pendiente, no necesariamente un bug
// // // // const a2 = new Map([
// // // //     ["a", { $value: "{b}" }],
// // // //     ["b", { $value: "10px" }],
// // // // ]);

// // // // // A3. Cadena larga (varios saltos, sin ciclo)
// // // // // resolve('a', a3) -> Esperado: { path: 'a', type: undefined, value: '10px', references: ['b', 'c', 'd'] }
// // // // // comprueba que no te quedas a mitad de camino
// // // // const a3 = new Map([
// // // //     ["a", { $value: "{b}" }],
// // // //     ["b", { $value: "{c}" }],
// // // //     ["c", { $value: "{d}" }],
// // // //     ["d", { $value: "10px" }],
// // // // ]);

// // // // // A4. Dos cadenas independientes desde el mismo Map
// // // // // resolve('a', a4) -> Esperado: { path: 'a', type: undefined, value: '10px', references: ['b'] }
// // // // // resolve('x', a4) -> Esperado: { path: 'x', type: undefined, value: '20px', references: ['y'] }
// // // // // Si el array de "visitados" no se reinicia entre llamadas, esto puede
// // // // // dar falso positivo de ciclo o arrastrar basura de la resolución anterior
// // // // // (ojo: para probar esto de verdad hace falta llamar también con 'x', no solo 'a')
// // // // const a4 = new Map([
// // // //     ["a", { $value: "{b}" }],
// // // //     ["b", { $value: "10px" }],
// // // //     ["x", { $value: "{y}" }],
// // // //     ["y", { $value: "20px" }],
// // // // ]);

// // // // // ============================================================
// // // // // B) DEBEN FALLAR POR CICLO — sin typos, todo bien escrito
// // // // // ============================================================

// // // // // B1. Auto-referencia (el caso más pequeño posible)
// // // // // resolve('a', b1) -> Esperado: lanza/devuelve error, cadena "a → a"
// // // // const b1 = new Map([["a", { $value: "{a}" }]]);

// // // // // B2. Ciclo de dos nodos
// // // // // resolve('a', b2) -> Esperado: lanza/devuelve error, cadena "a → b → a"
// // // // const b2 = new Map([
// // // //     ["a", { $value: "{b}" }],
// // // //     ["b", { $value: "{a}" }],
// // // // ]);

// // // // // B3. Ciclo de tres nodos
// // // // // resolve('a', b3) -> Esperado: lanza/devuelve error, cadena "a → b → c → a"
// // // // const b3 = new Map([
// // // //     ["a", { $value: "{b}" }],
// // // //     ["b", { $value: "{c}" }],
// // // //     ["c", { $value: "{a}" }],
// // // // ]);

// // // // // B4. Ciclo que empieza en un nodo intermedio
// // // // // resolve('a', b4) -> Esperado: lanza/devuelve error, cadena algo como "a → b → c → b"
// // // // // (el ciclo real es b→c→b; a queda "fuera" del ciclo pero lo desencadena)
// // // // const b4 = new Map([
// // // //     ["a", { $value: "{b}" }],
// // // //     ["b", { $value: "{c}" }],
// // // //     ["c", { $value: "{b}" }], // vuelve a b, no a a
// // // // ]);

// // // // // ============================================================
// // // // // C) DEBEN FALLAR POR REFERENCIA ROTA — con typo/dato inexistente
// // // // // ============================================================

// // // // // C1. Apunta a un token que no existe
// // // // // resolve('a', c1) -> Esperado: error de "referencia no encontrada", NO de ciclo
// // // // // b no está en el Map — simula un typo real: {b} en vez de {c}
// // // // const c1 = new Map([["a", { $value: "{b}" }]]);

// // // // // C2. Typo dentro de una cadena larga (rotura a mitad de camino)
// // // // // resolve('a', c2) -> Esperado: error de referencia no encontrada en 'cc', aunque 'c' sí existe
// // // // const c2 = new Map([
// // // //     ["a", { $value: "{b}" }],
// // // //     ["b", { $value: "{cc}" }], // typo: debería ser {c}
// // // //     ["c", { $value: "10px" }],
// // // // ]);

// // // // // C3. El propio token de entrada no existe
// // // // // resolve('a', c3) -> Esperado: error — ni siquiera hay que entrar en la lógica de alias
// // // // // 'a' no está en el Map (solo 'b'), así que la búsqueda inicial ya falla
// // // // const c3 = new Map([["b", { $value: "10px" }]]);

// // // // // console.log("=== TESTS DE RESOLVER ===");
// // // // // console.log("A1:", resolve("a", a1));
// // // // // console.log("A2:", resolve("a", a2));
// // // // // console.log("A3:", resolve("a", a3));
// // // // // console.log("A4 (desde 'a'):", resolve("a", a4));
// // // // // console.log("A4 (desde 'x'):", resolve("x", a4));

// // // // // try {
// // // // //     console.log("B1:", resolve("a", b1));
// // // // // } catch (e: any) {
// // // // //     console.error("B1 ERROR:", e.message);
// // // // // }

// // // // // try {
// // // // //     console.log("B2:", resolve("a", b2));
// // // // // } catch (e: any) {
// // // // //     console.error("B2 ERROR:", e.message);
// // // // // }

// // // // // try {
// // // // //     console.log("B3:", resolve("a", b3));
// // // // // } catch (e: any) {
// // // // //     console.error("B3 ERROR:", e.message);
// // // // // }

// // // // // try {
// // // // //     console.log("B4:", resolve("a", b4));
// // // // // } catch (e: any) {
// // // // //     console.error("B4 ERROR:", e?.message);
// // // // // }

// // // // // try {
// // // // //     console.log("C1:", resolve("a", c1));
// // // // // } catch (e: any) {
// // // // //     console.error("C1 ERROR:", e.message);
// // // // // }
// // // // // try {
// // // // //     console.log("C2:", resolve("a", c2));
// // // // // } catch (e: any) {
// // // // //     console.error("C2 ERROR:", e.message);
// // // // // }

// // // // // try {
// // // // //     console.log("C3:", resolve("a", c3));
// // // // // } catch (e: any) {
// // // // //     console.error("C3 ERROR:", e.message);
// // // // // }
// // // // // const mixedFlatTokens = new Map([
// // // // //     // Sano — debería acabar en `resolved`
// // // // //     ["color.brand", { $value: "#ff0000" }],

// // // // //     // Ciclo — debería acabar en `errors`, code: 'cycle'
// // // // //     ["spacing.broken", { $value: "{spacing.loop}" }],
// // // // //     ["spacing.loop", { $value: "{spacing.broken}" }],

// // // // //     // Referencia rota — debería acabar en `errors`, code: 'broken-reference'
// // // // //     ["font.missing", { $value: "{font.doesNotExist}" }],
// // // // // ]);

// // // // // console.log(resolveAll(mixedFlatTokens));
// // // // // const testDoc = {
// // // // //     spacing: {
// // // // //         $type: "dimension",
// // // // //         small: { $value: "4px" },
// // // // //         special: { $type: "number", $value: 2 },
// // // // //     },
// // // // //     misterioso: { $value: "4px" },
// // // // // };

// // // // // console.log(walk(testDoc));

// // // // // playground/scratch.ts

// // // // // ============================================================
// // // // // D) parseTokens — casos de integración end-to-end
// // // // // ============================================================

// // // // // D1. JSON malformado — debe LANZAR (throw), no devolver Diagnostic
// // // // // El string ni siquiera es JSON válido (coma colgando)
// // // // // Esperado: catch con code 'invalid-json' — ojo, espera: esto SÍ es Diagnostic,
// // // // // no throw — confirmar cuál de los dos según lo que implementaste
// // // // const d1_rawJson = `{ "a": { "$value": "10px", } }`;

// // // // // D2. JSON válido pero con estructura de nodo irreconocible — debe LANZAR (throw)
// // // // // El valor de "a" es un número suelto, ni RawGroup ni RawToken
// // // // const d2_rawJson = JSON.stringify({
// // // //     a: 42,
// // // // });

// // // // // D3. Documento completamente sano — sin errores
// // // // // Esperado: resolved con 1 entrada, errors: []
// // // // const d3_rawJson = JSON.stringify({
// // // //     color: {
// // // //         $type: "color",
// // // //         brand: { $value: "#ff0000" },
// // // //     },
// // // // });

// // // // // D4. Documento válido en estructura, con ciclo dentro — debe ir a Diagnostic, NO throw
// // // // // Esperado: resolved vacío para esos dos, errors con code 'cycle' x2
// // // // const d4_rawJson = JSON.stringify({
// // // //     spacing: {
// // // //         broken: { $value: "{spacing.loop}" },
// // // //         loop: { $value: "{spacing.broken}" },
// // // //     },
// // // // });

// // // // // D5. Documento válido en estructura, con referencia rota dentro
// // // // // Esperado: errors con code 'broken-reference'
// // // // const d5_rawJson = JSON.stringify({
// // // //     font: {
// // // //         missing: { $value: "{font.doesNotExist}" },
// // // //     },
// // // // });

// // // // // D6. El caso completo — mezcla de sano + ciclo + referencia rota + herencia de tipo
// // // // // Esperado: resolved con 'color.brand' (type: 'color', heredado) y con el que
// // // // // gane el ciclo tal como vimos en resolveAll (uno de los dos puede colarse
// // // // // según el orden de iteración) — errors con 'cycle' y 'broken-reference'
// // // // const d6_rawJson = JSON.stringify({
// // // //     color: {
// // // //         $type: "color",
// // // //         brand: { $value: "#ff0000" },
// // // //     },
// // // //     spacing: {
// // // //         broken: { $value: "{spacing.loop}" },
// // // //         loop: { $value: "{spacing.broken}" },
// // // //     },
// // // //     font: {
// // // //         missing: { $value: "{font.doesNotExist}" },
// // // //     },
// // // // });

// // // // // D7. String vacío como input — caso límite, ¿qué hace JSON.parse('')?
// // // // // Esperado: probablemente cae en la rama de invalid-json / throw, dependiendo
// // // // // de tu implementación — buen caso límite para confirmar
// // // // const d7_rawJson = "";
// // // // // console.log(parseTokens(d1_rawJson));
// // // // // console.log(parseTokens(d2_rawJson));
// // // // // console.log(parseTokens(d3_rawJson));
// // // // // console.log(parseTokens(d4_rawJson));
// // // // // console.log(parseTokens(d5_rawJson));
// // // // // console.log(parseTokens(d6_rawJson));
// // // // // console.log(parseTokens(d7_rawJson));
// // // // // playground/scratch.ts
// // // // import { validateColorValue } from "../src/check/shape/color"; // ajusta el path real

// // // // // ============================================================
// // // // // E) validateColorValue — casos de prueba
// // // // // ============================================================

// // // // // E1. ColorValue completamente válido, con todos los campos
// // // // // Esperado: { ok: true, value: {...} }
// // // // const e1 = validateColorValue(
// // // //     { colorSpace: "srgb", components: [1, 0, 0], alpha: 1, hex: "#ff0000" },
// // // //     "color.brand",
// // // // );

// // // // // E2. ColorValue válido, solo con los campos obligatorios (sin alpha/hex)
// // // // // Esperado: { ok: true, value: {...} } — alpha y hex son opcionales
// // // // const e2 = validateColorValue({ colorSpace: "srgb", components: [1, 0, 0] }, "color.brand");

// // // // // E3. No es un objeto en absoluto — value llega como string
// // // // // Esperado: { ok: false, error: { ..., hint: 'Expected an object for color value, got string' } }
// // // // const e3 = validateColorValue("#ff0000", "color.brand");

// // // // // E4. Es un objeto pero le falta colorSpace
// // // // // Esperado: { ok: false, error: { ..., hint: contiene 'colorSpace' } }
// // // // const e4 = validateColorValue({ components: [1, 0, 0] }, "color.brand");

// // // // // E5. colorSpace tiene el tipo equivocado (number en vez de string)
// // // // // Esperado: { ok: false, error: { ..., hint: contiene 'colorSpace' } }
// // // // const e5 = validateColorValue({ colorSpace: 123, components: [1, 0, 0] }, "color.brand");

// // // // // E6. components no es un array
// // // // // Esperado: { ok: false, error: { ..., hint: contiene 'components' } }
// // // // const e6 = validateColorValue({ colorSpace: "srgb", components: "not-an-array" }, "color.brand");

// // // // // E7. components es un array, pero con algo que no es number dentro
// // // // // Esperado: { ok: false, error: { ..., hint: contiene 'components' } }
// // // // const e7 = validateColorValue({ colorSpace: "srgb", components: [1, "oops", 0] }, "color.brand");

// // // // // E8. alpha presente pero con tipo incorrecto (string en vez de number)
// // // // // Esperado: { ok: false, error: { ..., hint: contiene 'alpha' } }
// // // // const e8 = validateColorValue(
// // // //     { colorSpace: "srgb", components: [1, 0, 0], alpha: "oops" },
// // // //     "color.brand",
// // // // );

// // // // // E9. hex presente pero con tipo incorrecto (number en vez de string)
// // // // // Esperado: { ok: false, error: { ..., hint: contiene 'hex' } }
// // // // const e9 = validateColorValue(
// // // //     { colorSpace: "srgb", components: [1, 0, 0], hex: 16711680 },
// // // //     "color.brand",
// // // // );

// // // // // E10. null como value — caso límite típico que rompe checks de typeof mal hechos
// // // // // Esperado: { ok: false, error: { ..., hint: 'Expected an object for color value, got object' } }
// // // // // OJO: typeof null === 'object' en JS — este caso confirma que el check
// // // // // `value === null` está haciendo su trabajo y no deja pasar null como si fuera válido
// // // // const e10 = validateColorValue(null, "color.brand");

// // // // console.log("E1 (válido completo):", e1);
// // // // console.log("E2 (válido mínimo):", e2);
// // // // console.log("E3 (no es objeto):", e3);
// // // // console.log("E4 (falta colorSpace):", e4);
// // // // console.log("E5 (colorSpace mal tipado):", e5);
// // // // console.log("E6 (components no es array):", e6);
// // // // console.log("E7 (components con elemento no-number):", e7);
// // // // console.log("E8 (alpha mal tipado):", e8);
// // // // console.log("E9 (hex mal tipado):", e9);
// // // // console.log("E10 (null):", e10);
// // // // playground/scratch.ts
// // // import { validateFontWeightValue } from "../src/check/shape/fontWeight"; // ajusta el path real

// // // // ============================================================
// // // // F) validateFontWeightValue — casos de prueba
// // // // ============================================================

// // // // F1. Number válido
// // // // Esperado: { ok: true, value: 400 }
// // // const f1 = validateFontWeightValue(400, "font.weight.regular");

// // // // F2. Keyword string válida
// // // // Esperado: { ok: true, value: 'bold' }
// // // const f2 = validateFontWeightValue("bold", "font.weight.bold");

// // // // F3. String que no es ninguna keyword permitida
// // // // Esperado: { ok: false, error: { ..., hint: contiene 'banana' } }
// // // const f3 = validateFontWeightValue("banana", "font.weight.invalid");

// // // // F4. null — el caso que reventaba la versión anterior
// // // // Esperado: { ok: false, error: {...} }
// // // const f4 = validateFontWeightValue(null, "font.weight.null");

// // // // F5. NaN — number técnicamente, pero no un peso válido
// // // // Esperado: { ok: false, error: { ..., hint: contiene 'NaN' } }
// // // const f5 = validateFontWeightValue(NaN, "font.weight.nan");

// // // // F6. Objeto arbitrario — el caso que reventaba la versión anterior (segunda vez)
// // // // Esperado: { ok: false, error: {...} }
// // // const f6 = validateFontWeightValue({ foo: "bar" }, "font.weight.object");

// // // // F7. undefined
// // // // Esperado: { ok: false, error: {...} }
// // // const f7 = validateFontWeightValue(undefined, "font.weight.undefined");

// // // // F8. array — otro tipo "raro" que la versión monolítica no contemplaba explícitamente
// // // // Esperado: { ok: false, error: {...} }
// // // const f8 = validateFontWeightValue([400, 500], "font.weight.array");

// // // // F9. boolean — otro tipo no contemplado explícitamente antes
// // // // Esperado: { ok: false, error: {...} }
// // // const f9 = validateFontWeightValue(true, "font.weight.boolean");

// // // // F10. Un número negativo — válido como number, aunque semánticamente raro
// // // // (fontWeight no valida rango, solo forma — esto confirma que no te pasaste
// // // // de listo añadiendo reglas de negocio que no se pidieron)
// // // // Esperado: { ok: true, value: -100 }
// // // const f10 = validateFontWeightValue(-100, "font.weight.negative");

// // // console.log("F1 (number válido):", f1);
// // // console.log("F2 (keyword válida):", f2);
// // // console.log("F3 (string inválida):", f3);
// // // console.log("F4 (null):", f4);
// // // console.log("F5 (NaN):", f5);
// // // console.log("F6 (objeto):", f6);
// // // console.log("F7 (undefined):", f7);
// // // console.log("F8 (array):", f8);
// // // console.log("F9 (boolean):", f9);
// // // console.log("F10 (número negativo):", f10);
// // // const testDoc = JSON.stringify({
// // //     color: {
// // //         $type: "color",
// // //         brand: { $value: { colorSpace: "srgb", components: [1, 0, 0] } }, // válido
// // //     },
// // //     spacing: {
// // //         $type: "dimension",
// // //         broken: { $value: { value: "not-a-number", unit: "px" } }, // forma rota
// // //     },
// // //     effect: {
// // //         shadow: { $type: "shadow", $value: {} }, // tipo conocido pero no soportado
// // //     },
// // //     misterioso: { $value: "4px" }, // huérfano, sin $type en ningún nivel
// // // });

// // // const { resolved, errors: resolveErrors } = parseTokens(testDoc);

// // // console.log("=== Errores de resolución (ciclos/referencias rotas) ===");
// // // console.log(resolveErrors);

// // // console.log("=== Validación de forma, token a token ===");
// // // for (const [path, token] of resolved) {
// // //     const shapeResult = checkTokenShape(token);
// // //     console.log(path, "→", shapeResult);
// // // }
// // // playground/scratch.ts (añade esto a lo que ya tengas)
// // // playground/scratch.ts

// // // ============================================================
// // // G) resolveCompoundValue — casos de prueba
// // // ============================================================

// // // G1. Caso sano — un typography con campos alias a tokens simples + campos literales
// // // const g1_flatTokens = new Map<string, RawToken>([
// // //     ["font.family.sans", { $type: "fontFamily", $value: "Inter" }],
// // //     ["font.size.lg", { $type: "dimension", $value: { value: 18, unit: "px" } }],
// // //     ["font.weight.bold", { $type: "fontWeight", $value: 700 }],
// // //     [
// // //         "typography.heading",
// // //         {
// // //             $type: "typography",
// // //             $value: {
// // //                 fontFamily: "{font.family.sans}",
// // //                 fontSize: "{font.size.lg}",
// // //                 fontWeight: "{font.weight.bold}",
// // //                 letterSpacing: "0.02em",
// // //                 lineHeight: 1.4,
// // //             },
// // //         },
// // //     ],
// // // ]);
// // // const g1_compoundValue = (g1_flatTokens.get("typography.heading") as RawToken).$value as Record<
// // //     string,
// // //     unknown
// // // >;

// // // console.log("=== G1 (caso sano, typography) ===");
// // // try {
// // //     console.log(resolveCompoundValue("typography.heading", g1_compoundValue, g1_flatTokens));
// // // } catch (error) {
// // //     console.log("ERROR INESPERADO:", error);
// // // }

// // // // G2. Ciclo directo — dos shadows que se referencian mutuamente por el campo 'color'
// // // const g2_flatTokens = new Map<string, RawToken>([
// // //     ["card", { $type: "shadow", $value: { color: "{modal}", offsetX: "2px" } }],
// // //     ["modal", { $type: "shadow", $value: { color: "{card}", offsetX: "4px" } }],
// // // ]);
// // // const g2_compoundValue = (g2_flatTokens.get("card") as RawToken).$value as Record<string, unknown>;

// // // console.log("=== G2 (ciclo directo card/modal) ===");
// // // try {
// // //     console.log(resolveCompoundValue("card", g2_compoundValue, g2_flatTokens));
// // // } catch (error) {
// // //     console.log("ERROR (esperado):", error);
// // // }

// // // // G3. Referencia rota dentro de un campo de compuesto
// // // const g3_flatTokens = new Map<string, RawToken>([
// // //     [
// // //         "shadow.broken",
// // //         { $type: "shadow", $value: { color: "{shadow.doesNotExist}", offsetX: "2px" } },
// // //     ],
// // // ]);
// // // const g3_compoundValue = (g3_flatTokens.get("shadow.broken") as RawToken).$value as Record<
// // //     string,
// // //     unknown
// // // >;

// // // console.log("=== G3 (referencia rota) ===");
// // // try {
// // //     console.log(resolveCompoundValue("shadow.broken", g3_compoundValue, g3_flatTokens));
// // // } catch (error) {
// // //     console.log("ERROR (esperado):", error);
// // // }

// // // // G4. Compuesto apuntando a otro compuesto (sin ciclo) — opción A: se resuelve igual,
// // // // sin juzgar semántica. El campo 'color' de 'card' terminará conteniendo el objeto
// // // // completo resuelto de 'accent', no un ColorValue.
// // // const g4_flatTokens = new Map<string, RawToken>([
// // //     ["accent", { $type: "shadow", $value: { offsetX: "1px", offsetY: "1px" } }],
// // //     ["card", { $type: "shadow", $value: { color: "{accent}", offsetX: "2px" } }],
// // // ]);
// // // const g4_compoundValue = (g4_flatTokens.get("card") as RawToken).$value as Record<string, unknown>;

// // // console.log("=== G4 (compuesto apuntando a otro compuesto, sin ciclo) ===");
// // // try {
// // //     console.log(resolveCompoundValue("card", g4_compoundValue, g4_flatTokens));
// // // } catch (error) {
// // //     console.log("ERROR INESPERADO:", error);
// // // }
// // // playground/scratch.ts
// // // import { validateShadowValue } from "../src/check/shape/shadow"; // ajusta el path real

// // // // ============================================================
// // // // H) validateShadowValue — casos de prueba
// // // // ============================================================

// // // const validColor = { colorSpace: "srgb", components: [0, 0, 0], alpha: 0.15 };
// // // const validDimension = { value: 4, unit: "px" };

// // // // H1. Shadow único válido, sin inset (debe rellenarse con false por defecto)
// // // // Esperado: { ok: true, value: { color, offsetX, offsetY, blur, spread, inset: false } }
// // // const h1 = validateShadowValue(
// // //     {
// // //         color: validColor,
// // //         offsetX: { value: 0, unit: "px" },
// // //         offsetY: validDimension,
// // //         blur: { value: 8, unit: "px" },
// // //         spread: { value: 0, unit: "px" },
// // //     },
// // //     "shadow.card",
// // // );

// // // // H2. Shadow único válido, con inset explícito true
// // // // Esperado: { ok: true, value: { ..., inset: true } }
// // // const h2 = validateShadowValue(
// // //     {
// // //         color: validColor,
// // //         offsetX: { value: 0, unit: "px" },
// // //         offsetY: validDimension,
// // //         blur: { value: 8, unit: "px" },
// // //         spread: { value: 0, unit: "px" },
// // //         inset: true,
// // //     },
// // //     "shadow.inner",
// // // );

// // // // H3. Array de dos shadows, ambos válidos
// // // // Esperado: { ok: true, value: [ {...}, {...} ] }, un array de 2
// // // const h3 = validateShadowValue(
// // //     [
// // //         {
// // //             color: validColor,
// // //             offsetX: { value: 0, unit: "px" },
// // //             offsetY: { value: 1, unit: "px" },
// // //             blur: { value: 2, unit: "px" },
// // //             spread: { value: 0, unit: "px" },
// // //         },
// // //         {
// // //             color: validColor,
// // //             offsetX: { value: 0, unit: "px" },
// // //             offsetY: { value: 4, unit: "px" },
// // //             blur: { value: 12, unit: "px" },
// // //             spread: { value: -2, unit: "px" },
// // //         },
// // //     ],
// // //     "shadow.card",
// // // );

// // // // H4. Array donde el SEGUNDO elemento tiene offsetX con forma rota
// // // // Esperado: { ok: false, error: { path: 'shadow.card[1].offsetX', ... } }
// // // // — confirma que el índice se refleja en el path, y que el primer elemento
// // // // (válido) no impide que se detecte el fallo en el segundo (fail-fast)
// // // const h4 = validateShadowValue(
// // //     [
// // //         {
// // //             color: validColor,
// // //             offsetX: { value: 0, unit: "px" },
// // //             offsetY: { value: 1, unit: "px" },
// // //             blur: { value: 2, unit: "px" },
// // //             spread: { value: 0, unit: "px" },
// // //         },
// // //         {
// // //             color: validColor,
// // //             offsetX: { value: "not-a-number", unit: "px" }, // roto
// // //             offsetY: { value: 4, unit: "px" },
// // //             blur: { value: 12, unit: "px" },
// // //             spread: { value: -2, unit: "px" },
// // //         },
// // //     ],
// // //     "shadow.card",
// // // );

// // // // H5. Array vacío — debe rechazarse
// // // // Esperado: { ok: false, error: { hint: contiene 'empty array' } }
// // // const h5 = validateShadowValue([], "shadow.empty");

// // // // H6. Shadow único sin el campo 'spread' (obligatorio según la spec DTCG)
// // // // Esperado: { ok: false, error: { path: 'shadow.card.spread', ... } }
// // // const h6 = validateShadowValue(
// // //     {
// // //         color: validColor,
// // //         offsetX: { value: 0, unit: "px" },
// // //         offsetY: validDimension,
// // //         blur: { value: 8, unit: "px" },
// // //         // spread omitido a propósito
// // //     },
// // //     "shadow.card",
// // // );

// // // console.log("H1 (shadow único, sin inset):", h1);
// // // console.log("H2 (shadow único, inset true):", h2);
// // // console.log("H3 (array de 2, válidos):", h3);
// // // console.log("H4 (array, segundo roto):", h4);
// // // console.log("H5 (array vacío):", h5);
// // // console.log("H6 (falta spread, obligatorio):", h6);
// // // import { walk } from "../../atelier/src/walk/walk";
// // // const testDoc = {
// // //     spacing: {
// // //         $type: "dimension",
// // //         small: { $value: "4px" },
// // //         special: { $type: "number", $value: 2 },
// // //     },
// // //     shadow: {
// // //         card: {
// // //             $type: "shadow",
// // //             $value: {
// // //                 color: "{color.x}",
// // //                 offsetX: "2px",
// // //                 offsetY: "2px",
// // //                 blur: "4px",
// // //                 spread: "0px",
// // //             },
// // //         },
// // //     },
// // //     misterioso: { $value: "4px" },
// // // };

// // // const result = walk(testDoc);
// // // console.log("flatTokens:", result.flatTokens);
// // // console.log("compoundPaths:", result.compoundPaths);

// // // playground/scratch.ts
// // import { resolveCompoundValue } from "../src/resolve/resolve"; // ajusta el path real
// // import { RawToken } from "../src/types"; // ajusta el path real
// // // ============================================================
// // // G) resolveCompoundValue — casos de prueba (retorno { value, references })
// // // ============================================================

// // // G1. Caso sano — typography con campos alias a tokens simples + campos literales
// // const g1_flatTokens = new Map<string, RawToken>([
// //     ["font.family.sans", { $type: "fontFamily", $value: "Inter" }],
// //     ["font.size.lg", { $type: "dimension", $value: { value: 18, unit: "px" } }],
// //     ["font.weight.bold", { $type: "fontWeight", $value: 700 }],
// //     [
// //         "typography.heading",
// //         {
// //             $type: "typography",
// //             $value: {
// //                 fontFamily: "{font.family.sans}",
// //                 fontSize: "{font.size.lg}",
// //                 fontWeight: "{font.weight.bold}",
// //                 letterSpacing: "0.02em",
// //                 lineHeight: 1.4,
// //             },
// //         },
// //     ],
// // ]);
// // const g1_compoundValue = (g1_flatTokens.get("typography.heading") as RawToken).$value as Record<
// //     string,
// //     unknown
// // >;

// // console.log("=== G1 (caso sano, typography) ===");
// // try {
// //     const result = resolveCompoundValue("typography.heading", g1_compoundValue, g1_flatTokens);
// //     console.log("value:", result.value);
// //     console.log("references:", result.references);
// //     // Esperado: references debe incluir los 3 paths de alias directos
// //     // ('font.family.sans', 'font.size.lg', 'font.weight.bold'), NO letterSpacing/lineHeight (son literales)
// // } catch (error) {
// //     console.log("ERROR INESPERADO:", error);
// // }

// // // G2. Ciclo directo — dos shadows que se referencian mutuamente por el campo 'color'
// // // ESTE ES EL CASO CRÍTICO: debe lanzar RÁPIDO, no colgarse.
// // const g2_flatTokens = new Map<string, RawToken>([
// //     ["card", { $type: "shadow", $value: { color: "{modal}", offsetX: "2px" } }],
// //     ["modal", { $type: "shadow", $value: { color: "{card}", offsetX: "4px" } }],
// // ]);
// // const g2_compoundValue = (g2_flatTokens.get("card") as RawToken).$value as Record<string, unknown>;

// // console.log("=== G2 (ciclo directo card/modal) — debe fallar RÁPIDO, no colgarse ===");
// // const g2_start = Date.now();
// // try {
// //     console.log(resolveCompoundValue("card", g2_compoundValue, g2_flatTokens));
// // } catch (error) {
// //     console.log("ERROR (esperado):", error);
// // } finally {
// //     console.log(
// //         `G2 tardó ${Date.now() - g2_start}ms — si tarda segundos o se cuelga, el bug NO está arreglado`,
// //     );
// // }

// // // G3. Referencia rota dentro de un campo de compuesto
// // const g3_flatTokens = new Map<string, RawToken>([
// //     [
// //         "shadow.broken",
// //         { $type: "shadow", $value: { color: "{shadow.doesNotExist}", offsetX: "2px" } },
// //     ],
// // ]);
// // const g3_compoundValue = (g3_flatTokens.get("shadow.broken") as RawToken).$value as Record<
// //     string,
// //     unknown
// // >;

// // console.log("=== G3 (referencia rota) ===");
// // try {
// //     console.log(resolveCompoundValue("shadow.broken", g3_compoundValue, g3_flatTokens));
// // } catch (error) {
// //     console.log("ERROR (esperado):", error);
// // }

// // // G4. Compuesto apuntando a otro compuesto (sin ciclo) — opción A
// // const g4_flatTokens = new Map<string, RawToken>([
// //     ["accent", { $type: "shadow", $value: { offsetX: "1px", offsetY: "1px" } }],
// //     ["card", { $type: "shadow", $value: { color: "{accent}", offsetX: "2px" } }],
// // ]);
// // const g4_compoundValue = (g4_flatTokens.get("card") as RawToken).$value as Record<string, unknown>;

// // console.log("=== G4 (compuesto apuntando a otro compuesto, sin ciclo) ===");
// // try {
// //     const result = resolveCompoundValue("card", g4_compoundValue, g4_flatTokens);
// //     console.log("value:", result.value);
// //     console.log("references:", result.references);
// //     // Esperado: references debe incluir 'accent' (el salto directo)
// // } catch (error) {
// //     console.log("ERROR INESPERADO:", error);
// // }

// // // G5. NUEVO — referencia transitiva a través de un campo simple
// // // typography.body.fontFamily -> font.family.alias -> font.family.sans
// // // Esperado: references debe incluir AMBOS paths intermedios, no solo el primero
// // const g5_flatTokens = new Map<string, RawToken>([
// //     ["font.family.sans", { $type: "fontFamily", $value: "Inter" }],
// //     ["font.family.alias", { $type: "fontFamily", $value: "{font.family.sans}" }],
// //     ["typography.body", { $type: "typography", $value: { fontFamily: "{font.family.alias}" } }],
// // ]);
// // const g5_compoundValue = (g5_flatTokens.get("typography.body") as RawToken).$value as Record<
// //     string,
// //     unknown
// // >;

// // console.log("=== G5 (referencia transitiva a través de un campo simple) ===");
// // try {
// //     const result = resolveCompoundValue("typography.body", g5_compoundValue, g5_flatTokens);
// //     console.log("value:", result.value);
// //     console.log("references:", result.references);
// //     // Esperado: references = ['font.family.alias', 'font.family.sans'] — AMBOS, no solo el directo
// // } catch (error) {
// //     console.log("ERROR INESPERADO:", error);
// // }
// // playground/scratch.ts
// import { parseTokens } from "../src/parse/parse"; // ajusta el path real

// // ============================================================
// // I) parseTokens — pipeline completo con simples + compuestos mezclados
// // ============================================================

// const testDoc = JSON.stringify({
//     color: {
//         brand: { $type: "color", $value: { colorSpace: "srgb", components: [1, 0, 0] } },
//     },
//     spacing: {
//         sm: { $type: "dimension", $value: { value: 4, unit: "px" } },
//     },
//     shadow: {
//         card: {
//             $type: "shadow",
//             $value: {
//                 color: "{color.brand}",
//                 offsetX: "{spacing.sm}",
//                 offsetY: { value: 2, unit: "px" },
//                 blur: { value: 4, unit: "px" },
//                 spread: { value: 0, unit: "px" },
//             },
//         },
//     },
//     // Un segundo compuesto con ciclo, para confirmar que NO tumba a los demás
//     transition: {
//         broken: { $type: "transition", $value: { duration: "{transition.other}" } },
//         other: { $type: "transition", $value: { duration: "{transition.broken}" } },
//     },
// });

// const { resolved, errors } = parseTokens(testDoc);

// console.log("=== resolved (esperado: color.brand, spacing.sm, shadow.card → 3 entradas) ===");
// for (const [path, token] of resolved) {
//     console.log(path, "→", token);
// }

// console.log(
//     "=== errors (esperado: 2 entradas, ambas del ciclo transition, code: compound-cycle) ===",
// );
// console.log(errors);

// console.log(`Total resolved: ${resolved.size} (esperado: 3)`);
// console.log(`Total errors: ${errors.length} (esperado: 2)`);
import { DotPaths } from "../src/types/dotPaths"; // ajusta el path real
const testTokens = {
    color: {
        brand: {
            blue: { $value: "#2563eb", $type: "color" },
        },
    },
} as const;

type Test = DotPaths<typeof testTokens>;
// pásale el cursor por encima en tu editor, o haz:
const check: Test = "color.brand.blue"; // ¿compila?
console.log(check);
