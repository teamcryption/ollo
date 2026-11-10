import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'communication',
  icons: [
    icon('newspaper-clock', 'Daily Edition', ['morning news', 'today', 'latest edition', 'news', 'newspaper'], [body(R(3, 4, 12.5, 13, 1.5)), line(R(5.5, 6.5, 4, 3.5, 0.5)), line('M11.5 7h1.5M11.5 9.5h1.5M5.5 12.5h7.5M5.5 15h5'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('newspaper-star', 'Featured Story', ['top story', 'headline', 'editors pick', 'news', 'newspaper'], [body(R(3, 4, 12.5, 13, 1.5)), line(R(5.5, 6.5, 4, 3.5, 0.5)), line('M11.5 7h1.5M11.5 9.5h1.5M5.5 12.5h7.5M5.5 15h5'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('newspaper-search', 'Search News', ['news search', 'articles', 'archive', 'news', 'newspaper'], [body(R(3, 4, 12.5, 13, 1.5)), line(R(5.5, 6.5, 4, 3.5, 0.5)), line('M11.5 7h1.5M11.5 9.5h1.5M5.5 12.5h7.5M5.5 15h5'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('newspaper-lock', 'Paywall', ['subscriber only', 'premium article', 'locked', 'news', 'newspaper'], [body(R(3, 4, 12.5, 13, 1.5)), line(R(5.5, 6.5, 4, 3.5, 0.5)), line('M11.5 7h1.5M11.5 9.5h1.5M5.5 12.5h7.5M5.5 15h5'), line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })], { noAccent: true }),
    icon('newspaper-pin', 'Local News', ['nearby news', 'community', 'local stories', 'news', 'newspaper'], [body(R(3, 4, 12.5, 13, 1.5)), line(R(5.5, 6.5, 4, 3.5, 0.5)), line('M11.5 7h1.5M11.5 9.5h1.5M5.5 12.5h7.5M5.5 15h5'), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
  ],
};
