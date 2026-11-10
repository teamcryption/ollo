import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'communication',
  icons: [
    icon('inbox-heart', 'Favourite Inbox', ['favourite', 'saved', 'like', 'inbox', 'inbox'], [body('M3 11.5 5 5.5h9l2 6v4a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 15.5Z'), line('M3.2 11.5h3.3l1 1.5h4l1-1.5h3.3'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('phone-alert', 'Phone Alert', ['alert', 'warning', 'problem', 'phone', 'phone'], [body('M5.5 3.5h2.5l1.3 3.2-1.8 1.3a8 8 0 0 0 3.5 3.5l1.3-1.8 3.2 1.3v2.5A1.5 1.5 0 0 1 14 15c-6 0-10-4-10-10a1.5 1.5 0 0 1 1.5-1.5Z'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('newspaper-alert', 'Newspaper Alert', ['alert', 'warning', 'problem', 'newspaper', 'newspaper'], [body(R(3, 4, 12.5, 13, 1.5)), line(R(5.5, 6.5, 4, 3.5, 0.5)), line('M11.5 7h1.5M11.5 9.5h1.5M5.5 12.5h7.5M5.5 15h5'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
  ],
};
