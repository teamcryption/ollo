import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'travel',
  icons: [
    icon('no-camping', 'No Camping', ['camping prohibited', 'tent', 'park', 'prohibited', 'sign'], [line('M7.5 16.5 12 8l4.5 8.5ZM12 16.5v-3'), line('M6 6l12 12'), line(C(12, 12, 8.5))], { noAccent: true }),
    icon('no-fires', 'No Open Fires', ['fires prohibited', 'no campfire', 'flame', 'prohibited', 'sign'], [body(scaleD('M12 16.5c-1.8 0-3-1.2-3-2.8 0-1.5 1-2.3 1.6-3.5.4 1 1 1.4 1.5 1.5.2-1.5.9-2.6 2-3.5.3 1.6 1.9 2.7 1.9 4.6 0 2.1-1.4 3.7-4 3.7Z', 0.9, 12, 12)), line('M6 6l12 12'), line(C(12, 12, 8.5))], { noAccent: true }),
  ],
};
