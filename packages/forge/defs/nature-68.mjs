import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'nature',
  icons: [
    icon('sun-pricing', 'Sun Pricing', ['pricing', 'cost', 'money', 'sun', 'sun'], [body(C(9.5, 10.5, 3.2)), line('M9.5 3.5V5M9.5 16v1.5M2.5 10.5H4M15 10.5h1.5M4.6 5.6l1 1M13.4 14.4l1 1M14.4 5.6l-1 1M5.6 14.4l-1 1'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('cactus-pricing', 'Cactus Pricing', ['pricing', 'cost', 'money', 'cactus', 'cactus'], [body('M8 18V5.5a1.5 1.5 0 0 1 3 0V18Z'), line('M8 12H6a1.5 1.5 0 0 1-1.5-1.5V8.5M11 10h2a1.5 1.5 0 0 0 1.5-1.5V7'), line('M5 18h9'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('mushroom-pricing', 'Mushroom Pricing', ['pricing', 'cost', 'money', 'mushroom', 'mushroom'], [body('M3.5 10.5a6 6 0 0 1 12 0Z'), body('M7.5 10.7h4v5.3a2 2 0 0 1-4 0Z'), line(D(7, 7.5) + D(11.5, 6.8)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('plant-notice', 'Plant Notice', ['notice', 'important', 'attention', 'plant', 'plant'], [line('M9.5 11V8M9.5 8c-2 0-3.5-1.3-3.5-3.5 2 0 3.5 1.3 3.5 3.5Zm0 0c2 0 3.5-1.3 3.5-3.5-2 0-3.5 1.3-3.5 3.5Z'), body('M5 11h9l-1 6a1 1 0 0 1-1 .8H7a1 1 0 0 1-1-.8Z'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.5v2.6'), line(D(17, 18.6))], { noAccent: true }),
    icon('mountain-notice', 'Mountain Notice', ['notice', 'important', 'attention', 'mountain', 'mountain'], [body(poly([[2.5, 16.5], [7.5, 7], [10, 11], [12, 8], [16.5, 16.5]], 0.8, true)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.5v2.6'), line(D(17, 18.6))], { noAccent: true }),
  ],
};
