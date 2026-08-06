Buen plan — vamos a dejarte con una hoja de ruta que puedas seguir solo, con explicaciones de por qué en cada paso, no sólo el qué. La organizo en tres días, con el foco fuerte en hoy tal como pides. Guarda esto en algún sitio (un .md en el repo, por ejemplo docs/NOTES-MONTANA.md) para poder volver a leerlo sin conexión.

Dónde estás ahora mismo

Tienes resolve() funcionando de verdad — sigue cadenas de alias y detecta ciclos. Es el algoritmo más difícil de toda la fase, y ya está en pie. Lo que queda es: pulir ese resolver (hoy), construir el parser que lo alimenta (mañana), y conectar todo con tests reales (el tercer día).

DÍA 1 (hoy) — Rematar el resolver
Paso 1.1 — Mensaje de error del ciclo, con la cadena completa

Por qué importa: ahora mismo tu throw dice "ERROR: Structure Misfunction" — no dice qué ciclo, ni por dónde. Un mensaje de error sin esa información es casi tan inútil como no tener el error. Recuerda tu propio diferencial frente a Style Dictionary: los mensajes útiles son el producto.

Dónde ocurre: en el punto donde routesManager detecta que la ruta ya estaba visitada.

Pseudocódigo:

función routesManager(ruta, listaVisitados):
rutaLimpia = limpiar(ruta)
si rutaLimpia YA está en listaVisitados:
// aquí tienes TODO lo que necesitas para un buen mensaje:
// listaVisitados = ['semantic.text.primary', 'color.primary.blue.500']
// rutaLimpia = 'semantic.text.primary' (la que se repite)
cadena = unir(listaVisitados, ' → ') + ' → ' + rutaLimpia
lanzar Error("Referencia circular detectada: " + cadena)
si_no:
añadir rutaLimpia a listaVisitados
devolver true

Cómo verificarlo sin mí: crea a mano, en un test o en un console.log rápido, un Map con un ciclo deliberado —

mapaConCiclo = {
'a': { $value: '{b}' },
'b': { $value: '{a}' }
}
resolve('a', mapaConCiclo)

Debería lanzar un error cuyo mensaje contenga a → b → a (o similar). Si el mensaje sale vacío o sin la cadena, revisa que estás construyéndolo antes de lanzar el throw, usando la lista tal como está en ese momento exacto de la recursión.

Paso 1.2 — Manejar la referencia rota (path que no existe en el Map)

Por qué importa: ahora mismo, si un alias apunta a un token que no existe, tu código hace \_flatTokens.get(pathQueNoExiste), que en JavaScript devuelve undefined — no un error. Como usas ?. en varios sitios, el código sigue ejecutándose con datos vacíos en vez de fallar de forma clara, y vas a acabar con un resultado corrupto en vez de un mensaje útil.

Dónde ocurre: al principio de iteratorMap, antes de mirar $type o $value.

Pseudocódigo:

función iteratorMap(ruta, mapaTokens, listaVisitados):
tokenActual = mapaTokens.obtener(ruta)

    // NUEVO: primera comprobación, antes de nada más
    si tokenActual NO existe:
        lanzar Error("Referencia rota: '" + ruta + "' no existe en el fichero de tokens")

    // el resto del código sigue igual, usando tokenActual en vez de
    // volver a llamar a mapaTokens.obtener(ruta) cada vez
    si tokenActual.$type NO existe Y tipo_de(tokenActual.$value) es string:
        ...

Detalle de estilo que de paso mejora tu código: fíjate que ahora mismo llamas a \_flatTokens.get(path) varias veces dentro de la misma función (una vez por cada ?.). Es ineficiente y frágil. Guarda el resultado en una variable una sola vez al principio (tokenActual, como en el pseudocódigo) y reutilízala. Menos líneas, menos posibilidad de error, y resuelve el problema del ?. de paso.

Cómo verificarlo: prueba con un Map donde el alias apunte a algo que no está:

mapaRoto = {
'a': { $value: '{no.existo}' }
}
resolve('a', mapaRoto)

Debería lanzar tu nuevo error de referencia rota, no un fallo críptico de "no se puede leer propiedad de undefined".

Paso 1.3 — Quitar el any, alinear con ResolvedToken<T>

Por qué importa: es la última pieza para que tu código deje de mentir al compilador. Ahora mismo resolve(): any significa que TypeScript no comprueba nada de lo que devuelves — podrías devolver cualquier cosa y no te avisaría.

