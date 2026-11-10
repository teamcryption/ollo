import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));

export default {
  category: 'travel',
  icons: [
    icon('carabiner', 'Carabiner', ['climbing', 'clip', 'hook', 'mountaineering', 'gear'], rot([line('M7 14.5v.5a5 5 0 0 0 10 0V8a5 5 0 0 0-10 0'), line('M7.8 8.5 8.8 14')], 25), { noAccent: true }),
    icon('spyglass', 'Spyglass', ['telescope', 'pirate', 'lookout', 'explore', 'nautical'], rot([body(R(3.5, 9, 6.5, 6, 1.2)), body(R(10, 9.75, 5, 4.5, 1)), body(R(15, 10.5, 5.5, 3, 1))], -20), { noAccent: true }),
  ],
};
