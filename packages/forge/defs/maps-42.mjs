import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'maps',
  icons: [
    icon('map-stats', 'Map Analytics', ['analytics', 'stats', 'report', 'map', 'map'], [body(poly([[3.5, 6], [9, 4], [15, 6], [20.5, 4], [20.5, 18], [15, 20], [9, 18], [3.5, 20]], 1, true)), line(L(9, 4.4, 9, 17.6)), body(R(13.3, 16.8, 2.2, 3.7, 0.6), { cover: true }), body(R(15.9, 14.8, 2.2, 5.7, 0.6), { cover: true }), body(R(18.5, 12.5, 2.2, 8, 0.6), { cover: true })], { noAccent: true }),
    icon('compass-stats', 'Compass Analytics', ['analytics', 'stats', 'report', 'compass', 'compass'], [line(C(9.5, 10.5, 6.5)), body('M12 8l-1.3 3.7L7 13l1.3-3.7Z'), body(R(13.3, 16.8, 2.2, 3.7, 0.6), { cover: true }), body(R(15.9, 14.8, 2.2, 5.7, 0.6), { cover: true }), body(R(18.5, 12.5, 2.2, 8, 0.6), { cover: true })], { noAccent: true }),
    icon('globe-stats', 'Globe Analytics', ['analytics', 'stats', 'report', 'globe', 'globe'], [line(C(9.5, 10.5, 6.5)), line('M3 10.5h13M9.5 4c-2.4 3.8-2.4 9.2 0 13M9.5 4c2.4 3.8 2.4 9.2 0 13'), body(R(13.3, 16.8, 2.2, 3.7, 0.6), { cover: true }), body(R(15.9, 14.8, 2.2, 5.7, 0.6), { cover: true }), body(R(18.5, 12.5, 2.2, 8, 0.6), { cover: true })], { noAccent: true }),
    icon('signpost-stats', 'Signpost Analytics', ['analytics', 'stats', 'report', 'signpost', 'signpost'], [line('M9.5 3.5v15'), body(poly([[4, 5], [13.5, 5], [15.5, 6.75], [13.5, 8.5], [4, 8.5]], 0.6, true)), body(poly([[15, 10.5], [5.5, 10.5], [3.5, 12.25], [5.5, 14], [15, 14]], 0.6, true)), body(R(13.3, 16.8, 2.2, 3.7, 0.6), { cover: true }), body(R(15.9, 14.8, 2.2, 5.7, 0.6), { cover: true }), body(R(18.5, 12.5, 2.2, 8, 0.6), { cover: true })], { noAccent: true }),
    icon('route-stats', 'Route Analytics', ['analytics', 'stats', 'report', 'route', 'route'], [line(C(5, 15.5, 1.8) + C(14, 5.5, 1.8)), line('M6.7 15.5h5.3a2.5 2.5 0 0 0 0-5H7a2.5 2.5 0 0 1 0-5h5.3'), body(R(13.3, 16.8, 2.2, 3.7, 0.6), { cover: true }), body(R(15.9, 14.8, 2.2, 5.7, 0.6), { cover: true }), body(R(18.5, 12.5, 2.2, 8, 0.6), { cover: true })], { noAccent: true }),
  ],
};
