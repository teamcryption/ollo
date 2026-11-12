import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'education',
  icons: [
    icon('drawing-compass-bulb', 'Drawing Compass Ideas', ['idea', 'tip', 'insight', 'drawing compass', 'drawing-compass'], [body(C(9.5, 4.5, 1.5)), line('M8.8 5.9 4.5 17.5M10.2 5.9l4.3 11.6'), line('M5.6 14.4c2.5 1.3 5.3 1.3 7.8 0'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('books-bulb', 'Books Ideas', ['idea', 'tip', 'insight', 'books', 'books'], [body(R(4, 5, 2.5, 12, 0.6)), body(R(7.5, 4, 2.5, 13, 0.6)), body(poly([[11, 6], [13.3, 5.4], [15.8, 16.4], [13.5, 17]], 0.5, true)), line('M3.5 18.5h12'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('library-books-bulb', 'Library Books Ideas', ['idea', 'tip', 'insight', 'library books', 'library-books'], [body(R(3, 4, 3.5, 14, 0.8)), body(R(7.5, 4, 3.5, 14, 0.8)), body(rotateD(R(12, 4.5, 3.5, 13.5, 0.8), -12, 13.75, 18)), line('M3.2 7h3.1M7.7 7h3.1'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('language-bulb', 'Language Ideas', ['idea', 'tip', 'insight', 'language', 'language'], [body(R(3, 3.5, 8.5, 8, 1.5)), line('M5 6h4.5M7.25 5v1M8.5 6c-.5 2-1.8 3.3-3.5 3.8M6 7.5c.5 1 1.3 1.8 2.5 2.2'), body(R(9.5, 9, 7, 8, 1.5)), line('M11.5 15l1.5-4 1.5 4M12 14h2'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
  ],
};
