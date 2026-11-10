import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'science',
  icons: [
    icon('round-bottom-flask', 'Round Flask', ['round bottom flask', 'chemistry', 'lab', 'boiling flask', 'experiment'], [body('M10 3.5h4v5.2a6 6 0 1 1-4 0Z'), line('M6.6 15h10.8')], { noAccent: true }),
    icon('graduated-cylinder', 'Graduated Cylinder', ['measuring cylinder', 'lab', 'volume', 'chemistry', 'measure'], [body(R(8.5, 3.5, 7, 13.8, 1)), line('M8.7 7h2.5M8.7 10h2.5M8.7 13h2.5'), body(R(6, 18.5, 12, 2, 1))], { noAccent: true }),
    icon('periodic-table', 'Periodic Table', ['elements', 'chemistry', 'science', 'table', 'education'], [body(poly([[3.5, 4], [7, 4], [7, 8], [17, 8], [17, 4], [20.5, 4], [20.5, 16], [3.5, 16]], 0.6, true)), line('M3.7 8h3.3M17 8h3.3M3.7 12h16.6M7 8.2v7.6M10.3 8.2v7.6M13.7 8.2v7.6M17 8.2v7.6'), body(R(7, 17.5, 13.5, 2.5, 0.6))], { noAccent: true }),
    icon('flammable', 'Flammable', ['fire hazard', 'ghs', 'warning', 'combustible', 'safety sign'], [body(poly([[12, 3], [21, 12], [12, 21], [3, 12]], 1.5, true)), accent(scaleD('M12 16.5c-1.8 0-3-1.2-3-2.8 0-1.5 1-2.3 1.6-3.5.4 1 1 1.4 1.5 1.5.2-1.5.9-2.6 2-3.5.3 1.6 1.9 2.7 1.9 4.6 0 2.1-1.4 3.7-4 3.7Z', 0.8, 12, 13))]),
    icon('explosive', 'Explosive', ['explosion hazard', 'ghs', 'warning', 'blast', 'safety sign'], [body(poly([[12, 3], [21, 12], [12, 21], [3, 12]], 1.5, true)), accent(star(12, 12, 4, 1.8, 8, 0.2))]),
    icon('toxic', 'Toxic', ['poison', 'ghs', 'hazard', 'danger', 'safety sign'], [body(poly([[12, 3], [21, 12], [12, 21], [3, 12]], 1.5, true)), accent('M9.5 9.5l5 5M14.5 9.5l-5 5')]),
  ],
};
