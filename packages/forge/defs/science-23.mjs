import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'science',
  icons: [
    icon('flask-heart', 'Favourite Flask', ['favourite', 'saved', 'like', 'flask', 'flask'], [body('M7 3.5h5v4l4 7.5a1.5 1.5 0 0 1-1.3 2.2H4.3A1.5 1.5 0 0 1 3 15l4-7.5Z'), line('M5.3 12h8.4'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('dna-heart', 'Favourite DNA', ['favourite', 'saved', 'like', 'dna', 'dna'], [line('M6 3.5c0 4 7 4 7 8s-7 4-7 8M13 3.5c0 4-7 4-7 8s7 4 7 8M7.5 6.5h4M7.5 16.5h4'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('flask-star', 'Featured Flask', ['featured', 'top rated', 'best', 'flask', 'flask'], [body('M7 3.5h5v4l4 7.5a1.5 1.5 0 0 1-1.3 2.2H4.3A1.5 1.5 0 0 1 3 15l4-7.5Z'), line('M5.3 12h8.4'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('dna-star', 'Featured DNA', ['featured', 'top rated', 'best', 'dna', 'dna'], [line('M6 3.5c0 4 7 4 7 8s-7 4-7 8M13 3.5c0 4-7 4-7 8s7 4 7 8M7.5 6.5h4M7.5 16.5h4'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('flask-alert', 'Flask Alert', ['alert', 'warning', 'problem', 'flask', 'flask'], [body('M7 3.5h5v4l4 7.5a1.5 1.5 0 0 1-1.3 2.2H4.3A1.5 1.5 0 0 1 3 15l4-7.5Z'), line('M5.3 12h8.4'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('dna-alert', 'DNA Alert', ['alert', 'warning', 'problem', 'dna', 'dna'], [line('M6 3.5c0 4 7 4 7 8s-7 4-7 8M13 3.5c0 4-7 4-7 8s7 4 7 8M7.5 6.5h4M7.5 16.5h4'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
  ],
};
