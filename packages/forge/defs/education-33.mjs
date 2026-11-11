import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'education',
  icons: [
    icon('whiteboard-pencil', 'Edit Whiteboard', ['edit', 'write', 'modify', 'whiteboard', 'whiteboard'], [body(R(3, 3.5, 13, 9, 1.2)), line('M5.5 7l2-1.3 2 1.8 2.5-2.5'), line('M6.5 12.7 5 18M12.5 12.7 14 18'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
