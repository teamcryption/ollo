import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'transport',
  icons: [
    icon('parking-clock', 'Parking Time', ['parking meter', 'time left', 'pay and display', 'parking', 'parking'], [body(R(3.5, 4, 12, 13, 2.5)), line('M7.5 14.5V7.5h2.5a2.2 2.2 0 0 1 0 4.4H7.5'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('parking-search', 'Find Parking', ['parking spaces', 'car park search', 'nearby', 'parking', 'parking'], [body(R(3.5, 4, 12, 13, 2.5)), line('M7.5 14.5V7.5h2.5a2.2 2.2 0 0 1 0 4.4H7.5'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('parking-bolt', 'EV Parking', ['charging bay', 'electric parking', 'plug in', 'parking', 'parking'], [body(R(3.5, 4, 12, 13, 2.5)), line('M7.5 14.5V7.5h2.5a2.2 2.2 0 0 1 0 4.4H7.5'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('parking-shield', 'Secure Parking', ['guarded car park', 'safe parking', 'cctv', 'parking', 'parking'], [body(R(3.5, 4, 12, 13, 2.5)), line('M7.5 14.5V7.5h2.5a2.2 2.2 0 0 1 0 4.4H7.5'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
  ],
};
