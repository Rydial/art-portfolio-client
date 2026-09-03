# Coding Notes / References

## Motion (Framer Motion) — Animation Ownership

Elements with `layoutId` or inside `AnimatePresence` must have ALL
transform/opacity interactions (hover, tap, etc.) driven by Motion, not CSS
— the two fight over `transform` otherwise. Self-contained elements with no
layout/exit animation can stay on plain CSS transitions.

## TypeScript — `string & {}` Trick

In a union like `"sm" | "md" | "lg" | string`, TS widens the whole thing to
`string`, killing autocomplete for the literals. Swapping the fallback to
`string & {}` keeps it structurally equal to `string` (still accepts any
string) but stops TS from widening, so the literal suggestions still show up
in autocomplete.