El obstáculo real, para que no te sorprenda: el tipo genérico T de ResolvedToken<T> depende de un dato que sólo conoces en tiempo de ejecución (el $type del token final de la cadena) — TypeScript no puede "adivinar" ese T de antemano, porque depende del contenido real del Map, no de algo que el compilador pueda inferir estáticamente. Esto significa que, casi con toda seguridad, vas a necesitar una única afirmación de tipo controlada al final (as ResolvedToken), en el punto exacto donde devuelves el resultado — no un any disperso por todo el código, sino un solo punto, consciente y localizado, donde le dices al compilador "confía en mí, sé que esto tiene la forma correcta porque el runtime ya lo comprobó".

Esto no es lo mismo que rendirse con any. Es la diferencia entre "no sé qué es esto en ningún punto del código" (any) y "sé exactamente qué es, pero el compilador no puede probarlo por sí solo en este único punto muy concreto" (as puntual). Es una técnica legítima, siempre que sea la excepción y no la costumbre.

Pseudocódigo del ajuste:

función resolve(rutaInicio, mapaTokens) devuelve ResolvedToken:
listaVisitados = []
resultado = iteratorMap(rutaInicio, mapaTokens, listaVisitados)
devolver { ...resultado, path: rutaInicio } como ResolvedToken
// ^^^^^^^^^^^^^^^^ el único "as" del fichero

Cómo verificarlo: pnpm tsc --noEmit no debería quejarse. Si se queja de que type no coincide con value (porque ResolvedToken<T> exige que ambos campos vayan de la mano, tal como comprobamos hace tiempo con el ejercicio del "duration mal puesto"), es una señal de que el objeto que construyes en el else de iteratorMap no tiene exactamente los campos que ResolvedToken espera — revisa que value, type y references estén todos presentes con los nombres correctos.

Paso 1.4 — Construir resolveAll(), y aquí viene una decisión importante de diseño

Por qué importa, y por qué es más que "un bucle más": recuerda una decisión que ya tomaste hace semanas y que quedó escrita en docs/DECISIONS.md — errores como Result, no como excepciones ("B2: el parser recoge TODOS los diagnósticos, no lanza al primero"). Tu resolve() actual lanza (throw) cuando hay un ciclo o una referencia rota. Eso está bien como mecanismo interno de la recursión (es más simple de escribir con throw/try que propagando un Result en cada nivel de la recursión). Pero la función que llama a resolve() muchas veces (resolveAll) no puede dejar que un solo token roto tire abajo la resolución de los otros 39. Tiene que capturar cada error individualmente y seguir con el siguiente.

Esto es exactamente igual al check() que ya escribiste hace tiempo: recorre varias cosas, cada una puede fallar por separado, y al final agregas todos los resultados — ninguno bloquea a los demás.

Pseudocódigo:

función resolveAll(mapaTokens) devuelve { tokens: TokenSet, errores: Diagnostic[] }:
tokensResueltos = nuevo Map()
errores = []

    para cada ruta en las claves de mapaTokens:
        intentar:
            resultado = resolve(ruta, mapaTokens)
            tokensResueltos.set(ruta, resultado)
        capturar (error):
            errores.push({
                severity: 'error',
                code: (si el mensaje contiene "circular" → 'CIRCULAR_REFERENCE'
                       si_no → 'BROKEN_REFERENCE'),
                path: ruta,
                hint: error.mensaje
            })

    devolver { tokens: tokensResueltos, errores: errores }

Detalle de diseño a decidir tú: ¿cómo distingues, dentro del capturar, si el error fue un ciclo o una referencia rota, para poner el code correcto? Una opción simple: que tus dos throw (paso 1.1 y 1.2) usen mensajes con un prefijo reconocible ("CICLO: ..." vs "ROTA: ..."), y aquí compruebas ese prefijo. Es un poco tosco pero funciona perfectamente para la v1 — no hace falta una jerarquía de clases de error todavía.

Cómo verificarlo: ejecuta resolveAll contra tu flatTokens completo (el de tu fixture real, con los 8 tokens) y comprueba que el Map de salida tiene 8 entradas, todas con valores correctos, y errores vacío. Luego rompe algo a propósito (cambia un alias para que apunte a un path que no existe) y comprueba que errores tiene 1 entrada, pero el resto de tokens (los que no dependían del roto) se siguen resolviendo bien.

DÍA 2 — El parser (la otra mitad de la Fase A1)

Este es el trabajo más largo que queda, así que tómatelo con calma, en varias sesiones si hace falta.

El porqué, antes del cómo

Tu resolve() de hoy recibe un Map<string, RawToken> ya aplanado — se lo diste tú mismo, a mano, copiando tu fixture. En el proyecto real, ese Map tiene que salir de tu JSON anidado de verdad (grupos dentro de grupos). Ese trabajo de "coger el árbol anidado y convertirlo en un Map plano" es el parser.

