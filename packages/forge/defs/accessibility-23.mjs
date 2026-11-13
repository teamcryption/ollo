import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'accessibility',
  icons: [
    icon('wheelchair-drop', 'Wheelchair Water', ['water', 'liquid', 'drop', 'wheelchair', 'wheelchair'], [line(C(8.5, 4, 1.4)), line('M8.5 6.5V12h4.5l1.5 4.5h1.5'), line('M11.5 9H8.6'), line('M5.5 10.5a4.5 4.5 0 1 0 7 4'), body('M17 12.3c2 2.2 3.3 4 3.3 5.4a3.3 3.3 0 0 1-6.6 0c0-1.4 1.3-3.2 3.3-5.4Z', { cover: true })], { noAccent: true }),
    icon('wheelchair-rocket', 'Launch Wheelchair', ['launch', 'boost', 'startup', 'wheelchair', 'wheelchair'], [line(C(8.5, 4, 1.4)), line('M8.5 6.5V12h4.5l1.5 4.5h1.5'), line('M11.5 9H8.6'), line('M5.5 10.5a4.5 4.5 0 1 0 7 4'), body('M17 12.3c1.8 1.4 2.5 3.3 2.2 5.8l-1 1.4h-2.4l-1-1.4c-.3-2.5.4-4.4 2.2-5.8Z', { cover: true }), line('M15 18l-1.3 1.6M19 18l1.3 1.6'), line(D(17, 15.6))], { noAccent: true }),
    icon('wheelchair-home', 'Home Wheelchair', ['home', 'house', 'domestic', 'wheelchair', 'wheelchair'], [line(C(8.5, 4, 1.4)), line('M8.5 6.5V12h4.5l1.5 4.5h1.5'), line('M11.5 9H8.6'), line('M5.5 10.5a4.5 4.5 0 1 0 7 4'), body(poly([[17, 12.5], [21, 16], [21, 20.5], [13, 20.5], [13, 16]], 0.7, true), { cover: true }), line('M16 20.4v-2.2h2v2.2')], { noAccent: true }),
    icon('wheelchair-gift', 'Wheelchair Gift', ['gift', 'present', 'reward', 'wheelchair', 'wheelchair'], [line(C(8.5, 4, 1.4)), line('M8.5 6.5V12h4.5l1.5 4.5h1.5'), line('M11.5 9H8.6'), line('M5.5 10.5a4.5 4.5 0 1 0 7 4'), body(R(13, 14.8, 8, 5.7, 1), { cover: true }), line('M17 14.8v5.7M13.2 16.8h7.6'), line('M17 14.7c-.9-1.7-2.7-1.9-2.4-.5M17 14.7c.9-1.7 2.7-1.9 2.4-.5')], { noAccent: true }),
    icon('wheelchair-smile', 'Wheelchair Feedback', ['feedback', 'happy', 'satisfied', 'wheelchair', 'wheelchair'], [line(C(8.5, 4, 1.4)), line('M8.5 6.5V12h4.5l1.5 4.5h1.5'), line('M11.5 9H8.6'), line('M5.5 10.5a4.5 4.5 0 1 0 7 4'), body(C(17, 16.5, 4), { cover: true }), line('M15.4 17.6a2 2 0 0 0 3.2 0'), line(D(15.6, 15.4) + D(18.4, 15.4))], { noAccent: true }),
    icon('wheelchair-link', 'Wheelchair Link', ['link', 'url', 'connect', 'wheelchair', 'wheelchair'], [line(C(8.5, 4, 1.4)), line('M8.5 6.5V12h4.5l1.5 4.5h1.5'), line('M11.5 9H8.6'), line('M5.5 10.5a4.5 4.5 0 1 0 7 4'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M16 18l2-3'), line('M15.6 17.2l-.5.7a1.2 1.2 0 0 0 2 1.3l.5-.7M18.4 15.8l.5-.7a1.2 1.2 0 0 0-2-1.3l-.5.7')], { noAccent: true }),
  ],
};
