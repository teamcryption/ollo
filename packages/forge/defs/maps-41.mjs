import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'maps',
  icons: [
    icon('map-camera', 'Map Photo', ['photo', 'camera', 'picture', 'map', 'map'], [body(poly([[3.5, 6], [9, 4], [15, 6], [20.5, 4], [20.5, 18], [15, 20], [9, 18], [3.5, 20]], 1, true)), line(L(9, 4.4, 9, 17.6)), body('M13 15.2a1.2 1.2 0 0 1 1.2-1.2h1.2l.8-1.2h2.6l.8 1.2h1.2a1.2 1.2 0 0 1 1.2 1.2v4.1a1.2 1.2 0 0 1-1.2 1.2h-5.6a1.2 1.2 0 0 1-1.2-1.2Z', { cover: true }), line(C(17, 17.2, 1.4))], { noAccent: true }),
    icon('compass-camera', 'Compass Photo', ['photo', 'camera', 'picture', 'compass', 'compass'], [line(C(9.5, 10.5, 6.5)), body('M12 8l-1.3 3.7L7 13l1.3-3.7Z'), body('M13 15.2a1.2 1.2 0 0 1 1.2-1.2h1.2l.8-1.2h2.6l.8 1.2h1.2a1.2 1.2 0 0 1 1.2 1.2v4.1a1.2 1.2 0 0 1-1.2 1.2h-5.6a1.2 1.2 0 0 1-1.2-1.2Z', { cover: true }), line(C(17, 17.2, 1.4))], { noAccent: true }),
    icon('globe-camera', 'Globe Photo', ['photo', 'camera', 'picture', 'globe', 'globe'], [line(C(9.5, 10.5, 6.5)), line('M3 10.5h13M9.5 4c-2.4 3.8-2.4 9.2 0 13M9.5 4c2.4 3.8 2.4 9.2 0 13'), body('M13 15.2a1.2 1.2 0 0 1 1.2-1.2h1.2l.8-1.2h2.6l.8 1.2h1.2a1.2 1.2 0 0 1 1.2 1.2v4.1a1.2 1.2 0 0 1-1.2 1.2h-5.6a1.2 1.2 0 0 1-1.2-1.2Z', { cover: true }), line(C(17, 17.2, 1.4))], { noAccent: true }),
    icon('signpost-camera', 'Signpost Photo', ['photo', 'camera', 'picture', 'signpost', 'signpost'], [line('M9.5 3.5v15'), body(poly([[4, 5], [13.5, 5], [15.5, 6.75], [13.5, 8.5], [4, 8.5]], 0.6, true)), body(poly([[15, 10.5], [5.5, 10.5], [3.5, 12.25], [5.5, 14], [15, 14]], 0.6, true)), body('M13 15.2a1.2 1.2 0 0 1 1.2-1.2h1.2l.8-1.2h2.6l.8 1.2h1.2a1.2 1.2 0 0 1 1.2 1.2v4.1a1.2 1.2 0 0 1-1.2 1.2h-5.6a1.2 1.2 0 0 1-1.2-1.2Z', { cover: true }), line(C(17, 17.2, 1.4))], { noAccent: true }),
    icon('route-camera', 'Route Photo', ['photo', 'camera', 'picture', 'route', 'route'], [line(C(5, 15.5, 1.8) + C(14, 5.5, 1.8)), line('M6.7 15.5h5.3a2.5 2.5 0 0 0 0-5H7a2.5 2.5 0 0 1 0-5h5.3'), body('M13 15.2a1.2 1.2 0 0 1 1.2-1.2h1.2l.8-1.2h2.6l.8 1.2h1.2a1.2 1.2 0 0 1 1.2 1.2v4.1a1.2 1.2 0 0 1-1.2 1.2h-5.6a1.2 1.2 0 0 1-1.2-1.2Z', { cover: true }), line(C(17, 17.2, 1.4))], { noAccent: true }),
    icon('map-filter', 'Filter Map', ['filter', 'sort', 'refine', 'map', 'map'], [body(poly([[3.5, 6], [9, 4], [15, 6], [20.5, 4], [20.5, 18], [15, 20], [9, 18], [3.5, 20]], 1, true)), line(L(9, 4.4, 9, 17.6)), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('compass-filter', 'Filter Compass', ['filter', 'sort', 'refine', 'compass', 'compass'], [line(C(9.5, 10.5, 6.5)), body('M12 8l-1.3 3.7L7 13l1.3-3.7Z'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('globe-filter', 'Filter Globe', ['filter', 'sort', 'refine', 'globe', 'globe'], [line(C(9.5, 10.5, 6.5)), line('M3 10.5h13M9.5 4c-2.4 3.8-2.4 9.2 0 13M9.5 4c2.4 3.8 2.4 9.2 0 13'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('signpost-filter', 'Filter Signpost', ['filter', 'sort', 'refine', 'signpost', 'signpost'], [line('M9.5 3.5v15'), body(poly([[4, 5], [13.5, 5], [15.5, 6.75], [13.5, 8.5], [4, 8.5]], 0.6, true)), body(poly([[15, 10.5], [5.5, 10.5], [3.5, 12.25], [5.5, 14], [15, 14]], 0.6, true)), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('route-filter', 'Filter Route', ['filter', 'sort', 'refine', 'route', 'route'], [line(C(5, 15.5, 1.8) + C(14, 5.5, 1.8)), line('M6.7 15.5h5.3a2.5 2.5 0 0 0 0-5H7a2.5 2.5 0 0 1 0-5h5.3'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
