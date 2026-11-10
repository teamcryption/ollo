import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'interface',
  icons: [
    icon('number-input', 'Number Input', ['stepper', 'quantity', 'counter', 'increment', 'form'], [body(R(3, 8, 18, 8, 2.5)), line('M10 8.2v7.6M14 8.2v7.6'), line('M5 12h3M15.5 12h3M17 10.5v3')], { noAccent: true }),
    icon('mega-menu', 'Mega Menu', ['navigation menu', 'dropdown menu', 'site nav', 'menu panel', 'website'], [body(R(3.5, 4, 17, 16, 2.5)), line('M3.7 8.5h16.6'), line('M7 12h3M7 15h3M14 12h3M14 15h3')], { noAccent: true }),
  ],
};
