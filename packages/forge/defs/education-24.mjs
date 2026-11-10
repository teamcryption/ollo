import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'education',
  icons: [
    icon('cap-heart', 'Favourite Graduation', ['favourite', 'saved', 'like', 'graduation', 'cap'], [body(poly([[2.5, 8], [9.5, 4.5], [16.5, 8], [9.5, 11.5]], 0.6, true)), line('M5.5 9.8v3c1.2 1.2 2.6 1.8 4 1.8s2.8-.6 4-1.8v-3'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('book-alert', 'Book Alert', ['alert', 'warning', 'problem', 'book', 'book'], [body(R(3, 4, 11, 15, 2)), line('M6 4.2v14.6'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('school-alert', 'School Alert', ['alert', 'warning', 'problem', 'school', 'school'], [line('M9.5 6V2.8l2.5 1-2.5 1'), body(poly([[3, 11], [9.5, 6.5], [16, 11], [16, 19], [3, 19]], 1, true)), line('M8 19v-3.5h3V19'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('cap-alert', 'Graduation Alert', ['alert', 'warning', 'problem', 'graduation', 'cap'], [body(poly([[2.5, 8], [9.5, 4.5], [16.5, 8], [9.5, 11.5]], 0.6, true)), line('M5.5 9.8v3c1.2 1.2 2.6 1.8 4 1.8s2.8-.6 4-1.8v-3'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
  ],
};
