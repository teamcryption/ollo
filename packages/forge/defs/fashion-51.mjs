import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'fashion',
  icons: [
    icon('scissors-pause', 'Pause Scissors', ['pause', 'hold', 'stop', 'scissors', 'scissors'], [line('M7.3 11.5 14 4M11.7 11.5 5 4'), body(C(5.5, 14, 2.2)), body(C(13.5, 14, 2.2)), body(R(13.5, 13, 2.8, 7.5, 1), { cover: true }), body(R(17.7, 13, 2.8, 7.5, 1), { cover: true })], { noAccent: true }),
    icon('heels-pause', 'Pause High Heels', ['pause', 'hold', 'stop', 'high heels', 'heels'], [body('M3 15c0-1.5 1-2.5 2.5-2.5H8c2 0 3-3 5-6 1-1.5 3-1 3 .5V9l-2 1v7.5h-1.5V12L9.5 15.5H3Z'), body(R(13.5, 13, 2.8, 7.5, 1), { cover: true }), body(R(17.7, 13, 2.8, 7.5, 1), { cover: true })], { noAccent: true }),
    icon('trousers-pause', 'Pause Trousers', ['pause', 'hold', 'stop', 'trousers', 'trousers'], [body('M5 3.5h9l.5 14.5h-3.3L9.5 9 8.3 18H5Z'), line('M5.2 6h8.6'), body(R(13.5, 13, 2.8, 7.5, 1), { cover: true }), body(R(17.7, 13, 2.8, 7.5, 1), { cover: true })], { noAccent: true }),
    icon('shirt-leaf', 'Eco Shirt', ['eco', 'green', 'sustainable', 'shirt', 'shirt'], [body(poly([[6, 3.5], [13, 3.5], [16, 6.5], [14, 9], [13, 8], [13, 16.5], [6, 16.5], [6, 8], [5, 9], [3, 6.5]], 0.8, true)), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('scissors-leaf', 'Eco Scissors', ['eco', 'green', 'sustainable', 'scissors', 'scissors'], [line('M7.3 11.5 14 4M11.7 11.5 5 4'), body(C(5.5, 14, 2.2)), body(C(13.5, 14, 2.2)), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('dress-leaf', 'Eco Dress', ['eco', 'green', 'sustainable', 'dress', 'dress'], [body(poly([[7.5, 3.5], [11.5, 3.5], [11, 7.5], [15, 17.5], [4, 17.5], [8, 7.5]], 0.8, true)), line('M8.3 7.6h2.4'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('sock-leaf', 'Eco Sock', ['eco', 'green', 'sustainable', 'sock', 'sock'], [body('M7 3.5h5v7.5l-3.6 5.3a2.4 2.4 0 0 1-4-2.7L7 10.2Z'), line('M7.2 6.2h4.6'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('lipstick-leaf', 'Eco Lipstick', ['eco', 'green', 'sustainable', 'lipstick', 'lipstick'], [body('M7.5 9.5V5.7l4-2.2v6Z'), body(R(6.5, 10.5, 6, 7.5, 1)), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('necktie-leaf', 'Eco Tie', ['eco', 'green', 'sustainable', 'tie', 'necktie'], [body(poly([[8, 3.5], [11, 3.5], [10.6, 6], [8.4, 6]], 0.5, true)), body(poly([[8.3, 7.2], [10.7, 7.2], [12.5, 15], [9.5, 18], [6.5, 15]], 0.6, true)), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('baseball-cap-leaf', 'Eco Baseball Cap', ['eco', 'green', 'sustainable', 'baseball cap', 'baseball-cap'], [body('M4 12a5.7 5.7 0 0 1 11.4 0Z'), line('M15.5 12.6H6c-1.6 0-2.8.8-3.5 2'), line(D(9.7, 6.8)), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('necklace-leaf', 'Eco Necklace', ['eco', 'green', 'sustainable', 'necklace', 'necklace'], [line('M4.5 3.5c0 5 2.3 8.5 5 8.5s5-3.5 5-8.5'), body('M9.5 12.6l1.8 2.3-1.8 2.3-1.8-2.3Z'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('nail-polish-leaf', 'Eco Nail Polish', ['eco', 'green', 'sustainable', 'nail polish', 'nail-polish'], [body(R(8, 3, 3, 6, 1)), body(R(5, 9.5, 9, 8.5, 2.5)), line('M7.5 13.6h4'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('sunglasses-leaf', 'Eco Sunglasses', ['eco', 'green', 'sustainable', 'sunglasses', 'sunglasses'], [line('M2.5 8h14'), body('M3 8.2h5.5v2.3a2.7 2.7 0 0 1-5.5 0Z'), body('M10.5 8.2H16v2.3a2.7 2.7 0 0 1-5.5 0Z'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
  ],
};
