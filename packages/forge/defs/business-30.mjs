import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'business',
  icons: [
    icon('contract-pencil', 'Edit Contract', ['edit', 'write', 'modify', 'contract', 'contract'], [body(R(4, 3.5, 11, 14, 1.5)), line('M6.5 7h6M6.5 9.5h6'), line('M6.5 14c.8-1.5 1.5-1.5 2 0s1.2 1.5 2 0'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('rocket-pencil', 'Edit Rocket', ['edit', 'write', 'modify', 'rocket', 'rocket'], [body('M9.5 3c2.2 1.6 3.3 4 3.3 7v4.5H6.2V10c0-3 1.1-5.4 3.3-7Z'), line('M6.2 11.5 4 14v3l2.2-1.5M12.8 11.5 15 14v3l-2.2-1.5'), line(C(9.5, 8.5, 1.3)), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('target-pencil', 'Edit Target', ['edit', 'write', 'modify', 'target', 'target'], [line(C(9.5, 10.5, 6.5)), line(C(9.5, 10.5, 3.5)), line(D(9.5, 10.5)), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
