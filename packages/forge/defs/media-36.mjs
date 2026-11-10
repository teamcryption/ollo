import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'media',
  icons: [
    icon('camera-alert', 'Camera Alert', ['alert', 'warning', 'problem', 'camera', 'camera'], [body(R(3, 6.5, 13, 10, 2)), line('M7 6.5 8 4.5h3l1 2'), line(C(9.5, 11.5, 2.5)), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('music-alert', 'Music Alert', ['alert', 'warning', 'problem', 'music', 'music'], [line('M8 15.5V5.5l7-2v9.5'), body(C(6, 15.5, 2)), body(C(13, 13, 2)), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
  ],
};
