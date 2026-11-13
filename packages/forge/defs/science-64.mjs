import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'science',
  icons: [
    icon('test-tubes-gift', 'Test Tubes Gift', ['gift', 'present', 'reward', 'test tubes', 'test-tubes'], [body('M5 3.5h3v11a1.5 1.5 0 0 1-3 0Z'), body('M11 3.5h3v11a1.5 1.5 0 0 1-3 0Z'), line('M5.2 9h2.6M11.2 11h2.6'), line('M3 17.5h13'), body(R(13, 14.8, 8, 5.7, 1), { cover: true }), line('M17 14.8v5.7M13.2 16.8h7.6'), line('M17 14.7c-.9-1.7-2.7-1.9-2.4-.5M17 14.7c.9-1.7 2.7-1.9 2.4-.5')], { noAccent: true }),
    icon('test-tubes-smile', 'Test Tubes Feedback', ['feedback', 'happy', 'satisfied', 'test tubes', 'test-tubes'], [body('M5 3.5h3v11a1.5 1.5 0 0 1-3 0Z'), body('M11 3.5h3v11a1.5 1.5 0 0 1-3 0Z'), line('M5.2 9h2.6M11.2 11h2.6'), line('M3 17.5h13'), body(C(17, 16.5, 4), { cover: true }), line('M15.4 17.6a2 2 0 0 0 3.2 0'), line(D(15.6, 15.4) + D(18.4, 15.4))], { noAccent: true }),
  ],
};
