# Decisions

Registro rápido de decisiones de diseño y alcance. Las jugosas se
desarrollan como ADR en `docs/adr/`.

## Scope

**Q: ¿Qué hace Atelier?**
A: Valida tokens DTCG (referencias rotas, ciclos, huérfanos, contraste,
vars CSS no referenciadas) y genera CSS, tipos TS, config de Tailwind
a partir de ellos.

**Q: ¿Qué NO hace?**
A: No plugin de Figma. No salidas iOS/Android. No editor visual.
No runtime de theming. No conversión entre espacios de color arbitrarios
(v1 usa el `hex` de fallback).

**Q: ¿Formato de entrada?**
A: DTCG 2025.10 estricto. Sin tolerancia a formato legacy de Style
Dictionary (`value` en vez de `$value`) en v1.

**Q: ¿Multi-fichero / resolver de temas?**
A: No en v1, pero el core recibe un array de fuentes desde el día 1
para no cerrar la puerta.

**Q: ¿Qué tipos de token soporta v1?**
A: Los 7 simples (color, dimension, number, fontWeight, duration,
cubicBezier, strokeStyle). Los 6 compuestos (typography, shadow,
border, gradient, transition) quedan fuera, con error `UNSUPPORTED_TYPE`
explícito, no un crash.

## Architecture

**Q: ¿ESM-only o dual ESM+CJS?**
A: ESM-only. Ver ADR 0001.

**Q: ¿Node mínimo?**
A: 22 LTS.

**Q: ¿Estrategia de errores en el parser?**
A: `Result` con todos los diagnósticos, no excepciones. Ver ADR 0003.

**Q: ¿Dependencias de producción?**
A: Cero en el core. Ver ADR 0004.

**Q: ¿Dónde vive `check`, core o CLI?**
A: En el core. La CLI sólo formatea. CI-first: el exit code y el JSON
de salida existen antes que la primera regla de validación.
Ver ADR 0005.

## Product

**Q: ¿Usuario objetivo?**
A: Equipo de 5-20 personas con design system propio, más de una app
consumiéndolo, con requisitos de accesibilidad.

**Q: ¿Frase única del README?**
A: "Catches broken, unused, and inaccessible design tokens before
they reach production."

**Q: ¿Contra quién compites y dónde pierdes?**
A: Style Dictionary y Terrazzo generan mejor y tienen más adaptadores
de salida. Ganamos en validación integrada en CI.

**Q: ¿Definición de "terminado" v1.0.0?**
A: Ver checklist en el README de packages/atelier.

## Naming

**Q: ¿Nombre del paquete?**
A: `@mrploman/atelier`. Reservado en npm el 2026-07-25.
