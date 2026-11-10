import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'development',
  icons: [
    icon('database-bolt', 'Fast Database', ['cache', 'performance', 'quick query', 'speed', 'database'], [body('M3 6.5c0-1.7 2.5-3 5.5-3s5.5 1.3 5.5 3v10c0 1.7-2.5 3-5.5 3S3 18.2 3 16.5Z'), line('M3.2 6.5c0 1.6 2.4 2.8 5.3 2.8s5.3-1.2 5.3-2.8'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('database-star', 'Starred Database', ['favourite database', 'primary', 'featured', 'data', 'database'], [body('M3 6.5c0-1.7 2.5-3 5.5-3s5.5 1.3 5.5 3v10c0 1.7-2.5 3-5.5 3S3 18.2 3 16.5Z'), line('M3.2 6.5c0 1.6 2.4 2.8 5.3 2.8s5.3-1.2 5.3-2.8'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('database-pin', 'Data Region', ['data residency', 'server location', 'region', 'storage', 'database'], [body('M3 6.5c0-1.7 2.5-3 5.5-3s5.5 1.3 5.5 3v10c0 1.7-2.5 3-5.5 3S3 18.2 3 16.5Z'), line('M3.2 6.5c0 1.6 2.4 2.8 5.3 2.8s5.3-1.2 5.3-2.8'), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
  ],
};
