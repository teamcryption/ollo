import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'interface',
  icons: [
    icon('bookmark-search', 'Find Bookmark', ['saved items search', 'lookup', 'reading list', 'bookmark', 'bookmark'], [body('M5 3.5h8a1 1 0 0 1 1 1v14l-5-3.5L4 18.5v-14a1 1 0 0 1 1-1Z'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('bookmark-clock', 'Read Later', ['saved for later', 'reading list', 'queue', 'bookmark', 'bookmark'], [body('M5 3.5h8a1 1 0 0 1 1 1v14l-5-3.5L4 18.5v-14a1 1 0 0 1 1-1Z'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('bookmark-heart', 'Favourite Bookmark', ['loved saved item', 'favourite', 'collection', 'bookmark', 'bookmark'], [body('M5 3.5h8a1 1 0 0 1 1 1v14l-5-3.5L4 18.5v-14a1 1 0 0 1 1-1Z'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
  ],
};
