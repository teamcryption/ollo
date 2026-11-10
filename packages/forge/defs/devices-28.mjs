import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'devices',
  icons: [
    icon('wifi-star', 'Featured Wifi', ['featured', 'top rated', 'best', 'wifi', 'wifi'], [line('M3 8.5a10 10 0 0 1 13 0M5.5 11.5a6 6 0 0 1 8 0M8 14.5a2 2 0 0 1 3 0'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('monitor-star', 'Featured Monitor', ['featured', 'top rated', 'best', 'monitor', 'monitor'], [body(R(3, 4, 13, 9.5, 1.5)), line('M9.5 13.5v3M6.5 16.5h6'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('watch-star', 'Featured Watch', ['featured', 'top rated', 'best', 'watch', 'watch'], [line('M7.5 6V3.5h4V6M7.5 14v2.5h4V14'), body(R(5.5, 6, 8, 8, 2.5)), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('battery-star', 'Featured Battery', ['featured', 'top rated', 'best', 'battery', 'battery'], [body(R(3, 7, 11, 7, 1.5)), line('M15.5 9.3v2.4'), line('M5.5 9.5v2'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('printer-star', 'Featured Printer', ['featured', 'top rated', 'best', 'printer', 'printer'], [line('M6 6.5V3.5h7v3'), body(R(3, 6.5, 13, 6.5, 1.5)), body(R(6, 11, 7, 5.5, 0.8), { cover: true }), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('router-star', 'Featured Router', ['featured', 'top rated', 'best', 'router', 'router'], [line('M6 9.5 4.5 5M13 9.5l1.5-4.5'), body(R(3, 9.5, 13, 5.5, 1.5)), line(D(6, 12.3) + D(9, 12.3)), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('laptop-alert', 'Laptop Alert', ['alert', 'warning', 'problem', 'laptop', 'laptop'], [body(R(5, 5, 12, 8.5, 1.5)), line('M3 16h10'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('wifi-alert', 'Wifi Alert', ['alert', 'warning', 'problem', 'wifi', 'wifi'], [line('M3 8.5a10 10 0 0 1 13 0M5.5 11.5a6 6 0 0 1 8 0M8 14.5a2 2 0 0 1 3 0'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('monitor-alert', 'Monitor Alert', ['alert', 'warning', 'problem', 'monitor', 'monitor'], [body(R(3, 4, 13, 9.5, 1.5)), line('M9.5 13.5v3M6.5 16.5h6'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('watch-alert', 'Watch Alert', ['alert', 'warning', 'problem', 'watch', 'watch'], [line('M7.5 6V3.5h4V6M7.5 14v2.5h4V14'), body(R(5.5, 6, 8, 8, 2.5)), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('battery-alert', 'Battery Alert', ['alert', 'warning', 'problem', 'battery', 'battery'], [body(R(3, 7, 11, 7, 1.5)), line('M15.5 9.3v2.4'), line('M5.5 9.5v2'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('printer-alert', 'Printer Alert', ['alert', 'warning', 'problem', 'printer', 'printer'], [line('M6 6.5V3.5h7v3'), body(R(3, 6.5, 13, 6.5, 1.5)), body(R(6, 11, 7, 5.5, 0.8), { cover: true }), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('router-alert', 'Router Alert', ['alert', 'warning', 'problem', 'router', 'router'], [line('M6 9.5 4.5 5M13 9.5l1.5-4.5'), body(R(3, 9.5, 13, 5.5, 1.5)), line(D(6, 12.3) + D(9, 12.3)), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
  ],
};
