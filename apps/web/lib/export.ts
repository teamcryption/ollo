// Lottie / dotLottie / GIF export in the browser, built on packages/build/src/motion-export.mjs.
import { GIFEncoder, applyPalette, quantize } from 'gifenc';
import { frameSvg, toDotLottie, toLottie } from '@library/build/src/motion-export.mjs';
import { svgDataUrl, type MotionSpec } from './data';

export { toLottie, toDotLottie };

/** Spec for the illustration "Draw" motion: every stroked path traces in (matches the CSS preview). */
export function drawSpec(svg: string): MotionSpec {
  const tracks: unknown[] = [];
  let i = -1;
  for (const m of svg.matchAll(/<path\b[^>]*>/g)) {
    i++;
    if (/stroke="(?!none)/.test(m[0])) {
      tracks.push({ target: i, property: 'draw', times: [0, 0.45, 1], values: [0, 1, 1], ease: [[0.45, 0, 0.2, 1], 'linear'] });
    }
  }
  return { duration: 3200, loop: true, tracks };
}
export const stillSpec: MotionSpec = { duration: 1000, loop: true, tracks: [] };

/**
 * Animated GIF of an SVG + motion spec. Colours must already be resolved (no currentColor).
 * background: hex or null for transparent.
 */
export async function toGif(
  svg: string,
  spec: MotionSpec,
  { size, background, fps = 30 }: { size: number; background: string | null; fps?: number },
): Promise<Blob> {
  const frames = Math.max(1, Math.round((spec.duration / 1000) * fps));
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  const sized = svg
    .replace(/(<svg[^>]*?)\s(width|height)="[^"]*"/g, '$1')
    .replace(/(<svg[^>]*?)\s(width|height)="[^"]*"/g, '$1')
    .replace('<svg', `<svg width="${size}" height="${size}"`);
  const gif = GIFEncoder();
  const delay = Math.round(1000 / fps);
  const shots: Uint8ClampedArray[] = [];
  for (let f = 0; f < frames; f++) {
    const img = new Image();
    img.src = svgDataUrl(frameSvg(sized, spec, (f / frames) * spec.duration));
    await img.decode();
    ctx.clearRect(0, 0, size, size);
    if (background) {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, size, size);
    }
    ctx.drawImage(img, 0, 0, size, size);
    shots.push(ctx.getImageData(0, 0, size, size).data);
  }
  // One palette for the whole loop, from frames spread across it (draw-on starts empty).
  const step = Math.max(1, Math.floor(frames / 8));
  const sampleFrames = shots.filter((_, i) => i % step === 0);
  const pool = new Uint8ClampedArray(sampleFrames.length * size * size * 4);
  sampleFrames.forEach((d, i) => pool.set(d, i * d.length));
  const fmt = background ? 'rgb565' : 'rgba4444';
  const palette = quantize(pool, 256, background ? {} : { format: 'rgba4444', oneBitAlpha: true });
  const tIndex = Math.max(0, palette.findIndex((c) => c[3] === 0));
  for (const d of shots) {
    gif.writeFrame(applyPalette(d, palette, fmt), size, size, { palette, delay, transparent: !background, transparentIndex: tIndex, repeat: 0 });
  }
  gif.finish();
  return new Blob([gif.bytes() as BlobPart], { type: 'image/gif' });
}
