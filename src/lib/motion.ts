// Shared easing curve for framer-motion transitions, typed as a literal
// tuple so TS accepts it as an Easing (a plain number[] does not satisfy
// framer-motion's Easing type).
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
