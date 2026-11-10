import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'media',
  icons: [
    icon('metronome-pencil', 'Edit Metronome', ['edit', 'write', 'modify', 'metronome', 'metronome'], [body(poly([[7, 3.5], [12, 3.5], [15, 18], [4, 18]], 0.8, true)), line('M5.3 14.5h8.4'), line('M9.5 14.3l2.8-7.8'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
