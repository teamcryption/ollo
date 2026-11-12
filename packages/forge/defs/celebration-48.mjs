import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'celebration',
  icons: [
    icon('gingerbread-bulb', 'Gingerbread Ideas', ['idea', 'tip', 'insight', 'gingerbread', 'gingerbread'], [body(C(9.5, 5, 2.2)), body('M6.5 8h6l2.5 2-1 1.5-1.5-.8V14l1.5 3.5-1.7.8-2.3-3.3-2.3 3.3-1.7-.8L7 14v-3.3l-1.5.8-1-1.5Z'), line(D(9.5, 10) + D(9.5, 12.2)), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('bouquet-bulb', 'Bouquet Ideas', ['idea', 'tip', 'insight', 'bouquet', 'bouquet'], [body(C(7, 6, 2)), body(C(12, 6, 2)), body(C(9.5, 4.5, 2)), body('M6 9.5h7l-2.5 8.5h-2Z'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('lantern-chinese-bulb', 'Lantern Chinese Ideas', ['idea', 'tip', 'insight', 'lantern chinese', 'lantern-chinese'], [line('M9.5 2.5V4'), body(R(7, 4, 5, 1.5, 0.5)), body(E(9.5, 10.5, 5.5, 4.8)), body(R(7, 15.5, 5, 1.5, 0.5)), line('M9.5 17.2v1.5M7.5 6.3c-1.3 2.5-1.3 6 0 8.4M11.5 6.3c1.3 2.5 1.3 6 0 8.4'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('champagne-glasses-bulb', 'Champagne Glasses Ideas', ['idea', 'tip', 'insight', 'champagne glasses', 'champagne-glasses'], [body('M3.5 4h4l-.3 3.5a1.7 1.7 0 0 1-3.4 0Z'), body('M11.5 4h4l-.3 3.5a1.7 1.7 0 0 1-3.4 0Z'), line('M5.5 9.3V16M3.5 16.5h4M13.5 9.3V16M11.5 16.5h4'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
  ],
};
