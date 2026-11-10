import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'communication',
  icons: [
    icon('phone-shield', 'Spam Protection', ['call blocking', 'scam protection', 'safe calls', 'phone', 'phone'], [body('M5.5 3.5h2.5l1.3 3.2-1.8 1.3a8 8 0 0 0 3.5 3.5l1.3-1.8 3.2 1.3v2.5A1.5 1.5 0 0 1 14 15c-6 0-10-4-10-10a1.5 1.5 0 0 1 1.5-1.5Z'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
  ],
};
