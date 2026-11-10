declare module '@library/build/src/motion.mjs' {
  export function animateSvg(svg: string, spec: unknown): string;
  export function compileCss(spec: unknown, opts?: { prefix?: string }): string;
}
