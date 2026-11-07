// Default motion for generated icons, expressed in the pipeline's motion spec
// (packages/assets/schema/motion.schema.json). Targets are indexes of the
// regular-style <path>s, which follow the drawing order of the definition.
const SYM = [0.5, 0, 0.5, 1];
const BACK = [0.45, 1.45, 0.8, 1];
const D = 3000;
const round = (v) => Math.round(v * 100) / 100;

function popAndDraw(roles) {
  const tracks = [];
  const bodies = roles.map((r, i) => [r, i]).filter(([r]) => r === 'body');
  const lines = roles.map((r, i) => [r, i]).filter(([r]) => r !== 'body');
  const outline = bodies.length ? bodies : lines.slice(0, 1);
  const drawn = bodies.length ? lines : lines.slice(1);
  outline.forEach(([, i], k) => {
    const s = round(k * 0.04);
    tracks.push({ target: i, property: 'scale', origin: [50, 50], times: [0, s, s + 0.1667, 1], values: [0.6, 0.6, 1, 1], ease: ['linear', BACK, 'linear'] });
    tracks.push({ target: i, property: 'opacity', times: [0, s, s + 0.1333, 0.8, 0.9333, 1], values: [0, 0, 1, 1, 0, 0], ease: ['linear', 'easeOut', SYM, 'easeIn', 'linear'] });
  });
  drawn.forEach(([, i], k) => {
    const s = round(0.133 + k * 0.05);
    tracks.push({ target: i, property: 'draw', times: [0, s, s + 0.2, 0.8, 0.933, 1], values: [0, 0, 1, 1, 0, 0], ease: ['linear', 'easeInOut', SYM, 'easeIn', 'linear'] });
  });
  return tracks;
}

const T8 = [0, 0.0667, 0.1333, 0.2, 0.2667, 0.3333, 0.4, 1];
const PRESETS = {
  'pop-draw': (roles) => popAndDraw(roles),
  spin: () => [{ target: 'root', property: 'rotate', origin: [50, 50], times: [0, 0.1, 0.6, 1], values: [0, 0, 360, 360], ease: ['linear', [0.65, 0, 0.35, 1], 'linear'] }],
  wiggle: () => [{ target: 'root', property: 'rotate', origin: [50, 50], times: T8, values: [0, 0, -14, 12, -8, 5, 0, 0], ease: ['linear', 'easeOut', SYM, SYM, SYM, 'easeOut', 'linear'] }],
  pulse: () => [{ target: 'root', property: 'scale', origin: [50, 50], times: [0, 0.0667, 0.15, 0.2333, 0.3167, 0.4333, 1], values: [1, 1, 1.18, 1, 1.1, 1, 1], ease: ['linear', 'easeOut', 'easeIn', 'easeOut', 'easeInOut', 'linear'] }],
  nudge: (_, { dir = [1, 0], dist = 2.5 } = {}) => {
    const times = [0, 0.1, 0.25, 0.4, 0.55, 0.7, 1];
    const v = [0, 0, 1, 0, 1, 0, 0];
    return [
      { target: 'root', property: 'translateX', times, values: v.map((k) => round(k * dir[0] * dist)), ease: ['linear', SYM, SYM, SYM, SYM, 'linear'] },
      { target: 'root', property: 'translateY', times, values: v.map((k) => round(k * dir[1] * dist)), ease: ['linear', SYM, SYM, SYM, SYM, 'linear'] },
    ];
  },
  bounce: (_, { dist = -2.5 } = {}) => [
    { target: 'root', property: 'translateY', times: [0, 0.1, 0.22, 0.34, 0.42, 0.5, 1], values: [0, 0, dist, 0, round(dist * 0.35), 0, 0], ease: ['linear', 'easeOut', 'easeIn', 'easeOut', 'easeIn', 'linear'] },
  ],
};

export const PRESET_NAMES = Object.keys(PRESETS);

/** Rotate a direction vector by `deg` (screen coordinates). */
export function turnDir([x, y], deg) {
  const a = (deg * Math.PI) / 180;
  return [round(x * Math.cos(a) - y * Math.sin(a)), round(x * Math.sin(a) + y * Math.cos(a))];
}

export function motionFor(anim, roles) {
  const spec = typeof anim === 'string' ? { preset: anim } : anim ?? { preset: 'pop-draw' };
  const make = PRESETS[spec.preset];
  if (!make) throw new Error(`unknown motion preset "${spec.preset}"`);
  return { duration: D, loop: true, source: 'generated', preset: spec.preset, tracks: make(roles, spec) };
}
