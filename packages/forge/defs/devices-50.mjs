import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'devices',
  icons: [
    icon('wifi-leaf', 'Eco Wifi', ['eco', 'green', 'sustainable', 'wifi', 'wifi'], [line('M3 8.5a10 10 0 0 1 13 0M5.5 11.5a6 6 0 0 1 8 0M8 14.5a2 2 0 0 1 3 0'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('watch-leaf', 'Eco Watch', ['eco', 'green', 'sustainable', 'watch', 'watch'], [line('M7.5 6V3.5h4V6M7.5 14v2.5h4V14'), body(R(5.5, 6, 8, 8, 2.5)), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('battery-leaf', 'Eco Battery', ['eco', 'green', 'sustainable', 'battery', 'battery'], [body(R(3, 7, 11, 7, 1.5)), line('M15.5 9.3v2.4'), line('M5.5 9.5v2'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('printer-leaf', 'Eco Printer', ['eco', 'green', 'sustainable', 'printer', 'printer'], [line('M6 6.5V3.5h7v3'), body(R(3, 6.5, 13, 6.5, 1.5)), body(R(6, 11, 7, 5.5, 0.8), { cover: true }), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('mouse-leaf', 'Eco Mouse', ['eco', 'green', 'sustainable', 'mouse', 'mouse'], [body(R(5, 3.5, 9, 15, 4.5)), line('M9.5 3.7v4.3'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('cpu-leaf', 'Eco CPU', ['eco', 'green', 'sustainable', 'cpu', 'cpu'], [body(R(5.5, 6, 8, 8, 1.5)), line(R(8, 8.5, 3, 3, 0.5)), line('M7.5 3.5V6M11.5 3.5V6M7.5 14v2.5M3 8h2.5M3 12h2.5M13.5 8H16'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('remote-leaf', 'Eco Remote', ['eco', 'green', 'sustainable', 'remote', 'remote'], [body(R(6, 3, 7, 15.5, 2.5)), line(C(9.5, 7, 1.5)), line(D(8, 11.5) + D(11, 11.5) + D(8, 14) + D(11, 14)), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('earbuds-leaf', 'Eco Earbuds', ['eco', 'green', 'sustainable', 'earbuds', 'earbuds'], [body('M6 4a2.5 2.5 0 0 1 2.5 2.5V9A2.5 2.5 0 0 1 6 11.5 2.5 2.5 0 0 1 3.5 9V6.5A2.5 2.5 0 0 1 6 4Z'), line('M7 11.3V16'), body('M13 4a2.5 2.5 0 0 1 2.5 2.5V9a2.5 2.5 0 0 1-5 0V6.5A2.5 2.5 0 0 1 13 4Z'), line('M12 11.3V16'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('keyboard-leaf', 'Eco Keyboard', ['eco', 'green', 'sustainable', 'keyboard', 'keyboard'], [body(R(2.5, 6.5, 14, 8.5, 1.5)), line(D(5, 9) + D(7.5, 9) + D(10, 9) + D(12.5, 9) + D(5, 11.5)), line('M7.5 12.5h4.5'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('drone-leaf', 'Eco Drone', ['eco', 'green', 'sustainable', 'drone', 'drone'], [line(C(5, 5, 1.8)), line(C(14, 5, 1.8)), body(R(7, 8.5, 5, 4, 1.2)), line('M6.3 6.3l1.2 2.2M12.7 6.3l-1.2 2.2M8 12.5l-1.5 2M11 12.5l1.5 2'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('usb-drive-leaf', 'Eco USB Drive', ['eco', 'green', 'sustainable', 'usb drive', 'usb-drive'], [line(R(7.5, 3.5, 4, 3.5, 0.6)), body(R(6, 7, 7, 11.5, 1.5)), line('M8.5 5v.5M10.5 5v.5'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('webcam-leaf', 'Eco Webcam', ['eco', 'green', 'sustainable', 'webcam', 'webcam'], [body(C(9.5, 8.5, 4.5)), line(C(9.5, 8.5, 1.5)), line('M6.5 17.5h6M9.5 13v4.5'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('smart-speaker-leaf', 'Eco Smart Speaker', ['eco', 'green', 'sustainable', 'smart speaker', 'smart-speaker'], [body('M5 6a4.5 2 0 0 1 9 0v10a4.5 2 0 0 1-9 0Z'), line('M5.2 6.3a4.5 2 0 0 0 8.6 0'), line(D(7.5, 11) + D(9.5, 11.5) + D(11.5, 11)), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
  ],
};
