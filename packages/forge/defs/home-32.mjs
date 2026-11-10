import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'home',
  icons: [
    icon('toilet-paper', 'Toilet Paper', ['tissue roll', 'bathroom', 'loo roll', 'hygiene', 'supplies'], [body(C(8, 10, 4.5)), line(C(8, 10, 1.5)), line('M8 5.5h7.5a4.5 4.5 0 0 1 4.5 4.5v10M12.5 10v10H20')], { noAccent: true }),
    icon('umbrella-stand', 'Umbrella Stand', ['umbrellas', 'hallway', 'entrance', 'rain', 'storage'], [line('M10 10V5.5a1.8 1.8 0 0 0-3.6 0M14.5 10V4.5a1.8 1.8 0 0 1 3.6 0'), body(R(7, 10, 10, 10.5, 2))], { noAccent: true }),
  ],
};
