import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'devices',
  icons: [
    icon('printer-pin', 'Printer Location', ['nearest printer', 'print station', 'office map', 'printer', 'printer'], [line('M6 6.5V3.5h7v3'), body(R(3, 6.5, 13, 6.5, 1.5)), body(R(6, 11, 7, 5.5, 0.8), { cover: true }), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('router-bolt', 'Fast Internet', ['high speed broadband', 'gigabit', 'fibre', 'internet', 'router'], [line('M6 9.5 4.5 5M13 9.5l1.5-4.5'), body(R(3, 9.5, 13, 5.5, 1.5)), line(D(6, 12.3) + D(9, 12.3)), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('router-search', 'Network Devices', ['scan devices', 'connected devices', 'lookup', 'internet', 'router'], [line('M6 9.5 4.5 5M13 9.5l1.5-4.5'), body(R(3, 9.5, 13, 5.5, 1.5)), line(D(6, 12.3) + D(9, 12.3)), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
  ],
};
