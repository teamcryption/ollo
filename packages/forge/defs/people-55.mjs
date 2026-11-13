import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'people',
  icons: [
    icon('user-2', 'User Alt', ['person', 'profile', 'account', 'avatar'], [body(C(12, 8, 4)), line('M4.5 20.5c.8-4 3.8-6.5 7.5-6.5s6.7 2.5 7.5 6.5'), accent(L(19, 4, 20.5, 5.5))]),
    icon('user-4', 'User Card', ['person', 'profile', 'identity', 'badge'], [body(R(3, 4.5, 18, 15, 3)), line(C(12, 10, 2.3)), line('M8 17c.6-1.8 2.1-2.8 4-2.8s3.4 1 4 2.8'), accent(L(16.5, 7, 18.5, 7))]),
  ],
};
