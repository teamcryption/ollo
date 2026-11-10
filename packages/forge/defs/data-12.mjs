import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'data',
  icons: [
    icon('dashboard-gear', 'Dashboard Settings', ['widgets', 'configure dashboard', 'layout', 'analytics', 'dashboard'], [body(R(3, 4, 5.5, 6, 1)), body(R(10, 4, 5.5, 4, 1)), body(R(3, 11.5, 5.5, 5, 1)), body(R(10, 9.5, 5.5, 7, 1)), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('dashboard-clock', 'Real-time Dashboard', ['live data', 'refresh', 'monitoring', 'analytics', 'dashboard'], [body(R(3, 4, 5.5, 6, 1)), body(R(10, 4, 5.5, 4, 1)), body(R(3, 11.5, 5.5, 5, 1)), body(R(10, 9.5, 5.5, 7, 1)), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('dashboard-star', 'Featured Dashboard', ['favourite report', 'starred view', 'analytics', 'overview', 'dashboard'], [body(R(3, 4, 5.5, 6, 1)), body(R(10, 4, 5.5, 4, 1)), body(R(3, 11.5, 5.5, 5, 1)), body(R(10, 9.5, 5.5, 7, 1)), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
  ],
};
