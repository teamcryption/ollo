import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'devices',
  icons: [
    icon('monitor-search', 'Desktop Search', ['computer search', 'find files', 'lookup', 'desktop', 'monitor'], [body(R(3, 4, 13, 9.5, 1.5)), line('M9.5 13.5v3M6.5 16.5h6'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('monitor-clock', 'Screen Time', ['usage time', 'display time', 'wellbeing', 'desktop', 'monitor'], [body(R(3, 4, 13, 9.5, 1.5)), line('M9.5 13.5v3M6.5 16.5h6'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('watch-search', 'Find My Watch', ['locate watch', 'lost wearable', 'search', 'smartwatch', 'watch'], [line('M7.5 6V3.5h4V6M7.5 14v2.5h4V14'), body(R(5.5, 6, 8, 8, 2.5)), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('watch-lock', 'Watch Lock', ['locked watch', 'wrist detection', 'security', 'smartwatch', 'watch'], [line('M7.5 6V3.5h4V6M7.5 14v2.5h4V14'), body(R(5.5, 6, 8, 8, 2.5)), line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })], { noAccent: true }),
    icon('watch-pin', 'Watch Location', ['gps watch', 'tracking', 'location', 'smartwatch', 'watch'], [line('M7.5 6V3.5h4V6M7.5 14v2.5h4V14'), body(R(5.5, 6, 8, 8, 2.5)), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('battery-gear', 'Battery Settings', ['power settings', 'battery saver', 'configure', 'energy', 'battery'], [body(R(3, 7, 11, 7, 1.5)), line('M15.5 9.3v2.4'), line('M5.5 9.5v2'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('battery-clock', 'Battery Life', ['time remaining', 'battery time', 'usage', 'energy', 'battery'], [body(R(3, 7, 11, 7, 1.5)), line('M15.5 9.3v2.4'), line('M5.5 9.5v2'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('battery-shield', 'Battery Health', ['battery protection', 'optimised charging', 'care', 'energy', 'battery'], [body(R(3, 7, 11, 7, 1.5)), line('M15.5 9.3v2.4'), line('M5.5 9.5v2'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
  ],
};
