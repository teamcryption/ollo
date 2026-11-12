import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'education',
  icons: [
    icon('book-calendar', 'Book Booking', ['booking', 'date', 'appointment', 'book', 'book'], [body(R(3, 4, 11, 15, 2)), line('M6 4.2v14.6'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('school-calendar', 'School Booking', ['booking', 'date', 'appointment', 'school', 'school'], [line('M9.5 6V2.8l2.5 1-2.5 1'), body(poly([[3, 11], [9.5, 6.5], [16, 11], [16, 19], [3, 19]], 1, true)), line('M8 19v-3.5h3V19'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('cap-calendar', 'Graduation Booking', ['booking', 'date', 'appointment', 'graduation', 'cap'], [body(poly([[2.5, 8], [9.5, 4.5], [16.5, 8], [9.5, 11.5]], 0.6, true)), line('M5.5 9.8v3c1.2 1.2 2.6 1.8 4 1.8s2.8-.6 4-1.8v-3'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('protractor-calendar', 'Protractor Booking', ['booking', 'date', 'appointment', 'protractor', 'protractor'], [body('M3 15.5a6.5 6.5 0 0 1 13 0Z'), line('M6.5 15.3a3 3 0 0 1 6 0'), line('M9.5 9.2v1.2M5.3 11.3l.9.8M13.7 11.3l-.9.8'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('drawing-compass-calendar', 'Drawing Compass Booking', ['booking', 'date', 'appointment', 'drawing compass', 'drawing-compass'], [body(C(9.5, 4.5, 1.5)), line('M8.8 5.9 4.5 17.5M10.2 5.9l4.3 11.6'), line('M5.6 14.4c2.5 1.3 5.3 1.3 7.8 0'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('notebook-calendar', 'Notebook Booking', ['booking', 'date', 'appointment', 'notebook', 'notebook'], [body(R(5, 3.5, 10, 15, 1.5)), line('M3.5 6.5h3M3.5 10.5h3M3.5 14.5h3'), line('M8.5 7h4'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('books-calendar', 'Books Booking', ['booking', 'date', 'appointment', 'books', 'books'], [body(R(4, 5, 2.5, 12, 0.6)), body(R(7.5, 4, 2.5, 13, 0.6)), body(poly([[11, 6], [13.3, 5.4], [15.8, 16.4], [13.5, 17]], 0.5, true)), line('M3.5 18.5h12'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('whiteboard-calendar', 'Whiteboard Booking', ['booking', 'date', 'appointment', 'whiteboard', 'whiteboard'], [body(R(3, 3.5, 13, 9, 1.2)), line('M5.5 7l2-1.3 2 1.8 2.5-2.5'), line('M6.5 12.7 5 18M12.5 12.7 14 18'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
  ],
};
