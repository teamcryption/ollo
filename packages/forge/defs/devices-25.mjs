import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'devices',
  icons: [
    icon('printer-clock', 'Print Queue', ['pending prints', 'scheduled print', 'queue', 'printer', 'printer'], [line('M6 6.5V3.5h7v3'), body(R(3, 6.5, 13, 6.5, 1.5)), body(R(6, 11, 7, 5.5, 0.8), { cover: true }), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('printer-gear', 'Printer Settings', ['print options', 'configure printer', 'setup', 'printer', 'printer'], [line('M6 6.5V3.5h7v3'), body(R(3, 6.5, 13, 6.5, 1.5)), body(R(6, 11, 7, 5.5, 0.8), { cover: true }), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('printer-lock', 'Secure Print', ['pin release', 'confidential printing', 'locked', 'printer', 'printer'], [line('M6 6.5V3.5h7v3'), body(R(3, 6.5, 13, 6.5, 1.5)), body(R(6, 11, 7, 5.5, 0.8), { cover: true }), line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })], { noAccent: true }),
    icon('printer-bolt', 'Fast Print', ['quick print', 'express printing', 'speed', 'printer', 'printer'], [line('M6 6.5V3.5h7v3'), body(R(3, 6.5, 13, 6.5, 1.5)), body(R(6, 11, 7, 5.5, 0.8), { cover: true }), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('router-gear', 'Router Settings', ['network admin', 'modem settings', 'configure', 'internet', 'router'], [line('M6 9.5 4.5 5M13 9.5l1.5-4.5'), body(R(3, 9.5, 13, 5.5, 1.5)), line(D(6, 12.3) + D(9, 12.3)), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('router-lock', 'Router Security', ['locked network', 'firewall', 'password', 'internet', 'router'], [line('M6 9.5 4.5 5M13 9.5l1.5-4.5'), body(R(3, 9.5, 13, 5.5, 1.5)), line(D(6, 12.3) + D(9, 12.3)), line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })], { noAccent: true }),
    icon('router-shield', 'Protected Network', ['network protection', 'safe home internet', 'security', 'internet', 'router'], [line('M6 9.5 4.5 5M13 9.5l1.5-4.5'), body(R(3, 9.5, 13, 5.5, 1.5)), line(D(6, 12.3) + D(9, 12.3)), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('router-clock', 'Internet Schedule', ['parental controls', 'wifi schedule', 'downtime', 'internet', 'router'], [line('M6 9.5 4.5 5M13 9.5l1.5-4.5'), body(R(3, 9.5, 13, 5.5, 1.5)), line(D(6, 12.3) + D(9, 12.3)), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('printer-search', 'Find Printer', ['nearby printer', 'printer lookup', 'network devices', 'printer', 'printer'], [line('M6 6.5V3.5h7v3'), body(R(3, 6.5, 13, 6.5, 1.5)), body(R(6, 11, 7, 5.5, 0.8), { cover: true }), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
  ],
};
