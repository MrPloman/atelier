// playground/scratch.ts

import { walk } from "../src/walk/walk";

// ============================================================
// A) DEBEN TENER ÉXITO — sin typos
// ============================================================

// A1. Valor directo, sin referencia
// resolve('a', a1) -> Esperado: { path: 'a', type: undefined, value: '10px', references: [] }
// (type: undefined porque el fixture no lleva $type — depende de si tu resolve()
// ya maneja ese caso o todavía está pendiente)

const a1 = new Map([["a", { $value: "10px", type: "color" }]]);

// DONE

// A2. Un solo salto de alias
// resolve('a', a2) -> Esperado: { path: 'a', type: undefined, value: '10px', references: ['b'] }
// references debería llevar el rastro de los alias por los que pasó — si tu resolve()
// todavía no rellena ese array, es algo pendiente, no necesariamente un bug
const a2 = new Map([
    ["a", { $value: "{b}" }],
    ["b", { $value: "10px" }],
]);

// A3. Cadena larga (varios saltos, sin ciclo)
// resolve('a', a3) -> Esperado: { path: 'a', type: undefined, value: '10px', references: ['b', 'c', 'd'] }
// comprueba que no te quedas a mitad de camino
const a3 = new Map([
    ["a", { $value: "{b}" }],
    ["b", { $value: "{c}" }],
    ["c", { $value: "{d}" }],
    ["d", { $value: "10px" }],
]);

// A4. Dos cadenas independientes desde el mismo Map
// resolve('a', a4) -> Esperado: { path: 'a', type: undefined, value: '10px', references: ['b'] }
// resolve('x', a4) -> Esperado: { path: 'x', type: undefined, value: '20px', references: ['y'] }
// Si el array de "visitados" no se reinicia entre llamadas, esto puede
// dar falso positivo de ciclo o arrastrar basura de la resolución anterior
// (ojo: para probar esto de verdad hace falta llamar también con 'x', no solo 'a')
const a4 = new Map([
    ["a", { $value: "{b}" }],
    ["b", { $value: "10px" }],
    ["x", { $value: "{y}" }],
    ["y", { $value: "20px" }],
]);

// ============================================================
// B) DEBEN FALLAR POR CICLO — sin typos, todo bien escrito
// ============================================================

// B1. Auto-referencia (el caso más pequeño posible)
// resolve('a', b1) -> Esperado: lanza/devuelve error, cadena "a → a"
const b1 = new Map([["a", { $value: "{a}" }]]);

// B2. Ciclo de dos nodos
// resolve('a', b2) -> Esperado: lanza/devuelve error, cadena "a → b → a"
const b2 = new Map([
    ["a", { $value: "{b}" }],
    ["b", { $value: "{a}" }],
]);

// B3. Ciclo de tres nodos
// resolve('a', b3) -> Esperado: lanza/devuelve error, cadena "a → b → c → a"
const b3 = new Map([
    ["a", { $value: "{b}" }],
    ["b", { $value: "{c}" }],
    ["c", { $value: "{a}" }],
]);

// B4. Ciclo que empieza en un nodo intermedio
// resolve('a', b4) -> Esperado: lanza/devuelve error, cadena algo como "a → b → c → b"
// (el ciclo real es b→c→b; a queda "fuera" del ciclo pero lo desencadena)
const b4 = new Map([
    ["a", { $value: "{b}" }],
    ["b", { $value: "{c}" }],
    ["c", { $value: "{b}" }], // vuelve a b, no a a
]);

// ============================================================
// C) DEBEN FALLAR POR REFERENCIA ROTA — con typo/dato inexistente
// ============================================================

// C1. Apunta a un token que no existe
// resolve('a', c1) -> Esperado: error de "referencia no encontrada", NO de ciclo
// b no está en el Map — simula un typo real: {b} en vez de {c}
const c1 = new Map([["a", { $value: "{b}" }]]);

// C2. Typo dentro de una cadena larga (rotura a mitad de camino)
// resolve('a', c2) -> Esperado: error de referencia no encontrada en 'cc', aunque 'c' sí existe
const c2 = new Map([
    ["a", { $value: "{b}" }],
    ["b", { $value: "{cc}" }], // typo: debería ser {c}
    ["c", { $value: "10px" }],
]);

// C3. El propio token de entrada no existe
// resolve('a', c3) -> Esperado: error — ni siquiera hay que entrar en la lógica de alias
// 'a' no está en el Map (solo 'b'), así que la búsqueda inicial ya falla
const c3 = new Map([["b", { $value: "10px" }]]);

// console.log("=== TESTS DE RESOLVER ===");
// console.log("A1:", resolve("a", a1));
// console.log("A2:", resolve("a", a2));
// console.log("A3:", resolve("a", a3));
// console.log("A4 (desde 'a'):", resolve("a", a4));
// console.log("A4 (desde 'x'):", resolve("x", a4));

// try {
//     console.log("B1:", resolve("a", b1));
// } catch (e: any) {
//     console.error("B1 ERROR:", e.message);
// }

// try {
//     console.log("B2:", resolve("a", b2));
// } catch (e: any) {
//     console.error("B2 ERROR:", e.message);
// }

// try {
//     console.log("B3:", resolve("a", b3));
// } catch (e: any) {
//     console.error("B3 ERROR:", e.message);
// }

// try {
//     console.log("B4:", resolve("a", b4));
// } catch (e: any) {
//     console.error("B4 ERROR:", e?.message);
// }

// try {
//     console.log("C1:", resolve("a", c1));
// } catch (e: any) {
//     console.error("C1 ERROR:", e.message);
// }
// try {
//     console.log("C2:", resolve("a", c2));
// } catch (e: any) {
//     console.error("C2 ERROR:", e.message);
// }

// try {
//     console.log("C3:", resolve("a", c3));
// } catch (e: any) {
//     console.error("C3 ERROR:", e.message);
// }
// const mixedFlatTokens = new Map([
//     // Sano — debería acabar en `resolved`
//     ["color.brand", { $value: "#ff0000" }],

//     // Ciclo — debería acabar en `errors`, code: 'cycle'
//     ["spacing.broken", { $value: "{spacing.loop}" }],
//     ["spacing.loop", { $value: "{spacing.broken}" }],

//     // Referencia rota — debería acabar en `errors`, code: 'broken-reference'
//     ["font.missing", { $value: "{font.doesNotExist}" }],
// ]);

// console.log(resolveAll(mixedFlatTokens));
const testDoc = {
    spacing: {
        $type: "dimension",
        small: { $value: "4px" },
        special: { $type: "number", $value: 2 },
    },
    misterioso: { $value: "4px" },
};

console.log(walk(testDoc));
