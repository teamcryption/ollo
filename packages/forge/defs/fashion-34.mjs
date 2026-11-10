import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'fashion',
  icons: [
    icon('dress-pencil', 'Edit Dress', ['edit', 'write', 'modify', 'dress', 'dress'], [body(poly([[7.5, 3.5], [11.5, 3.5], [11, 7.5], [15, 17.5], [4, 17.5], [8, 7.5]], 0.8, true)), line('M8.3 7.6h2.4'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('sock-pencil', 'Edit Sock', ['edit', 'write', 'modify', 'sock', 'sock'], [body('M7 3.5h5v7.5l-3.6 5.3a2.4 2.4 0 0 1-4-2.7L7 10.2Z'), line('M7.2 6.2h4.6'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('bowtie-pencil', 'Edit Bow Tie', ['edit', 'write', 'modify', 'bow tie', 'bowtie'], [body(poly([[3.5, 7], [8.3, 9.3], [8.3, 11.7], [3.5, 14]], 0.8, true)), body(poly([[15.5, 7], [10.7, 9.3], [10.7, 11.7], [15.5, 14]], 0.8, true)), line(D(9.5, 10.5)), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('lipstick-pencil', 'Edit Lipstick', ['edit', 'write', 'modify', 'lipstick', 'lipstick'], [body('M7.5 9.5V5.7l4-2.2v6Z'), body(R(6.5, 10.5, 6, 7.5, 1)), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('perfume-pencil', 'Edit Perfume', ['edit', 'write', 'modify', 'perfume', 'perfume'], [line('M8.5 5.2V3.5h2'), body(R(7.5, 5.5, 4, 2.3, 0.6)), body(R(4.5, 8.5, 10, 9.5, 2.5)), line('M7.5 12.5h4'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('necktie-pencil', 'Edit Tie', ['edit', 'write', 'modify', 'tie', 'necktie'], [body(poly([[8, 3.5], [11, 3.5], [10.6, 6], [8.4, 6]], 0.5, true)), body(poly([[8.3, 7.2], [10.7, 7.2], [12.5, 15], [9.5, 18], [6.5, 15]], 0.6, true)), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
