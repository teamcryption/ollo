import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'buildings',
  icons: [
    icon('pyramid-bulb', 'Pyramid Ideas', ['idea', 'tip', 'insight', 'pyramid', 'pyramid'], [body(poly([[9.5, 4], [16.5, 17.5], [2.5, 17.5]], 0.8, true)), line('M9.5 4.5 12 17.3'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('garage-bulb', 'Garage Ideas', ['idea', 'tip', 'insight', 'garage', 'garage'], [body(poly([[3, 8.5], [9.5, 4], [16, 8.5], [16, 18], [3, 18]], 0.8, true)), line('M5.5 11h8v7M5.5 18v-7M5.7 13.5h7.6M5.7 16h7.6'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
  ],
};
