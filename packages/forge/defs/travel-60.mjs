import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'travel',
  icons: [
    icon('suitcase-bulb', 'Suitcase Ideas', ['idea', 'tip', 'insight', 'suitcase', 'suitcase'], [line('M7.5 6.5V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5'), body(R(4, 6.5, 11, 10, 2)), line('M7 9v5M12 9v5'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('ship-wheel-bulb', 'Ship Wheel Ideas', ['idea', 'tip', 'insight', 'ship wheel', 'ship-wheel'], [line(C(9.5, 10.5, 4.5)), line(C(9.5, 10.5, 1.3)), line('M9.5 3.5v5.7M9.5 11.8v5.7M2.5 10.5h5.7M10.8 10.5h5.7M4.5 5.5l4 4M14.5 5.5l-4 4M4.5 15.5l4-4'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('control-tower-bulb', 'Control Tower Ideas', ['idea', 'tip', 'insight', 'control tower', 'control-tower'], [line('M9.5 2.5v1.5'), body('M5 4.5h9l-1.5 4h-6Z'), body('M7.5 9h4l.5 9h-5Z'), line('M3.5 18h12'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('airport-filter', 'Filter Airport', ['filter', 'sort', 'refine', 'airport', 'airport'], [line('M3 17.5h13'), body('M9.5 3c.8 0 1.2.8 1.2 1.8V8l4.3 2.5V12l-4.3-1.3v2.8l1.5 1.2V16l-2.7-.8-2.7.8v-1.3l1.5-1.2v-2.8L4 12v-1.5L8.3 8V4.8c0-1 .4-1.8 1.2-1.8Z'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
