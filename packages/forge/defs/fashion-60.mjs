import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'fashion',
  icons: [
    icon('scissors-pricing', 'Scissors Pricing', ['pricing', 'cost', 'money', 'scissors', 'scissors'], [line('M7.3 11.5 14 4M11.7 11.5 5 4'), body(C(5.5, 14, 2.2)), body(C(13.5, 14, 2.2)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('skirt-pricing', 'Skirt Pricing', ['pricing', 'cost', 'money', 'skirt', 'skirt'], [body(R(5.5, 4, 8, 2.2, 0.6)), body(poly([[6, 7.3], [13, 7.3], [16, 17.5], [3, 17.5]], 0.8, true)), line('M8.3 7.7 7.3 17M10.7 7.7l1 9.3'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('thimble-pricing', 'Thimble Pricing', ['pricing', 'cost', 'money', 'thimble', 'thimble'], [body('M5.5 17V9a4 4 0 0 1 8 0v8Z'), line(D(8, 9) + D(11, 9) + D(9.5, 11.5) + D(8, 14) + D(11, 14)), line('M4.5 17.5h10'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('heels-pricing', 'High Heels Pricing', ['pricing', 'cost', 'money', 'high heels', 'heels'], [body('M3 15c0-1.5 1-2.5 2.5-2.5H8c2 0 3-3 5-6 1-1.5 3-1 3 .5V9l-2 1v7.5h-1.5V12L9.5 15.5H3Z'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('hair-dryer-pricing', 'Hair Dryer Pricing', ['pricing', 'cost', 'money', 'hair dryer', 'hair-dryer'], [body('M3.5 7a3.5 3.5 0 0 1 3.5-3.5h6l2.5 1.5v4L13 10.5H7A3.5 3.5 0 0 1 3.5 7Z'), line(C(7, 7, 1.2)), body(R(8, 11, 3, 7, 1.2)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('shirt-notice', 'Shirt Notice', ['notice', 'important', 'attention', 'shirt', 'shirt'], [body(poly([[6, 3.5], [13, 3.5], [16, 6.5], [14, 9], [13, 8], [13, 16.5], [6, 16.5], [6, 8], [5, 9], [3, 6.5]], 0.8, true)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.5v2.6'), line(D(17, 18.6))], { noAccent: true }),
  ],
};