Y hay un matiz importante que conecta las dos piezas: tu resolve() de hoy asume que, cuando llega a un token con valor real (no alias), ese token ya tiene su $type correcto — ya sea porque lo declaró él mismo, ya sea porque lo heredó de un grupo. Pero resolve() no sabe nada de herencia de grupos — nunca ha visto un RawGroup, sólo el Map ya plano. Eso significa que la herencia de tipo tiene que resolverse durante el aplanado (aquí, en el parser), no en el resolver. Es un reparto de trabajo limpio: el parser aplana y hereda tipos; el resolver sigue alias y detecta ciclos. Cada uno hace una cosa.

Paso 2.1 — Los type guards: distinguir token de grupo

Por qué: dado un nodo cualquiera del JSON, necesitas saber si es "un token" (tiene $value) o "un grupo" (no lo tiene, y hay que seguir bajando).

Pseudocódigo:

función esToken(nodo):
devolver: nodo es un objeto (no null, no array)
Y tiene la clave "$value"

función esGrupo(nodo):
devolver: nodo es un objeto (no null, no array)
Y NO tiene la clave "$value"

Cómo verificarlo: pruébalo contra fragmentos sueltos de tu propio fixture — esToken({ $type: 'color', $value: {...} }) debe dar true; esGrupo({ primary: {...}, secondary: {...} }) debe dar true; esToken({ primary: {...} }) debe dar false.

Paso 2.2 — walk(): el recorrido recursivo que aplana Y hereda tipos

Esta es la pieza central del día. Tómate tiempo aquí.

La idea general, en prosa antes del pseudocódigo: entras en un nodo (al principio, la raíz del JSON entero). Miras cada una de sus claves (ignorando las que empiezan por $, que son propiedades del propio grupo, no hijos). Para cada clave: si el valor de esa clave es un token, lo guardas en el Map de salida con su ruta completa (padre.hijo). Si es un grupo, entras dentro de él recursivamente, llevándote el "tipo heredado hasta ahora" por si los hijos lo necesitan.

El matiz importante que hay que respetar (y que es fácil de hacer mal): sólo aplicas la herencia de tipo cuando el token tiene un valor real — NO cuando es un alias. Repasa la regla de la spec que vimos hace mucho: si el valor es una referencia, el tipo se saca de a dónde apunta esa referencia (trabajo del resolver, no del parser); sólo si no es una referencia, se hereda del grupo. Si el parser fuerza la herencia también sobre los tokens-alias, le vas a "ensuciar" el `
𝑡
𝑦
𝑝
𝑒
‘
𝑎
𝑢
𝑛
𝑡
𝑜
𝑘
𝑒
𝑛
𝑞
𝑢
𝑒
𝑡
𝑢
‘
𝑟
𝑒
𝑠
𝑜
𝑙
𝑣
𝑒
(
)
‘
𝑑
𝑒
ℎ
𝑜
𝑦
𝑢
𝑠
𝑎
𝑝
𝑟
𝑒
𝑐
𝑖
𝑠
𝑎
𝑚
𝑒
𝑛
𝑡
𝑒
𝑙
𝑎
𝑎
𝑢
𝑠
𝑒
𝑛
𝑐
𝑖
𝑎
𝑑
𝑒
‘
type‘auntokenquetu‘resolve()‘dehoyusaprecisamentelaausenciade‘type` para reconocer que es un alias — y le romperías la lógica que ya tienes funcionando.

Pseudocódigo completo:

función walk(nodo, rutaActual, tipoHeredado, mapaSalida, diagnosticos):

    // ¿este nodo declara su propio tipo? si sí, se convierte
    // en el tipo heredado para SUS hijos (no para él mismo)
    si nodo tiene "$type":
        tipoParaHijos = nodo.$type
    si_no:
        tipoParaHijos = tipoHeredado

    para cada clave en nodo:
        si clave empieza por "$":
            continuar (saltar, es una propiedad como $type o $description, no un hijo)

        nodoHijo = nodo[clave]
        rutaHijo = si rutaActual está vacía: clave
                   si_no: rutaActual + "." + clave

        si esToken(nodoHijo):
            esAlias = (tipo_de(nodoHijo.$value) es string) Y (empieza por "{")

            si nodoHijo tiene "$type" propio:
                tipoFinal = nodoHijo.$type
            si_no si esAlias:
                tipoFinal = indefinido   // el resolver lo averiguará siguiendo el alias
            si_no:
                tipoFinal = tipoParaHijos   // herencia real, sólo para valores no-alias

            mapaSalida.set(rutaHijo, { $value: nodoHijo.$value, $type: tipoFinal })

        si_no si esGrupo(nodoHijo):
            walk(nodoHijo, rutaHijo, tipoParaHijos, mapaSalida, diagnosticos)

        si_no:
            // no es ni token ni grupo con forma válida -> nodo malformado
            diagnosticos.push({ severity: 'error', code: 'MALFORMED_NODE', path: rutaHijo, ... })

