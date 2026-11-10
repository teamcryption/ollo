import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'gaming',
  icons: [
    icon('trophy-lock', 'Locked Achievement', ['unlockable', 'hidden reward', 'badge', 'trophy', 'trophy'], [body('M5.5 4h8v3.5a4 4 0 0 1-8 0Z'), line('M5.5 5.5H4a1.5 1.5 0 0 0 0 3h1.7M13.5 5.5H15a1.5 1.5 0 0 1 0 3h-1.7M9.5 11.5V15'), body(R(6.5, 15.5, 6, 2.5, 0.8)), line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })], { noAccent: true }),
  ],
};
