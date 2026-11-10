import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));

export default {
  category: 'education',
  icons: [
    icon('book-stack', 'Book Stack', ['books', 'reading', 'library', 'study', 'pile'], [body(R(4, 15.5, 15.5, 5, 1)), body(R(5.5, 10, 14.5, 5, 1)), body(R(4.5, 4.5, 13, 5, 1)), line('M6.5 15.7v4.6M17.5 10.2v4.6M7 4.7v4.6')], { noAccent: true }),
    icon('fountain-pen', 'Fountain Pen', ['nib', 'calligraphy', 'writing', 'ink pen', 'signature'], rot([body('M12 3.5l4.5 6-1.5 8h-6l-1.5-8Z'), line('M12 3.5V10'), line(D(12, 12)), body(R(8.5, 18, 7, 2.5, 1))], 40), { noAccent: true }),
  ],
};
