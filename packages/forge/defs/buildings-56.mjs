import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'buildings',
  icons: [
    icon('pyramid-pricing', 'Pyramid Pricing', ['pricing', 'cost', 'money', 'pyramid', 'pyramid'], [body(poly([[9.5, 4], [16.5, 17.5], [2.5, 17.5]], 0.8, true)), line('M9.5 4.5 12 17.3'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('blueprint-pricing', 'Blueprint Pricing', ['pricing', 'cost', 'money', 'blueprint', 'blueprint'], [body(R(3, 4, 13, 12, 1.2)), line('M5.5 6.5v7h4v-4h4'), line('M13.5 13.5h-2'), line('M3.2 7h1.5'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('igloo-pricing', 'Igloo Pricing', ['pricing', 'cost', 'money', 'igloo', 'igloo'], [body('M3 16a6.5 6.5 0 0 1 13 0Z'), line('M7.8 16v-2.3a1.7 1.7 0 0 1 3.4 0V16M4.3 12.5h3.2M11.5 12.5h3.2'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('factory-notice', 'Factory Notice', ['notice', 'important', 'attention', 'factory', 'factory'], [body(poly([[3, 16.5], [3, 9], [7, 11], [7, 9], [11, 11], [11, 4.5], [15.5, 4.5], [15.5, 16.5]], 0.8, true)), line('M6 14h2M10 14h2'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.5v2.6'), line(D(17, 18.6))], { noAccent: true }),
  ],
};
