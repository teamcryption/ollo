import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'media',
  icons: [
    icon('headphones-star', 'Featured Headphones', ['featured', 'top rated', 'best', 'headphones', 'headphones'], [line('M4 13v-3a5.5 5.5 0 0 1 11 0v3'), body(R(3, 12, 3, 5, 1.2)), body(R(13, 12, 3, 5, 1.2)), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('mic-star', 'Featured Mic', ['featured', 'top rated', 'best', 'mic', 'mic'], [body(R(6.5, 3, 6, 9, 3)), line('M4.5 9.5a5 5 0 0 0 10 0M9.5 14.5V17'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('headphones-alert', 'Headphones Alert', ['alert', 'warning', 'problem', 'headphones', 'headphones'], [line('M4 13v-3a5.5 5.5 0 0 1 11 0v3'), body(R(3, 12, 3, 5, 1.2)), body(R(13, 12, 3, 5, 1.2)), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('tv-alert', 'TV Alert', ['alert', 'warning', 'problem', 'tv', 'tv'], [line('M7 3.5 9.5 5.5 12 3.5'), body(R(3, 5.5, 13, 9, 1.5)), line('M6.5 17h6'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('mic-alert', 'Mic Alert', ['alert', 'warning', 'problem', 'mic', 'mic'], [body(R(6.5, 3, 6, 9, 3)), line('M4.5 9.5a5 5 0 0 0 10 0M9.5 14.5V17'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('film-alert', 'Film Alert', ['alert', 'warning', 'problem', 'film', 'film'], [body(R(4, 3.5, 11, 14, 1.5)), line('M6.5 3.7v13.6M12.5 3.7v13.6M4.2 10.5h2.3M12.5 10.5h2.3'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
  ],
};
