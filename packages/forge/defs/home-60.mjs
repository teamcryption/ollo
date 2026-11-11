import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'home',
  icons: [
    icon('rocking-chair-pencil', 'Edit Rocking Chair', ['edit', 'write', 'modify', 'rocking chair', 'rocking-chair'], [line('M6 3.5v10M6 9.5h7.5l.5 4M3 15.5c3 2 9 2 13 0'), line('M6.5 13.5h7'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('coat-rack-pencil', 'Edit Coat Rack', ['edit', 'write', 'modify', 'coat rack', 'coat-rack'], [line('M9.5 4.5V17.5M6.5 18h6'), line('M9.5 6.5 6.5 5M9.5 6.5l3-1.5M9.5 9 7 8M9.5 9l2.5-1'), line(D(9.5, 3.5)), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
