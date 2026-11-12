import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'health',
  icons: [
    icon('virus-bulb', 'Virus Ideas', ['idea', 'tip', 'insight', 'virus', 'virus'], [body(C(9.5, 10.5, 4.5)), line('M9.5 3.5V6M9.5 15v2.5M2.5 10.5H5M14 10.5h2.5M4.5 5.5l1.8 1.8M12.7 13.7l1.8 1.8M14.5 5.5l-1.8 1.8M6.3 13.7l-1.8 1.8'), line(D(8, 9.5) + D(11, 11.5)), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('meditation-filter', 'Filter Meditation', ['filter', 'sort', 'refine', 'meditation', 'meditation'], [body(C(9.5, 4.5, 1.8)), line('M9.5 7.5v4.5M6 10l3.5 2 3.5-2'), line('M3.5 15c2 0 4-1 6-3 2 2 4 3 6 3'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('ambulance-filter', 'Filter Ambulance', ['filter', 'sort', 'refine', 'ambulance', 'ambulance'], [body(R(3, 7, 10, 8, 1.2)), body('M13 9.5h1.5l1.5 2.5V15h-3Z'), line('M8 9v4M6 11h4'), line(D(6, 16.8) + D(13.5, 16.8)), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
