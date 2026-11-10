import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'people',
  icons: [
    icon('avatar-group', 'Avatar Group', ['team avatars', 'members', 'participants', 'collaborators', 'people'], [body(C(7, 12, 4)), body(C(12, 12, 4), { cover: true }), body(C(17, 12, 4), { cover: true }), line(C(17, 10.8, 1.3)), line('M14.8 14.5a2.4 2.4 0 0 1 4.4 0')], { noAccent: true }),
  ],
};
