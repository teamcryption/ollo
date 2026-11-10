import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'security',
  icons: [
    icon('laser-hazard', 'Laser Hazard', ['laser', 'radiation', 'beam', 'warning sign', 'hazard'], [body(poly([[12, 3.5], [21, 19.5], [3, 19.5]], 1.5, true)), accent(star(12, 14.5, 2.8, 1, 8, 0.1))]),
    icon('magnetic-field', 'Magnetic Field', ['magnet', 'mri', 'magnetism', 'warning sign', 'hazard'], [body(poly([[12, 3.5], [21, 19.5], [3, 19.5]], 1.5, true)), accent('M10 16.5v-3a2 2 0 0 1 4 0v3')]),
    icon('deep-water', 'Deep Water', ['drowning', 'water', 'swimming', 'warning sign', 'hazard'], [body(poly([[12, 3.5], [21, 19.5], [3, 19.5]], 1.5, true)), accent(scaleD('M8.5 14.5c1.2-1 2.3-1 3.5 0s2.3 1 3.5 0M8.5 17c1.2-1 2.3-1 3.5 0s2.3 1 3.5 0', 0.75, 12, 15))]),
    icon('no-weapons', 'No Weapons', ['weapons prohibited', 'no knives', 'security', 'prohibited', 'sign'], [body(poly([[12, 6], [13.3, 8], [13.3, 14], [10.7, 14], [10.7, 8]], 0.5, true)), line('M9 15h6M12 15v3'), line('M6 6l12 12'), line(C(12, 12, 8.5))], { noAccent: true }),
  ],
};
