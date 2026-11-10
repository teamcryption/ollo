import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'home',
  icons: [
    icon('windchime', 'Wind Chime', ['chimes', 'porch', 'garden decor', 'breeze', 'zen'], [line('M5 6h14M12 6V3.5'), line('M7 6v3M10.5 6v4M13.5 6v3M17 6v2.5'), body(R(6, 9, 2, 6, 1)), body(R(9.5, 10, 2, 8, 1)), body(R(12.5, 9, 2, 6.5, 1)), body(R(16, 8.5, 2, 5, 1))], { noAccent: true }),
    icon('dreamcatcher', 'Dreamcatcher', ['dream catcher', 'boho', 'decor', 'feathers', 'charm'], [line(C(12, 9, 5.5)), line(star(12, 9, 3, 1.5, 6, 0.3)), line('M8.5 13.5v3M12 14.5v2.5M15.5 13.5v3'), body(E(8.5, 18.5, 1.2, 2.2)), body(E(12, 19, 1.2, 2)), body(E(15.5, 18.5, 1.2, 2.2))], { noAccent: true }),
    icon('dish-rack', 'Dish Rack', ['drying rack', 'plates', 'kitchen', 'dishes', 'washing up'], [line('M3.5 17h17M5 17v3M19 17v3'), body(E(8, 11, 1.6, 5)), body(E(12, 11, 1.6, 5)), body(E(16, 11, 1.6, 5))], { noAccent: true }),
    icon('compost', 'Compost Bin', ['compost', 'organic waste', 'recycling', 'garden', 'food waste'], [line('M4 6h16'), body(R(5, 8, 14, 12.5, 2)), accent('M10 16c0-2.5 1.8-4 4.5-4 0 2.5-1.8 4-4.5 4Z')]),
  ],
};
