import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'science',
  icons: [
    icon('dna-pencil', 'Edit DNA', ['edit', 'write', 'modify', 'dna', 'dna'], [line('M6 3.5c0 4 7 4 7 8s-7 4-7 8M13 3.5c0 4-7 4-7 8s7 4 7 8M7.5 6.5h4M7.5 16.5h4'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('magnet-pencil', 'Edit Magnet', ['edit', 'write', 'modify', 'magnet', 'magnet'], [body('M4.5 4h3.3v6.5a1.7 1.7 0 0 0 3.4 0V4h3.3v6.5a5 5 0 0 1-10 0Z'), line('M4.7 7.3h2.9M11.4 7.3h2.9'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('telescope-pencil', 'Edit Telescope', ['edit', 'write', 'modify', 'telescope', 'telescope'], [body(poly([[3.5, 10], [12.5, 5], [14, 8], [5, 13]], 0.8, true)), line('M8.5 11.5 6 18M9.5 11 12 18'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
