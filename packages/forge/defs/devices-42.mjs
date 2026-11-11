import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'devices',
  icons: [
    icon('wifi-sparkle', 'AI Wifi', ['ai', 'smart', 'magic', 'wifi', 'wifi'], [line('M3 8.5a10 10 0 0 1 13 0M5.5 11.5a6 6 0 0 1 8 0M8 14.5a2 2 0 0 1 3 0'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('monitor-sparkle', 'AI Monitor', ['ai', 'smart', 'magic', 'monitor', 'monitor'], [body(R(3, 4, 13, 9.5, 1.5)), line('M9.5 13.5v3M6.5 16.5h6'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('watch-sparkle', 'AI Watch', ['ai', 'smart', 'magic', 'watch', 'watch'], [line('M7.5 6V3.5h4V6M7.5 14v2.5h4V14'), body(R(5.5, 6, 8, 8, 2.5)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('battery-sparkle', 'AI Battery', ['ai', 'smart', 'magic', 'battery', 'battery'], [body(R(3, 7, 11, 7, 1.5)), line('M15.5 9.3v2.4'), line('M5.5 9.5v2'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('printer-sparkle', 'AI Printer', ['ai', 'smart', 'magic', 'printer', 'printer'], [line('M6 6.5V3.5h7v3'), body(R(3, 6.5, 13, 6.5, 1.5)), body(R(6, 11, 7, 5.5, 0.8), { cover: true }), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('router-sparkle', 'AI Router', ['ai', 'smart', 'magic', 'router', 'router'], [line('M6 9.5 4.5 5M13 9.5l1.5-4.5'), body(R(3, 9.5, 13, 5.5, 1.5)), line(D(6, 12.3) + D(9, 12.3)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('speaker-sparkle', 'AI Speaker', ['ai', 'smart', 'magic', 'speaker', 'speaker'], [body(R(4.5, 3.5, 10, 15, 2)), line(C(9.5, 12.5, 2.8)), line(D(9.5, 6.8)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('mouse-sparkle', 'AI Mouse', ['ai', 'smart', 'magic', 'mouse', 'mouse'], [body(R(5, 3.5, 9, 15, 4.5)), line('M9.5 3.7v4.3'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('sd-card-sparkle', 'AI SD Card', ['ai', 'smart', 'magic', 'sd card', 'sd-card'], [body('M6.5 3.5h7A1.5 1.5 0 0 1 15 5v12a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 4 17V6Z'), line('M7.5 6v2.5M10 6v2.5M12.5 6v2.5'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('cpu-sparkle', 'AI CPU', ['ai', 'smart', 'magic', 'cpu', 'cpu'], [body(R(5.5, 6, 8, 8, 1.5)), line(R(8, 8.5, 3, 3, 0.5)), line('M7.5 3.5V6M11.5 3.5V6M7.5 14v2.5M3 8h2.5M3 12h2.5M13.5 8H16'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('remote-sparkle', 'AI Remote', ['ai', 'smart', 'magic', 'remote', 'remote'], [body(R(6, 3, 7, 15.5, 2.5)), line(C(9.5, 7, 1.5)), line(D(8, 11.5) + D(11, 11.5) + D(8, 14) + D(11, 14)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('projector-sparkle', 'AI Projector', ['ai', 'smart', 'magic', 'projector', 'projector'], [body(R(3, 7, 13, 8, 2)), line(C(11.5, 11, 2)), line('M5.5 10h2'), line('M5 15.2v2M14 15.2v2'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('ram-sparkle', 'AI RAM', ['ai', 'smart', 'magic', 'ram', 'ram'], [body(R(3, 6, 13, 7.5, 1)), line('M5.8 8.5v3M8.5 8.5v3M11.2 8.5v3'), line('M4.5 13.7v2M7 13.7v2M9.5 13.7v2M12 13.7v2M14.5 13.7v2'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('ethernet-sparkle', 'AI Ethernet', ['ai', 'smart', 'magic', 'ethernet', 'ethernet'], [body(R(3.5, 5, 12, 11, 2)), line('M6.5 9.5h6V13H11v1.5H8V13H6.5Z'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('earbuds-sparkle', 'AI Earbuds', ['ai', 'smart', 'magic', 'earbuds', 'earbuds'], [body('M6 4a2.5 2.5 0 0 1 2.5 2.5V9A2.5 2.5 0 0 1 6 11.5 2.5 2.5 0 0 1 3.5 9V6.5A2.5 2.5 0 0 1 6 4Z'), line('M7 11.3V16'), body('M13 4a2.5 2.5 0 0 1 2.5 2.5V9a2.5 2.5 0 0 1-5 0V6.5A2.5 2.5 0 0 1 13 4Z'), line('M12 11.3V16'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('tablet-sparkle', 'AI Tablet', ['ai', 'smart', 'magic', 'tablet', 'tablet'], [body(R(4.5, 3.5, 10, 15, 2)), line('M8.5 15.5h2'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('keyboard-sparkle', 'AI Keyboard', ['ai', 'smart', 'magic', 'keyboard', 'keyboard'], [body(R(2.5, 6.5, 14, 8.5, 1.5)), line(D(5, 9) + D(7.5, 9) + D(10, 9) + D(12.5, 9) + D(5, 11.5)), line('M7.5 12.5h4.5'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('drone-sparkle', 'AI Drone', ['ai', 'smart', 'magic', 'drone', 'drone'], [line(C(5, 5, 1.8)), line(C(14, 5, 1.8)), body(R(7, 8.5, 5, 4, 1.2)), line('M6.3 6.3l1.2 2.2M12.7 6.3l-1.2 2.2M8 12.5l-1.5 2M11 12.5l1.5 2'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('vr-headset-sparkle', 'AI VR Headset', ['ai', 'smart', 'magic', 'vr headset', 'vr-headset'], [body('M3 8.5A1.5 1.5 0 0 1 4.5 7h10A1.5 1.5 0 0 1 16 8.5v4a1.5 1.5 0 0 1-1.5 1.5h-3L10 12.5 8.5 14h-4A1.5 1.5 0 0 1 3 12.5Z'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('usb-drive-sparkle', 'AI USB Drive', ['ai', 'smart', 'magic', 'usb drive', 'usb-drive'], [line(R(7.5, 3.5, 4, 3.5, 0.6)), body(R(6, 7, 7, 11.5, 1.5)), line('M8.5 5v.5M10.5 5v.5'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('hard-drive-sparkle', 'AI Hard Drive', ['ai', 'smart', 'magic', 'hard drive', 'hard-drive'], [body(R(3, 6, 13, 9, 1.8)), line('M5.5 12h4'), line(D(13, 12)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('webcam-sparkle', 'AI Webcam', ['ai', 'smart', 'magic', 'webcam', 'webcam'], [body(C(9.5, 8.5, 4.5)), line(C(9.5, 8.5, 1.5)), line('M6.5 17.5h6M9.5 13v4.5'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
  ],
};
