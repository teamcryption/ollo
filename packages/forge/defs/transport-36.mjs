import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'transport',
  icons: [
    icon('fuel-clock', 'Fuel Station Schedule', ['schedule', 'time', 'history', 'fuel station', 'fuel'], [body(R(4, 4, 8, 13, 1.5)), line(R(5.5, 6, 5, 3.5, 0.6)), line('M12 8h1.5l1.5 2v4.5'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('bus-shield', 'Bus Protection', ['protected', 'secure', 'safety', 'bus', 'bus'], [body(R(4, 3.5, 11, 12, 2)), line('M4.2 9h10.6'), line(D(6.5, 12.5) + D(12.5, 12.5)), line('M6 15.5v1.5M13 15.5v1.5'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('train-shield', 'Train Protection', ['protected', 'secure', 'safety', 'train', 'train'], [body(R(4.5, 3.5, 10, 12, 3)), line('M4.7 9.5h9.6'), line(D(7, 12.5) + D(12, 12.5)), line('M6.5 15.5 5 18M12.5 15.5 14 18'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('fuel-shield', 'Fuel Station Protection', ['protected', 'secure', 'safety', 'fuel station', 'fuel'], [body(R(4, 4, 8, 13, 1.5)), line(R(5.5, 6, 5, 3.5, 0.6)), line('M12 8h1.5l1.5 2v4.5'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('bus-gear', 'Bus Settings', ['settings', 'configure', 'preferences', 'bus', 'bus'], [body(R(4, 3.5, 11, 12, 2)), line('M4.2 9h10.6'), line(D(6.5, 12.5) + D(12.5, 12.5)), line('M6 15.5v1.5M13 15.5v1.5'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('train-gear', 'Train Settings', ['settings', 'configure', 'preferences', 'train', 'train'], [body(R(4.5, 3.5, 10, 12, 3)), line('M4.7 9.5h9.6'), line(D(7, 12.5) + D(12, 12.5)), line('M6.5 15.5 5 18M12.5 15.5 14 18'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('fuel-gear', 'Fuel Station Settings', ['settings', 'configure', 'preferences', 'fuel station', 'fuel'], [body(R(4, 4, 8, 13, 1.5)), line(R(5.5, 6, 5, 3.5, 0.6)), line('M12 8h1.5l1.5 2v4.5'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('ship-gear', 'Ship Settings', ['settings', 'configure', 'preferences', 'ship', 'ship'], [line('M9.5 12V4.5l4.5 5.5H9.5'), body('M3 12h13l-1.8 4.2H4.8Z'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('parking-gear', 'Parking Settings', ['settings', 'configure', 'preferences', 'parking', 'parking'], [body(R(3.5, 4, 12, 13, 2.5)), line('M7.5 14.5V7.5h2.5a2.2 2.2 0 0 1 0 4.4H7.5'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('taxi-gear', 'Taxi Settings', ['settings', 'configure', 'preferences', 'taxi', 'taxi'], [line('M7.5 8V6h4v2'), body(R(3.5, 8, 12, 6.5, 1.5)), line(D(6, 11.2) + D(13, 11.2)), line('M5 14.5V16M14 14.5V16'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('bus-pin', 'Bus Location', ['location', 'place', 'map', 'bus', 'bus'], [body(R(4, 3.5, 11, 12, 2)), line('M4.2 9h10.6'), line(D(6.5, 12.5) + D(12.5, 12.5)), line('M6 15.5v1.5M13 15.5v1.5'), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('fuel-bolt', 'Instant Fuel Station', ['quick', 'fast', 'instant', 'fuel station', 'fuel'], [body(R(4, 4, 8, 13, 1.5)), line(R(5.5, 6, 5, 3.5, 0.6)), line('M12 8h1.5l1.5 2v4.5'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('taxi-bolt', 'Instant Taxi', ['quick', 'fast', 'instant', 'taxi', 'taxi'], [line('M7.5 8V6h4v2'), body(R(3.5, 8, 12, 6.5, 1.5)), line(D(6, 11.2) + D(13, 11.2)), line('M5 14.5V16M14 14.5V16'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
