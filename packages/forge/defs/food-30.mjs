import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'food',
  icons: [
    icon('ice-tray', 'Ice Tray', ['ice cube tray', 'freezer', 'frozen', 'kitchen', 'cold'], [body(R(3.5, 8, 17, 8, 2)), line('M3.7 12h16.6M7.75 8.2v7.6M12 8.2v7.6M16.25 8.2v7.6')], { noAccent: true }),
  ],
};
