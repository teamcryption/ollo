import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'security',
  icons: [
    icon('password-question', 'Password Help', ['help', 'question', 'support', 'password', 'password'], [body(R(3, 7, 13, 7, 2)), line(D(6, 10.5) + D(9.5, 10.5) + D(13, 10.5)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.7 15.4a1.3 1.3 0 1 1 1.9 1.2c-.4.2-.6.5-.6.9'), line(D(17, 18.9))], { noAccent: true }),
    icon('face-id-question', 'Face ID Help', ['help', 'question', 'support', 'face id', 'face-id'], [line('M3.5 7V5a1.5 1.5 0 0 1 1.5-1.5h2M12 3.5h2A1.5 1.5 0 0 1 15.5 5v2M15.5 14v2a1.5 1.5 0 0 1-1.5 1.5h-2M7 17.5H5A1.5 1.5 0 0 1 3.5 16v-2'), line(D(7, 8.5) + D(12, 8.5)), line('M9.5 8.5v2.5h-.7M7 13.5c1.5 1 3.5 1 5 0'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.7 15.4a1.3 1.3 0 1 1 1.9 1.2c-.4.2-.6.5-.6.9'), line(D(17, 18.9))], { noAccent: true }),
    icon('siren-question', 'Siren Help', ['help', 'question', 'support', 'siren', 'siren'], [line('M9.5 3v1.5M4 5.5l1 1M15 5.5l-1 1'), body('M5.5 14v-3.5a4 4 0 0 1 8 0V14Z'), body(R(3.5, 14.5, 12, 3, 0.8)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.7 15.4a1.3 1.3 0 1 1 1.9 1.2c-.4.2-.6.5-.6.9'), line(D(17, 18.9))], { noAccent: true }),
    icon('key-card-question', 'Key Card Help', ['help', 'question', 'support', 'key card', 'key-card'], [body(R(4.5, 3, 10, 15, 1.5)), line('M8 5.5h3'), line('M7 10.5a2.5 2.5 0 0 1 5 0M7.8 13a1.7 1.7 0 0 1 3.4 0'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.7 15.4a1.3 1.3 0 1 1 1.9 1.2c-.4.2-.6.5-.6.9'), line(D(17, 18.9))], { noAccent: true }),
    icon('face-id-calendar', 'Face ID Booking', ['booking', 'date', 'appointment', 'face id', 'face-id'], [line('M3.5 7V5a1.5 1.5 0 0 1 1.5-1.5h2M12 3.5h2A1.5 1.5 0 0 1 15.5 5v2M15.5 14v2a1.5 1.5 0 0 1-1.5 1.5h-2M7 17.5H5A1.5 1.5 0 0 1 3.5 16v-2'), line(D(7, 8.5) + D(12, 8.5)), line('M9.5 8.5v2.5h-.7M7 13.5c1.5 1 3.5 1 5 0'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('siren-calendar', 'Siren Booking', ['booking', 'date', 'appointment', 'siren', 'siren'], [line('M9.5 3v1.5M4 5.5l1 1M15 5.5l-1 1'), body('M5.5 14v-3.5a4 4 0 0 1 8 0V14Z'), body(R(3.5, 14.5, 12, 3, 0.8)), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('key-card-calendar', 'Key Card Booking', ['booking', 'date', 'appointment', 'key card', 'key-card'], [body(R(4.5, 3, 10, 15, 1.5)), line('M8 5.5h3'), line('M7 10.5a2.5 2.5 0 0 1 5 0M7.8 13a1.7 1.7 0 0 1 3.4 0'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('key-card-sparkle', 'AI Key Card', ['ai', 'smart', 'magic', 'key card', 'key-card'], [body(R(4.5, 3, 10, 15, 1.5)), line('M8 5.5h3'), line('M7 10.5a2.5 2.5 0 0 1 5 0M7.8 13a1.7 1.7 0 0 1 3.4 0'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
  ],
};
