import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const rays = (cx, cy, r0, r1, n = 8, skip = []) => {
  const out = [];
  for (let i = 0; i < n; i++) {
    if (skip.includes(i)) continue;
    const a = (i * 2 * Math.PI) / n - Math.PI / 2;
    out.push(L(cx + r0 * Math.cos(a), cy + r0 * Math.sin(a), cx + r1 * Math.cos(a), cy + r1 * Math.sin(a)));
  }
  return out;
};
const dots = (cx, cy, r, n = 8) => Array.from({ length: n }, (_, i) => {
  const a = (i * 2 * Math.PI) / n - Math.PI / 2;
  return D(cx + r * Math.cos(a), cy + r * Math.sin(a));
});
const CLOUD = 'M9 16a3.4 3.4 0 0 1-.4-6.8 4.9 4.9 0 0 1 9.4 1A2.9 2.9 0 0 1 18 16Z';

export default {
  category: 'weather',
  icons: [
    icon('sun-rain', 'Sun Showers', ['showers', 'mixed weather', 'rain', 'sunny spells'], [body(C(8, 8, 2.3)), ...rays(8, 8, 3.8, 4.8, 8, [2, 3, 4]).map((d) => line(d)), body(CLOUD, { cover: true }), line(L(10, 18.3, 9.3, 20.5)), accent(L(13.3, 18.3, 12.6, 20.5)), line(L(16.6, 18.3, 15.9, 20.5))], { anim: { preset: 'bounce', dist: 1 } }),
    icon('thermometer-sun', 'Heat', ['hot', 'heatwave', 'temperature', 'summer'], [body('M5.5 5a2 2 0 0 1 4 0v8.1a4 4 0 1 1-4 0Z'), accent(L(7.5, 8.5, 7.5, 16)), body(C(16, 8.5, 2.5)), ...rays(16, 8.5, 3.8, 4.8, 8, [5, 6]).map((d) => line(d))]),
    icon('hurricane', 'Hurricane', ['cyclone', 'typhoon', 'storm', 'tropical'], [line(C(12, 12, 3)), line('M9 12a7.5 7.5 0 0 1 7.5-7.5'), line('M15 12a7.5 7.5 0 0 1-7.5 7.5'), accent(D(12, 12))], { anim: 'spin' }),
    icon('comet', 'Comet', ['meteor', 'shooting star', 'space', 'asteroid'], [body(C(16, 8, 3.5)), line(L(13.4, 10.6, 5, 19)), line(L(12.6, 8.4, 6, 12)), line(L(15.6, 11.4, 12, 18.5))], { noAccent: true, anim: { preset: 'nudge', dir: [1, -1], dist: 1.5 } }),
    icon('sun-dim', 'Dim', ['brightness low', 'dim', 'night shift', 'screen brightness'], [body(C(12, 12, 4)), ...dots(12, 12, 7.5).map((d, i) => (i === 1 ? accent(d) : line(d)))], { anim: 'spin' }),
  ],
};
