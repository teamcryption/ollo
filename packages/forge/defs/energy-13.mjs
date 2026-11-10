import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'energy',
  icons: [
    icon('plug-clock', 'Smart Plug Schedule', ['power timer', 'schedule', 'smart home', 'energy', 'plug'], [line('M7 3.5v3M12 3.5v3'), body(R(5, 6.5, 9, 5, 1.5)), line('M9.5 11.5V14a2 2 0 0 0 2 2'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('plug-gear', 'Smart Plug Settings', ['power settings', 'configure', 'smart home', 'energy', 'plug'], [line('M7 3.5v3M12 3.5v3'), body(R(5, 6.5, 9, 5, 1.5)), line('M9.5 11.5V14a2 2 0 0 0 2 2'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('plug-shield', 'Surge Protection', ['power protection', 'safe socket', 'electrical', 'energy', 'plug'], [line('M7 3.5v3M12 3.5v3'), body(R(5, 6.5, 9, 5, 1.5)), line('M9.5 11.5V14a2 2 0 0 0 2 2'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
  ],
};
