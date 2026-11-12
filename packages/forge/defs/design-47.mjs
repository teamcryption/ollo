import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'design',
  icons: [
    icon('layout-grid-pricing', 'Layout Grid Pricing', ['pricing', 'cost', 'money', 'layout grid', 'layout-grid'], [body(R(3, 3.5, 6, 6, 1)), body(R(10, 3.5, 6, 6, 1)), body(R(3, 11, 6, 6, 1)), body(R(10, 11, 6, 6, 1)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('bezier-pricing', 'Bezier Pricing', ['pricing', 'cost', 'money', 'bezier', 'bezier'], [line('M3.5 16C5 9 14 12 15.5 5'), body(R(2, 14.5, 3, 3, 0.6)), body(R(14, 3.5, 3, 3, 0.6)), line('M3.5 16 9 9.5'), line(C(9, 9.5, 0.01)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
  ],
};
