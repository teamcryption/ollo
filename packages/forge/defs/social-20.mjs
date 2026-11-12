import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'social',
  icons: [
    icon('hashtag-fire', 'Trending Hashtag', ['trending', 'hot', 'popular', 'hashtag', 'hashtag'], [line('M7.5 4 6 17M12.5 4 11 17M4 8h12M3.5 13h12'), body('M17 12c2 1.8 3.6 3.6 3.6 5.6a3.6 3.6 0 0 1-7.2 0c0-1.4.7-2.5 1.6-3.4.2 1 .7 1.7 1.4 1.9-.3-1.7.1-3 .6-4.1Z', { cover: true })], { noAccent: true }),
  ],
};
