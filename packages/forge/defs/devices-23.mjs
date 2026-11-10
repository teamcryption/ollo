import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'devices',
  icons: [
    icon('wifi-lock', 'Secured Wifi', ['password wifi', 'protected network', 'wpa', 'internet', 'wifi'], [line('M3 8.5a10 10 0 0 1 13 0M5.5 11.5a6 6 0 0 1 8 0M8 14.5a2 2 0 0 1 3 0'), line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })], { noAccent: true }),
    icon('wifi-search', 'Scan Networks', ['find wifi', 'available networks', 'search', 'internet', 'wifi'], [line('M3 8.5a10 10 0 0 1 13 0M5.5 11.5a6 6 0 0 1 8 0M8 14.5a2 2 0 0 1 3 0'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('wifi-gear', 'Wifi Settings', ['network settings', 'router config', 'internet', 'configure', 'wifi'], [line('M3 8.5a10 10 0 0 1 13 0M5.5 11.5a6 6 0 0 1 8 0M8 14.5a2 2 0 0 1 3 0'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('wifi-pin', 'Wifi Hotspot', ['public wifi', 'hotspot location', 'free wifi', 'internet', 'wifi'], [line('M3 8.5a10 10 0 0 1 13 0M5.5 11.5a6 6 0 0 1 8 0M8 14.5a2 2 0 0 1 3 0'), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('wifi-bolt', 'Fast Wifi', ['high speed internet', 'fibre', 'quick connection', 'internet', 'wifi'], [line('M3 8.5a10 10 0 0 1 13 0M5.5 11.5a6 6 0 0 1 8 0M8 14.5a2 2 0 0 1 3 0'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('wifi-shield', 'Secure Network', ['vpn', 'protected connection', 'safe wifi', 'internet', 'wifi'], [line('M3 8.5a10 10 0 0 1 13 0M5.5 11.5a6 6 0 0 1 8 0M8 14.5a2 2 0 0 1 3 0'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('monitor-gear', 'Display Settings', ['screen settings', 'resolution', 'monitor config', 'display', 'monitor'], [body(R(3, 4, 13, 9.5, 1.5)), line('M9.5 13.5v3M6.5 16.5h6'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('monitor-lock', 'Screen Lock', ['lock screen', 'locked display', 'privacy', 'computer', 'monitor'], [body(R(3, 4, 13, 9.5, 1.5)), line('M9.5 13.5v3M6.5 16.5h6'), line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })], { noAccent: true }),
    icon('monitor-shield', 'Screen Privacy', ['privacy filter', 'secure display', 'protected screen', 'computer', 'monitor'], [body(R(3, 4, 13, 9.5, 1.5)), line('M9.5 13.5v3M6.5 16.5h6'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('watch-gear', 'Watch Settings', ['smartwatch settings', 'wearable', 'configure', 'watch', 'watch'], [line('M7.5 6V3.5h4V6M7.5 14v2.5h4V14'), body(R(5.5, 6, 8, 8, 2.5)), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('watch-bolt', 'Watch Charging', ['charge watch', 'battery', 'power', 'wearable', 'watch'], [line('M7.5 6V3.5h4V6M7.5 14v2.5h4V14'), body(R(5.5, 6, 8, 8, 2.5)), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
