import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'devices',
  icons: [
    icon('printer-bulb', 'Printer Ideas', ['idea', 'tip', 'insight', 'printer', 'printer'], [line('M6 6.5V3.5h7v3'), body(R(3, 6.5, 13, 6.5, 1.5)), body(R(6, 11, 7, 5.5, 0.8), { cover: true }), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('speaker-bulb', 'Speaker Ideas', ['idea', 'tip', 'insight', 'speaker', 'speaker'], [body(R(4.5, 3.5, 10, 15, 2)), line(C(9.5, 12.5, 2.8)), line(D(9.5, 6.8)), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('earbuds-bulb', 'Earbuds Ideas', ['idea', 'tip', 'insight', 'earbuds', 'earbuds'], [body('M6 4a2.5 2.5 0 0 1 2.5 2.5V9A2.5 2.5 0 0 1 6 11.5 2.5 2.5 0 0 1 3.5 9V6.5A2.5 2.5 0 0 1 6 4Z'), line('M7 11.3V16'), body('M13 4a2.5 2.5 0 0 1 2.5 2.5V9a2.5 2.5 0 0 1-5 0V6.5A2.5 2.5 0 0 1 13 4Z'), line('M12 11.3V16'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
  ],
};
