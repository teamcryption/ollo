import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'ai',
  icons: [
    icon('robot-upload', 'Upload Robot', ['upload', 'send', 'export', 'robot', 'robot'], [line('M9.5 7V4.5'), body(R(4, 7, 11, 8, 2.5)), line(D(7.5, 11) + D(11.5, 11)), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('robot-arm-upload', 'Upload Robot Arm', ['upload', 'send', 'export', 'robot arm', 'robot-arm'], [body(R(4, 15.5, 7, 2.5, 0.6)), line('M7.5 15.3V11l5-4.5'), body(C(7.5, 11, 1.4)), body(C(12.5, 6.5, 1.4)), line('M13.8 5.5 15.5 3.5M13.8 7.3l2.2.5'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
