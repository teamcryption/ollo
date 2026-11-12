import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'animals',
  icons: [
    icon('fox-pricing', 'Fox Pricing', ['pricing', 'cost', 'money', 'fox', 'fox'], [body(poly([[3.5, 4], [7.5, 7], [11.5, 7], [15.5, 4], [14.5, 10], [9.5, 16], [4.5, 10]], 0.8, true)), line(D(7.5, 10) + D(11.5, 10)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('horseshoe-pricing', 'Horseshoe Pricing', ['pricing', 'cost', 'money', 'horseshoe', 'horseshoe'], [body('M4 16.5V9.5a5.5 5.5 0 0 1 11 0v7h-3.2v-7a2.3 2.3 0 0 0-4.6 0v7Z'), line(D(5.6, 11) + D(5.6, 14)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('octopus-pricing', 'Octopus Pricing', ['pricing', 'cost', 'money', 'octopus', 'octopus'], [body('M5 9.5a4.5 4.5 0 0 1 9 0v2H5Z'), line(D(7.8, 9) + D(11.2, 9)), line('M5.6 11.7c-.3 2.4-1.5 3.9-2.5 4.4M8 11.7c0 2.5-.5 4.5-1.5 6M11 11.7c0 2.5.5 4.5 1.5 6M13.4 11.7c.3 2.4 1.5 3.9 2.5 4.4'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('giraffe-pricing', 'Giraffe Pricing', ['pricing', 'cost', 'money', 'giraffe', 'giraffe'], [body('M10 3.5h3l.5 2.5-2 1V18H7v-6.5c0-1.5.8-2.3 2-2.5l.5-1.5Z'), line(D(8.5, 14) + D(10, 12)), line('M10.5 3.5V2.6M12.5 3.5V2.6'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('dolphin-pricing', 'Dolphin Pricing', ['pricing', 'cost', 'money', 'dolphin', 'dolphin'], [body('M3 13c2-5 6.5-8 11-7.5l-1 2c2 1 3 2.5 3 4.5l-2.5-1c-2.5 1.8-6 2.5-10.5 2Z'), line('M7.5 13.3l-1 3 2.5-1.5'), line(D(12.5, 9)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('paw-notice', 'Pet Notice', ['notice', 'important', 'attention', 'pet', 'paw'], [body(C(9.5, 12.5, 2.8)), body(C(5.5, 9, 1.3)), body(C(8.3, 6.2, 1.3)), body(C(11.7, 6.2, 1.3)), body(C(13.5, 9, 1.3)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.5v2.6'), line(D(17, 18.6))], { noAccent: true }),
  ],
};
