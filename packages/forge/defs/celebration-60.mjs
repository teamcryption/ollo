import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'celebration',
  icons: [
    icon('carousel-gift', 'Carousel Gift', ['gift', 'present', 'reward', 'carousel', 'carousel'], [body(poly([[3, 8], [9.5, 3.5], [16, 8]], 0.6, true)), line('M5 8v9M14 8v9M9.5 8v9M3 17.5h13M5 12h1.5M13 12h1.5'), body(R(13, 14.8, 8, 5.7, 1), { cover: true }), line('M17 14.8v5.7M13.2 16.8h7.6'), line('M17 14.7c-.9-1.7-2.7-1.9-2.4-.5M17 14.7c.9-1.7 2.7-1.9 2.4-.5')], { noAccent: true }),
    icon('carousel-smile', 'Carousel Feedback', ['feedback', 'happy', 'satisfied', 'carousel', 'carousel'], [body(poly([[3, 8], [9.5, 3.5], [16, 8]], 0.6, true)), line('M5 8v9M14 8v9M9.5 8v9M3 17.5h13M5 12h1.5M13 12h1.5'), body(C(17, 16.5, 4), { cover: true }), line('M15.4 17.6a2 2 0 0 0 3.2 0'), line(D(15.6, 15.4) + D(18.4, 15.4))], { noAccent: true }),
    icon('carousel-link', 'Carousel Link', ['link', 'url', 'connect', 'carousel', 'carousel'], [body(poly([[3, 8], [9.5, 3.5], [16, 8]], 0.6, true)), line('M5 8v9M14 8v9M9.5 8v9M3 17.5h13M5 12h1.5M13 12h1.5'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M16 18l2-3'), line('M15.6 17.2l-.5.7a1.2 1.2 0 0 0 2 1.3l.5-.7M18.4 15.8l.5-.7a1.2 1.2 0 0 0-2-1.3l-.5.7')], { noAccent: true }),
  ],
};
