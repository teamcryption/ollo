declare module '@library/build/src/motion.mjs' {
  export function animateSvg(svg: string, spec: unknown): string;
  export function compileCss(spec: unknown, opts?: { prefix?: string }): string;
}

declare module '@library/build/src/motion-export.mjs' {
  export function toLottie(svg: string, spec: unknown, opts?: { colour?: string; size?: number; background?: string | null; speed?: number; fps?: number; name?: string }): Record<string, unknown>;
  export function toDotLottie(lottie: unknown, opts?: { id?: string; loop?: boolean; speed?: number }): Uint8Array;
  export function frameSvg(svg: string, spec: unknown, ms: number): string;
}

declare module 'gifenc' {
  export function GIFEncoder(): {
    writeFrame(index: Uint8Array, w: number, h: number, o?: Record<string, unknown>): void;
    finish(): void;
    bytes(): Uint8Array;
  };
  export function quantize(rgba: Uint8ClampedArray, max: number, o?: Record<string, unknown>): number[][];
  export function applyPalette(rgba: Uint8ClampedArray, palette: number[][], format?: string): Uint8Array;
}
