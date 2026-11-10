import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'transport',
  icons: [
    icon('taxi-pin', 'Taxi Rank', ['cab pickup point', 'taxi stand', 'map', 'taxi', 'taxi'], [line('M7.5 8V6h4v2'), body(R(3.5, 8, 12, 6.5, 1.5)), line(D(6, 11.2) + D(13, 11.2)), line('M5 14.5V16M14 14.5V16'), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('taxi-clock', 'Pickup Time', ['ride eta', 'cab arrival', 'booking', 'taxi', 'taxi'], [line('M7.5 8V6h4v2'), body(R(3.5, 8, 12, 6.5, 1.5)), line(D(6, 11.2) + D(13, 11.2)), line('M5 14.5V16M14 14.5V16'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('taxi-search', 'Find a Ride', ['cab search', 'ride hailing', 'transport', 'taxi', 'taxi'], [line('M7.5 8V6h4v2'), body(R(3.5, 8, 12, 6.5, 1.5)), line(D(6, 11.2) + D(13, 11.2)), line('M5 14.5V16M14 14.5V16'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('taxi-shield', 'Safe Ride', ['verified driver', 'ride safety', 'protection', 'taxi', 'taxi'], [line('M7.5 8V6h4v2'), body(R(3.5, 8, 12, 6.5, 1.5)), line(D(6, 11.2) + D(13, 11.2)), line('M5 14.5V16M14 14.5V16'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
  ],
};
