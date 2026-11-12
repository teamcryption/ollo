import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'education',
  icons: [
    icon('math-symbols-pricing', 'Math Symbols Pricing', ['pricing', 'cost', 'money', 'math symbols', 'math-symbols'], [line('M6 3.5v5M3.5 6h5M11 6h5M3.8 13.2l4.4 4.4M8.2 13.2l-4.4 4.4M11 14h5M11 17h5'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('language-pricing', 'Language Pricing', ['pricing', 'cost', 'money', 'language', 'language'], [body(R(3, 3.5, 8.5, 8, 1.5)), line('M5 6h4.5M7.25 5v1M8.5 6c-.5 2-1.8 3.3-3.5 3.8M6 7.5c.5 1 1.3 1.8 2.5 2.2'), body(R(9.5, 9, 7, 8, 1.5)), line('M11.5 15l1.5-4 1.5 4M12 14h2'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('cap-notice', 'Graduation Notice', ['notice', 'important', 'attention', 'graduation', 'cap'], [body(poly([[2.5, 8], [9.5, 4.5], [16.5, 8], [9.5, 11.5]], 0.6, true)), line('M5.5 9.8v3c1.2 1.2 2.6 1.8 4 1.8s2.8-.6 4-1.8v-3'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.5v2.6'), line(D(17, 18.6))], { noAccent: true }),
  ],
};
