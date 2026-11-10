import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'education',
  icons: [
    icon('protractor-pencil', 'Edit Protractor', ['edit', 'write', 'modify', 'protractor', 'protractor'], [body('M3 15.5a6.5 6.5 0 0 1 13 0Z'), line('M6.5 15.3a3 3 0 0 1 6 0'), line('M9.5 9.2v1.2M5.3 11.3l.9.8M13.7 11.3l-.9.8'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
