import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'celebration',
  icons: [
    icon('skull-upload', 'Upload Skull', ['upload', 'send', 'export', 'skull', 'skull'], [body('M9.5 3.5a6 6 0 0 1 6 6c0 2-1 3.3-2 4V16a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-2.5c-1-.7-2-2-2-4a6 6 0 0 1 6-6Z'), line(C(7.2, 9.6, 1.2) + C(11.8, 9.6, 1.2)), line('M8 14.5V16M11 14.5V16'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('gingerbread-upload', 'Upload Gingerbread', ['upload', 'send', 'export', 'gingerbread', 'gingerbread'], [body(C(9.5, 5, 2.2)), body('M6.5 8h6l2.5 2-1 1.5-1.5-.8V14l1.5 3.5-1.7.8-2.3-3.3-2.3 3.3-1.7-.8L7 14v-3.3l-1.5.8-1-1.5Z'), line(D(9.5, 10) + D(9.5, 12.2)), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('party-hat-upload', 'Upload Party Hat', ['upload', 'send', 'export', 'party hat', 'party-hat'], [body(C(9.5, 3.2, 1.1)), body(poly([[4.5, 17], [9.5, 4.6], [14.5, 17]], 0.8, true)), line('M7.2 11.5l4.6-2M6 15l7-3'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('ferris-wheel-upload', 'Upload Ferris Wheel', ['upload', 'send', 'export', 'ferris wheel', 'ferris-wheel'], [line(C(9.5, 9, 5.5)), line(D(9.5, 9)), line('M9.5 3.5v11M4 9h11M5.6 5.1l7.8 7.8M13.4 5.1l-7.8 7.8'), line('M7 18 9.5 9.2 12 18M5.5 18h8'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('snow-globe-upload', 'Upload Snow Globe', ['upload', 'send', 'export', 'snow globe', 'snow-globe'], [body(C(9.5, 9, 5.5)), line(D(7.5, 7) + D(11, 6.5) + D(9.5, 9.5) + D(7, 11)), body('M4.5 14.5h10l-1 3.5h-8Z'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('ornament-upload', 'Upload Bauble', ['upload', 'send', 'export', 'bauble', 'ornament'], [line('M9.5 3v2.5'), body(R(8, 5, 3, 2, 0.5)), body(C(9.5, 12, 5)), line('M4.8 11c3 1.5 6.4 1.5 9.4 0'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
