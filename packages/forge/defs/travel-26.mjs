import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'travel',
  icons: [
    icon('bed-heart', 'Favourite Hotel', ['favourite', 'saved', 'like', 'hotel', 'bed'], [line('M3 17V6M3 13h13v4'), body('M8 8.5h6a2 2 0 0 1 2 2V13H8Z'), body(C(5.5, 10.8, 1.4)), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('tent-heart', 'Favourite Tent', ['favourite', 'saved', 'like', 'tent', 'tent'], [body(poly([[9.5, 4], [16, 16.5], [3, 16.5]], 0.8, true)), line('M9.5 10.5v6'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('passport-heart', 'Favourite Passport', ['favourite', 'saved', 'like', 'passport', 'passport'], [body(R(4, 3.5, 11, 14, 1.5)), line(C(9.5, 9, 2.5)), line('M7 14h5'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('suitcase-heart', 'Favourite Suitcase', ['favourite', 'saved', 'like', 'suitcase', 'suitcase'], [line('M7.5 6.5V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5'), body(R(4, 6.5, 11, 10, 2)), line('M7 9v5M12 9v5'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('passport-star', 'Featured Passport', ['featured', 'top rated', 'best', 'passport', 'passport'], [body(R(4, 3.5, 11, 14, 1.5)), line(C(9.5, 9, 2.5)), line('M7 14h5'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('suitcase-star', 'Featured Suitcase', ['featured', 'top rated', 'best', 'suitcase', 'suitcase'], [line('M7.5 6.5V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5'), body(R(4, 6.5, 11, 10, 2)), line('M7 9v5M12 9v5'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('airplane-alert', 'Airplane Alert', ['alert', 'warning', 'problem', 'airplane', 'airplane'], [body('M9.5 3.5c.8 0 1.2.8 1.2 1.8V9l5 3v1.8l-5-1.5v3.5l1.8 1.4V19l-3-.9-3 .9v-1.8l1.8-1.4v-3.5l-5 1.5V12l5-3V5.3c0-1 .4-1.8 1.2-1.8Z'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('bed-alert', 'Hotel Alert', ['alert', 'warning', 'problem', 'hotel', 'bed'], [line('M3 17V6M3 13h13v4'), body('M8 8.5h6a2 2 0 0 1 2 2V13H8Z'), body(C(5.5, 10.8, 1.4)), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('tent-alert', 'Tent Alert', ['alert', 'warning', 'problem', 'tent', 'tent'], [body(poly([[9.5, 4], [16, 16.5], [3, 16.5]], 0.8, true)), line('M9.5 10.5v6'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('passport-alert', 'Passport Alert', ['alert', 'warning', 'problem', 'passport', 'passport'], [body(R(4, 3.5, 11, 14, 1.5)), line(C(9.5, 9, 2.5)), line('M7 14h5'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('suitcase-alert', 'Suitcase Alert', ['alert', 'warning', 'problem', 'suitcase', 'suitcase'], [line('M7.5 6.5V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5'), body(R(4, 6.5, 11, 10, 2)), line('M7 9v5M12 9v5'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
  ],
};
