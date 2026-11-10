import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'weather',
  icons: [
    icon('cloud-wind', 'Windy Cloud', ['wind', 'breezy', 'gusts', 'weather', 'blustery'], [body('M7 15a3.8 3.8 0 0 1-.5-7.6 5.5 5.5 0 0 1 10.6 1A3.3 3.3 0 0 1 17 15Z'), line('M4.5 18h11a1.5 1.5 0 1 1-1.5 1.5'), accent(L(6.5, 21, 10.5, 21))]),
    icon('temperature-high', 'High Temperature', ['heat', 'hot', 'rising temperature', 'warm', 'weather'], [body('M10 5.5a2 2 0 0 1 4 0v8.1a4 4 0 1 1-4 0Z'), accent(L(12, 9, 12, 16.5)), line('M18 10V4.5M16 6.5l2-2 2 2')]),
    icon('temperature-low', 'Low Temperature', ['cold', 'freezing', 'falling temperature', 'chilly', 'weather'], [body('M10 5.5a2 2 0 0 1 4 0v8.1a4 4 0 1 1-4 0Z'), accent(L(12, 9, 12, 16.5)), line('M18 4.5V10M16 8l2 2 2-2')]),
  ],
};
