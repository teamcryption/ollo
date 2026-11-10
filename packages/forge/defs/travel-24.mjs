import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'travel',
  icons: [
    icon('passport-pin', 'Embassy', ['consulate location', 'visa office', 'travel documents', 'passport', 'passport'], [body(R(4, 3.5, 11, 14, 1.5)), line(C(9.5, 9, 2.5)), line('M7 14h5'), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('suitcase-shield', 'Luggage Insurance', ['baggage cover', 'protected luggage', 'travel', 'suitcase', 'suitcase'], [line('M7.5 6.5V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5'), body(R(4, 6.5, 11, 10, 2)), line('M7 9v5M12 9v5'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
  ],
};
