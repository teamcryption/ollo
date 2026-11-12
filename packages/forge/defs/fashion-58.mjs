import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'fashion',
  icons: [
    icon('lipstick-bulb', 'Lipstick Ideas', ['idea', 'tip', 'insight', 'lipstick', 'lipstick'], [body('M7.5 9.5V5.7l4-2.2v6Z'), body(R(6.5, 10.5, 6, 7.5, 1)), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('necktie-bulb', 'Tie Ideas', ['idea', 'tip', 'insight', 'tie', 'necktie'], [body(poly([[8, 3.5], [11, 3.5], [10.6, 6], [8.4, 6]], 0.5, true)), body(poly([[8.3, 7.2], [10.7, 7.2], [12.5, 15], [9.5, 18], [6.5, 15]], 0.6, true)), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('comb-bulb', 'Comb Ideas', ['idea', 'tip', 'insight', 'comb', 'comb'], [body(R(3, 6, 13, 4, 1.2)), line('M4.5 10.2v4M6.5 10.2v4M8.5 10.2v4M10.5 10.2v4M12.5 10.2v4M14.5 10.2v4'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('sewing-machine-bulb', 'Sewing Machine Ideas', ['idea', 'tip', 'insight', 'sewing machine', 'sewing-machine'], [body('M3.5 7a2 2 0 0 1 2-2h9a1.5 1.5 0 0 1 1.5 1.5V17H12v-7H6.5V12H3.5Z'), line('M8.5 12.3v2.2'), body(R(3, 16, 13, 2, 0.6)), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('cowboy-hat-filter', 'Filter Cowboy Hat', ['filter', 'sort', 'refine', 'cowboy hat', 'cowboy-hat'], [body('M6.5 11c0-3 1-5.5 3-5.5s3 2.5 3 5.5Z'), line('M3 11.5c1.5 2 4 2.5 6.5 2.5S14.5 13.5 16 11.5'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('trousers-filter', 'Filter Trousers', ['filter', 'sort', 'refine', 'trousers', 'trousers'], [body('M5 3.5h9l.5 14.5h-3.3L9.5 9 8.3 18H5Z'), line('M5.2 6h8.6'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
