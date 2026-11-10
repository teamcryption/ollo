import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'development',
  icons: [
    icon('server-search', 'Search Server', ['search', 'find', 'lookup', 'server', 'server'], [body(R(3.5, 4, 12, 5.5, 1.5)), body(R(3.5, 11.5, 12, 5.5, 1.5)), line(D(6.5, 6.8) + D(6.5, 14.3)), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('server-bolt', 'Instant Server', ['quick', 'fast', 'instant', 'server', 'server'], [body(R(3.5, 4, 12, 5.5, 1.5)), body(R(3.5, 11.5, 12, 5.5, 1.5)), line(D(6.5, 6.8) + D(6.5, 14.3)), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('server-heart', 'Favourite Server', ['favourite', 'saved', 'like', 'server', 'server'], [body(R(3.5, 4, 12, 5.5, 1.5)), body(R(3.5, 11.5, 12, 5.5, 1.5)), line(D(6.5, 6.8) + D(6.5, 14.3)), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('server-star', 'Featured Server', ['featured', 'top rated', 'best', 'server', 'server'], [body(R(3.5, 4, 12, 5.5, 1.5)), body(R(3.5, 11.5, 12, 5.5, 1.5)), line(D(6.5, 6.8) + D(6.5, 14.3)), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('server-alert', 'Server Alert', ['alert', 'warning', 'problem', 'server', 'server'], [body(R(3.5, 4, 12, 5.5, 1.5)), body(R(3.5, 11.5, 12, 5.5, 1.5)), line(D(6.5, 6.8) + D(6.5, 14.3)), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
  ],
};
