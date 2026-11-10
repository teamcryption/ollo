import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'travel',
  icons: [
    icon('passport-search', 'Search Passport', ['search', 'find', 'lookup', 'passport', 'passport'], [body(R(4, 3.5, 11, 14, 1.5)), line(C(9.5, 9, 2.5)), line('M7 14h5'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('tent-clock', 'Tent Schedule', ['schedule', 'time', 'history', 'tent', 'tent'], [body(poly([[9.5, 4], [16, 16.5], [3, 16.5]], 0.8, true)), line('M9.5 10.5v6'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('suitcase-clock', 'Suitcase Schedule', ['schedule', 'time', 'history', 'suitcase', 'suitcase'], [line('M7.5 6.5V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5'), body(R(4, 6.5, 11, 10, 2)), line('M7 9v5M12 9v5'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('bed-shield', 'Hotel Protection', ['protected', 'secure', 'safety', 'hotel', 'bed'], [line('M3 17V6M3 13h13v4'), body('M8 8.5h6a2 2 0 0 1 2 2V13H8Z'), body(C(5.5, 10.8, 1.4)), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('tent-shield', 'Tent Protection', ['protected', 'secure', 'safety', 'tent', 'tent'], [body(poly([[9.5, 4], [16, 16.5], [3, 16.5]], 0.8, true)), line('M9.5 10.5v6'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('bed-gear', 'Hotel Settings', ['settings', 'configure', 'preferences', 'hotel', 'bed'], [line('M3 17V6M3 13h13v4'), body('M8 8.5h6a2 2 0 0 1 2 2V13H8Z'), body(C(5.5, 10.8, 1.4)), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('tent-gear', 'Tent Settings', ['settings', 'configure', 'preferences', 'tent', 'tent'], [body(poly([[9.5, 4], [16, 16.5], [3, 16.5]], 0.8, true)), line('M9.5 10.5v6'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('passport-gear', 'Passport Settings', ['settings', 'configure', 'preferences', 'passport', 'passport'], [body(R(4, 3.5, 11, 14, 1.5)), line(C(9.5, 9, 2.5)), line('M7 14h5'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('suitcase-gear', 'Suitcase Settings', ['settings', 'configure', 'preferences', 'suitcase', 'suitcase'], [line('M7.5 6.5V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5'), body(R(4, 6.5, 11, 10, 2)), line('M7 9v5M12 9v5'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('bed-bolt', 'Instant Hotel', ['quick', 'fast', 'instant', 'hotel', 'bed'], [line('M3 17V6M3 13h13v4'), body('M8 8.5h6a2 2 0 0 1 2 2V13H8Z'), body(C(5.5, 10.8, 1.4)), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('tent-bolt', 'Instant Tent', ['quick', 'fast', 'instant', 'tent', 'tent'], [body(poly([[9.5, 4], [16, 16.5], [3, 16.5]], 0.8, true)), line('M9.5 10.5v6'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('passport-bolt', 'Instant Passport', ['quick', 'fast', 'instant', 'passport', 'passport'], [body(R(4, 3.5, 11, 14, 1.5)), line(C(9.5, 9, 2.5)), line('M7 14h5'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('suitcase-bolt', 'Instant Suitcase', ['quick', 'fast', 'instant', 'suitcase', 'suitcase'], [line('M7.5 6.5V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5'), body(R(4, 6.5, 11, 10, 2)), line('M7 9v5M12 9v5'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
