import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'transport',
  icons: [
    icon('bike-search', 'Find a Bike', ['bike rental search', 'cycle hire', 'bicycle', 'nearby', 'bike'], [line(C(5.5, 13, 2.5) + C(13.5, 13, 2.5)), line('M5.5 13 8 8h4.5l1 5M8 8 9.5 13h4M7.5 6h2'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('bike-gear', 'Bike Service', ['bike repair', 'maintenance', 'cycle shop', 'bicycle', 'bike'], [line(C(5.5, 13, 2.5) + C(13.5, 13, 2.5)), line('M5.5 13 8 8h4.5l1 5M8 8 9.5 13h4M7.5 6h2'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('bike-shield', 'Bike Insurance', ['cycle cover', 'theft protection', 'insured', 'bicycle', 'bike'], [line(C(5.5, 13, 2.5) + C(13.5, 13, 2.5)), line('M5.5 13 8 8h4.5l1 5M8 8 9.5 13h4M7.5 6h2'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('bike-bolt', 'E-Bike', ['electric bike', 'ebike', 'pedal assist', 'bicycle', 'bike'], [line(C(5.5, 13, 2.5) + C(13.5, 13, 2.5)), line('M5.5 13 8 8h4.5l1 5M8 8 9.5 13h4M7.5 6h2'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('bus-search', 'Find Bus Route', ['route planner', 'bus lookup', 'journey', 'public transport', 'bus'], [body(R(4, 3.5, 11, 12, 2)), line('M4.2 9h10.6'), line(D(6.5, 12.5) + D(12.5, 12.5)), line('M6 15.5v1.5M13 15.5v1.5'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('bus-bolt', 'Express Bus', ['fast bus', 'limited stops', 'coach', 'public transport', 'bus'], [body(R(4, 3.5, 11, 12, 2)), line('M4.2 9h10.6'), line(D(6.5, 12.5) + D(12.5, 12.5)), line('M6 15.5v1.5M13 15.5v1.5'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('train-search', 'Find Train', ['journey planner', 'train search', 'rail', 'public transport', 'train'], [body(R(4.5, 3.5, 10, 12, 3)), line('M4.7 9.5h9.6'), line(D(7, 12.5) + D(12, 12.5)), line('M6.5 15.5 5 18M12.5 15.5 14 18'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('train-bolt', 'High Speed Rail', ['bullet train', 'express rail', 'fast train', 'public transport', 'train'], [body(R(4.5, 3.5, 10, 12, 3)), line('M4.7 9.5h9.6'), line(D(7, 12.5) + D(12, 12.5)), line('M6.5 15.5 5 18M12.5 15.5 14 18'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('fuel-search', 'Find Fuel', ['petrol price', 'gas station search', 'refuel', 'fuel', 'fuel'], [body(R(4, 4, 8, 13, 1.5)), line(R(5.5, 6, 5, 3.5, 0.6)), line('M12 8h1.5l1.5 2v4.5'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
  ],
};
