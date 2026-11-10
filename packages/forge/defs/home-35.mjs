import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'home',
  icons: [
    icon('lightbulb-gear', 'Smart Bulb Settings', ['light settings', 'smart lighting', 'configure', 'lamp', 'lightbulb'], [body('M7 13.5v-1c0-.8-.4-1.4-1-2a4.6 4.6 0 1 1 6.5 0c-.6.6-1 1.2-1 2v1Z'), line('M7.3 16h3.9'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('lightbulb-clock', 'Light Timer', ['lighting schedule', 'smart light', 'timer', 'lamp', 'lightbulb'], [body('M7 13.5v-1c0-.8-.4-1.4-1-2a4.6 4.6 0 1 1 6.5 0c-.6.6-1 1.2-1 2v1Z'), line('M7.3 16h3.9'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
  ],
};