Cómo verificarlo, paso a paso, sin necesitar el parser completo todavía: ejecuta walk() sólo contra tu fixture completo, con rutaActual = "", tipoHeredado = undefined, y un Map vacío. Al terminar, compara el Map resultante contra el flatTokens que ya construiste tú a mano hace unos días — deberían coincidir exactamente, clave por clave. Ese flatTokens manual que ya tienes es tu "respuesta correcta" para comprobar que walk() funciona: si algo no coincide, ahí está el bug.

Paso 2.3 — parseTokenFile(): la función pública, y dónde se junta todo

Pseudocódigo:

función parseTokenFile(entrada) devuelve ParseResult:

    si entrada NO es un objeto (o es null, o es array):
        devolver { ok: false, errors: [{ code: 'INVALID_ROOT', ... }] }

    mapaAplanado = nuevo Map()
    diagnosticosDelWalk = []

    walk(entrada, "", indefinido, mapaAplanado, diagnosticosDelWalk)

    si diagnosticosDelWalk tiene algún error:
        devolver { ok: false, errors: diagnosticosDelWalk }

    { tokens: tokensResueltos, errores: erroresDelResolve } = resolveAll(mapaAplanado)

    si erroresDelResolve tiene algún error:
        devolver { ok: false, errors: erroresDelResolve }

    devolver { ok: true, tokens: tokensResueltos, warnings: [] }

Fíjate cómo esta función es la que por fin conecta las dos mitades del día: walk (parser, día 2) y resolveAll (resolver, día 1). Es literalmente el pipeline completo que dibujamos al principio de toda esta fase: unknown → walk → Map plano → resolveAll → TokenSet.

Cómo verificarlo: llama a parseTokenFile(tuFixtureCompletoComoObjetoJS) y comprueba que ok: true y que tokens tiene las 8 entradas esperadas con los valores correctos. Luego rompe tu fixture a propósito (quita una llave, o mete un alias roto) y comprueba que ok: false con un error descriptivo.

DÍA 3 — Conectarlo todo y tests reales (si te queda tiempo/cobertura)

Este día es más ligero de instrucciones porque es sobre todo aplicar lo ya construido, no diseñar algo nuevo.

Paso 3.1 — src/index.ts, el barrel público

Sólo reexporta lo que un consumidor externo necesita — no todo lo interno:

exportar { parseTokenFile } desde './parse/parse.js'
exportar tipo { ResolvedToken, TokenSet, Diagnostic, TokenType } desde './types/index.js'

Nada de walk, isToken, iteratorMap — eso es interno, no debe salir por la puerta pública.

Paso 3.2 — Sustituir el smoke test por tests reales

Usa los bloques de tests que planeamos hace mucho (los 22 casos) como checklist, pero no hace falta hacerlos todos ahora — prioriza estos cinco, que son los que ya tienes material para probar con tu propio fixture:

Fixture completo → ok: true, 8 tokens, valores correctos.
Alias profundo (tu cadena de 3 saltos) → el valor final es el correcto.
Referencia rota → ok: false, con el código correcto.
Ciclo (a → b → a) → ok: false, mensaje con la cadena completa.
Herencia de tipo (tu semantic con $type en el grupo) → el token hijo termina con el tipo correcto sin haberlo declarado.
Paso 3.3 — Si te sobra tiempo: UNSUPPORTED_TYPE

Recuerda tu decisión en DECISIONS.md: los 6 tipos compuestos no se soportan en v1, con un error explícito, no un crash. Añade en walk() una comprobación: si el $type de un token (propio o heredado) no está en SUPPORTED_TYPES, en vez de meterlo en el Map como si nada, genera un diagnóstico UNSUPPORTED_TYPE y no lo aplanes. Es un añadido pequeño sobre lo que ya vas a tener construido.

Cómo trabajar con poca conexión
pnpm tsc --noEmit y pnpm test son tus dos comandos de verdad — no necesitas internet para ninguno de los dos, sólo lo que ya tienes instalado. Úsalos constantemente, después de cada función pequeña, no sólo al final del día.
Si algo no compila y no tienes forma de preguntarme, lee el mensaje de error completo, de arriba abajo — TypeScript casi siempre te dice la línea exacta y qué esperaba vs qué encontró. El 80% de las veces la respuesta está en el propio mensaje.
Si te atascas de verdad en algo, anótalo (en el mismo .md de notas) en vez de perder media hora peleando sin avanzar — algo tipo "día 2, paso 2.2, no sé por qué walk() no hereda bien el tipo en tal caso" — y lo retomamos juntos cuando vuelvas con conexión.
Commitea pequeño y a menudo, con wip: cuando algo no esté terminado — es más fácil retomar diez commits pequeños que uno enorme sin cortes.

Que vaya bien la montaña.
