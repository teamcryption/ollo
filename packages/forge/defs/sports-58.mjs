import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'sports',
  icons: [
    icon('trophy-sparkle', 'AI Trophy', ['ai', 'smart', 'magic', 'trophy', 'trophy'], [body('M5.5 4h8v3.5a4 4 0 0 1-8 0Z'), line('M5.5 5.5H4a1.5 1.5 0 0 0 0 3h1.7M13.5 5.5H15a1.5 1.5 0 0 1 0 3h-1.7M9.5 11.5V15'), body(R(6.5, 15.5, 6, 2.5, 0.8)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('bike-sparkle', 'AI Bike', ['ai', 'smart', 'magic', 'bike', 'bike'], [line(C(5.5, 13, 2.5) + C(13.5, 13, 2.5)), line('M5.5 13 8 8h4.5l1 5M8 8 9.5 13h4M7.5 6h2'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('dumbbell-sparkle', 'AI Dumbbell', ['ai', 'smart', 'magic', 'dumbbell', 'dumbbell'], [body(R(3, 7.5, 2.4, 6, 0.8)), body(R(13.6, 7.5, 2.4, 6, 0.8)), line('M5.4 10.5h8.2'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('soccer-sparkle', 'AI Soccer', ['ai', 'smart', 'magic', 'soccer', 'soccer'], [body(C(9.5, 10, 6.5)), line(poly([[9.5, 7.6], [11.8, 9.3], [10.9, 12], [8.1, 12], [7.2, 9.3]], 0.3, true)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('pool-sparkle', 'AI Pool', ['ai', 'smart', 'magic', 'pool', 'pool'], [line('M6.5 3.5v8.5M11.5 3.5v8.5M6.5 6h5M6.5 9h5'), line('M3 14.5c1.2-1 2.3-1 3.5 0s2.3 1 3.5 0 2.3-1 3.5 0'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('medal-sparkle', 'AI Medal', ['ai', 'smart', 'magic', 'medal', 'medal'], [line('M6.5 3.5l2 5M12.5 3.5l-2 5'), body(C(9.5, 13, 4.5)), line(C(9.5, 13, 1.8)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('parachute-sparkle', 'AI Parachute', ['ai', 'smart', 'magic', 'parachute', 'parachute'], [body('M3 10a6.5 6.5 0 0 1 13 0Z'), line('M3.4 10.3l5.6 6M15.6 10.3l-5.6 6M9.5 10.3v5.8'), line(D(9.5, 17.8)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('whistle-sparkle', 'AI Whistle', ['ai', 'smart', 'magic', 'whistle', 'whistle'], [line('M5.6 9.4 4 6'), body('M8.5 8.5h7V12h-3.4A3.8 3.8 0 1 1 8.5 8.5Z'), line(D(8.3, 12.3)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('podium-sparkle', 'AI Podium', ['ai', 'smart', 'magic', 'podium', 'podium'], [body(poly([[3, 18], [3, 12], [7, 12], [7, 8.5], [12, 8.5], [12, 14], [16, 14], [16, 18]], 0.6, true)), line('M9.5 10.5v2'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('surfboard-sparkle', 'AI Surfboard', ['ai', 'smart', 'magic', 'surfboard', 'surfboard'], [body(rotateD(E(9.5, 10.5, 2.8, 7.5), 35, 9.5, 10.5)), line(rotateD('M9.5 5v11', 35, 9.5, 10.5)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('basketball-hoop-sparkle', 'AI Basketball Hoop', ['ai', 'smart', 'magic', 'basketball hoop', 'basketball-hoop'], [body(R(4, 3, 11, 7, 1)), line(R(7.5, 5.3, 4, 2.6, 0.5)), line('M6.3 11.3h6.4'), line('M7 11.5l1 5h3l1-5M9.5 11.5v5'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('goal-sparkle', 'AI Goal', ['ai', 'smart', 'magic', 'goal', 'goal'], [line('M3 17.5V5.5h13v12'), line('M3.2 9.5h12.6M3.2 13.5h12.6M7.3 5.7v11.6M11.6 5.7v11.6'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('tennis-ball-sparkle', 'AI Tennis Ball', ['ai', 'smart', 'magic', 'tennis ball', 'tennis-ball'], [body(C(9.5, 10.5, 6.5)), line('M5 5.8c2.5 2.5 2.5 7 0 9.5M14 5.8c-2.5 2.5-2.5 7 0 9.5'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('skateboard-sparkle', 'AI Skateboard', ['ai', 'smart', 'magic', 'skateboard', 'skateboard'], [body(R(3, 10, 13, 2.6, 1.3)), line(C(6, 15.3, 1.3)), line(C(13, 15.3, 1.3)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('bowling-pin-sparkle', 'AI Bowling Pin', ['ai', 'smart', 'magic', 'bowling pin', 'bowling-pin'], [body('M9.5 3.5c1.3 0 2 1 2 2.3 0 1.2-.7 1.8-.7 2.7 0 1 2.2 2.5 2.2 5.5 0 2.5-1.5 4.5-3.5 4.5S6 16.5 6 14c0-3 2.2-4.5 2.2-5.5 0-.9-.7-1.5-.7-2.7 0-1.3.7-2.3 2-2.3Z'), line('M8.2 8.5h2.6'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('basketball-sparkle', 'AI Basketball', ['ai', 'smart', 'magic', 'basketball', 'basketball'], [body(C(9.5, 10.5, 6.5)), line('M3 10.5h13M9.5 4v13'), line('M5 5.5c2 2.5 2 7.5 0 10M14 5.5c-2 2.5-2 7.5 0 10'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('pennant-sparkle', 'AI Pennant', ['ai', 'smart', 'magic', 'pennant', 'pennant'], [line('M4 3v15.5'), body('M4.4 4h11L4.4 11.5Z'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('bow-arrow-sparkle', 'AI Bow and Arrow', ['ai', 'smart', 'magic', 'bow and arrow', 'bow-arrow'], [line('M6 3.5a11 11 0 0 1 0 14'), line('M6 3.5v14'), line('M3 10.5h11.5M13 9l1.5 1.5L13 12'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
  ],
};
