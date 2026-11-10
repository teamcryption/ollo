import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'weather',
  icons: [
    icon('snowflake-pencil', 'Edit Snowflake', ['edit', 'write', 'modify', 'snowflake', 'snowflake'], [line('M9.5 3.5v14M3.4 7l12.2 7M3.4 14l12.2-7'), line('M7.8 4.7l1.7 1.6 1.7-1.6M7.8 16.3l1.7-1.6 1.7 1.6'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
