import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'actions',
  icons: [
    icon('trash-2', 'Trash Alt', ['delete', 'remove', 'bin', 'garbage'], [line('M4 6.5h16M9.5 6.5V4.5h5v2'), body('M6 6.5h12l-1 12.5a1.5 1.5 0 0 1-1.5 1.4h-7A1.5 1.5 0 0 1 7 19Z'), accent(L(12, 10.5, 12, 16))]),
    icon('bookmark-2', 'Bookmark Alt', ['save', 'favorite', 'saved', 'later'], [body('M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5v16l-6-4-6 4Z'), accent(L(9.5, 7.5, 14.5, 7.5))]),
    icon('share-2', 'Share Alt', ['send', 'export', 'forward', 'social'], [line('M12 3.5v11M8 7.5l4-4 4 4'), line('M8 11H6.5A1.5 1.5 0 0 0 5 12.5v6A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-6a1.5 1.5 0 0 0-1.5-1.5H16'), accent(L(9.5, 17, 14.5, 17))]),
  ],
};
