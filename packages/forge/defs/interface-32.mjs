import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'interface',
  icons: [
    icon('bookmark-star', 'Starred Bookmark', ['important saved item', 'priority', 'favourite', 'bookmark', 'bookmark'], [body('M5 3.5h8a1 1 0 0 1 1 1v14l-5-3.5L4 18.5v-14a1 1 0 0 1 1-1Z'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('bookmark-lock', 'Private Bookmark', ['hidden saved item', 'locked collection', 'private', 'bookmark', 'bookmark'], [body('M5 3.5h8a1 1 0 0 1 1 1v14l-5-3.5L4 18.5v-14a1 1 0 0 1 1-1Z'), line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })], { noAccent: true }),
  ],
};
