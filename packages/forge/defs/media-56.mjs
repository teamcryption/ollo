import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'media',
  icons: [
    icon('film-reel-bolt', 'Instant Film Reel', ['quick', 'fast', 'instant', 'film reel', 'film-reel'], [body(C(9.5, 10.5, 6.5)), line(C(9.5, 7, 1.3) + C(9.5, 14, 1.3) + C(6, 10.5, 1.3) + C(13, 10.5, 1.3)), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('film-reel-star', 'Featured Film Reel', ['featured', 'top rated', 'best', 'film reel', 'film-reel'], [body(C(9.5, 10.5, 6.5)), line(C(9.5, 7, 1.3) + C(9.5, 14, 1.3) + C(6, 10.5, 1.3) + C(13, 10.5, 1.3)), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('film-reel-alert', 'Film Reel Alert', ['alert', 'warning', 'problem', 'film reel', 'film-reel'], [body(C(9.5, 10.5, 6.5)), line(C(9.5, 7, 1.3) + C(9.5, 14, 1.3) + C(6, 10.5, 1.3) + C(13, 10.5, 1.3)), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('film-reel-user', 'Film Reel Account', ['user', 'account', 'profile', 'film reel', 'film-reel'], [body(C(9.5, 10.5, 6.5)), line(C(9.5, 7, 1.3) + C(9.5, 14, 1.3) + C(6, 10.5, 1.3) + C(13, 10.5, 1.3)), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('film-reel-pencil', 'Edit Film Reel', ['edit', 'write', 'modify', 'film reel', 'film-reel'], [body(C(9.5, 10.5, 6.5)), line(C(9.5, 7, 1.3) + C(9.5, 14, 1.3) + C(6, 10.5, 1.3) + C(13, 10.5, 1.3)), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
