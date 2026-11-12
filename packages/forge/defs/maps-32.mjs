import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'maps',
  icons: [
    icon('map-upload', 'Upload Map', ['upload', 'send', 'export', 'map', 'map'], [body(poly([[3.5, 6], [9, 4], [15, 6], [20.5, 4], [20.5, 18], [15, 20], [9, 18], [3.5, 20]], 1, true)), line(L(9, 4.4, 9, 17.6)), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('compass-upload', 'Upload Compass', ['upload', 'send', 'export', 'compass', 'compass'], [line(C(9.5, 10.5, 6.5)), body('M12 8l-1.3 3.7L7 13l1.3-3.7Z'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('globe-upload', 'Upload Globe', ['upload', 'send', 'export', 'globe', 'globe'], [line(C(9.5, 10.5, 6.5)), line('M3 10.5h13M9.5 4c-2.4 3.8-2.4 9.2 0 13M9.5 4c2.4 3.8 2.4 9.2 0 13'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('signpost-upload', 'Upload Signpost', ['upload', 'send', 'export', 'signpost', 'signpost'], [line('M9.5 3.5v15'), body(poly([[4, 5], [13.5, 5], [15.5, 6.75], [13.5, 8.5], [4, 8.5]], 0.6, true)), body(poly([[15, 10.5], [5.5, 10.5], [3.5, 12.25], [5.5, 14], [15, 14]], 0.6, true)), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
