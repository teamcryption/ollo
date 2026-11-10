import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'development',
  icons: [
    icon('branch-heart', 'Favourite Branch', ['favourite', 'saved', 'like', 'branch', 'branch'], [line(C(5, 5, 1.8) + C(5, 15, 1.8) + C(13, 7, 1.8)), line('M5 6.8v6.4M13 8.8c0 3-3 3.2-6.5 4.8'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('terminal-heart', 'Favourite Terminal', ['favourite', 'saved', 'like', 'terminal', 'terminal'], [body(R(3, 4, 13, 11, 1.5)), line('M5.5 8l2 1.5-2 1.5M9.5 12h3'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('bug-heart', 'Favourite Bug', ['favourite', 'saved', 'like', 'bug', 'bug'], [body(E(9.5, 11, 3.5, 4.5)), line('M6 8 4 6.5M13 8l2-1.5M6 11H3.5M13 11h2.5M6.5 14l-2 1.5M12.5 14l2 1.5M9.5 6.5V15.5'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('branch-star', 'Featured Branch', ['featured', 'top rated', 'best', 'branch', 'branch'], [line(C(5, 5, 1.8) + C(5, 15, 1.8) + C(13, 7, 1.8)), line('M5 6.8v6.4M13 8.8c0 3-3 3.2-6.5 4.8'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('terminal-star', 'Featured Terminal', ['featured', 'top rated', 'best', 'terminal', 'terminal'], [body(R(3, 4, 13, 11, 1.5)), line('M5.5 8l2 1.5-2 1.5M9.5 12h3'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('bug-star', 'Featured Bug', ['featured', 'top rated', 'best', 'bug', 'bug'], [body(E(9.5, 11, 3.5, 4.5)), line('M6 8 4 6.5M13 8l2-1.5M6 11H3.5M13 11h2.5M6.5 14l-2 1.5M12.5 14l2 1.5M9.5 6.5V15.5'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('code-alert', 'Code Alert', ['alert', 'warning', 'problem', 'code', 'code'], [body(R(3, 4, 12, 15, 2)), line('M7.2 9 5.5 11l1.7 2M10.8 9l1.7 2-1.7 2'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('branch-alert', 'Branch Alert', ['alert', 'warning', 'problem', 'branch', 'branch'], [line(C(5, 5, 1.8) + C(5, 15, 1.8) + C(13, 7, 1.8)), line('M5 6.8v6.4M13 8.8c0 3-3 3.2-6.5 4.8'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('bug-alert', 'Bug Alert', ['alert', 'warning', 'problem', 'bug', 'bug'], [body(E(9.5, 11, 3.5, 4.5)), line('M6 8 4 6.5M13 8l2-1.5M6 11H3.5M13 11h2.5M6.5 14l-2 1.5M12.5 14l2 1.5M9.5 6.5V15.5'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
  ],
};
