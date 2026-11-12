import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'communication',
  icons: [
    icon('stamp-upload', 'Upload Stamp', ['upload', 'send', 'export', 'stamp', 'stamp'], [body(C(9.5, 5, 1.8)), line('M9.5 6.9v2.6'), body(R(4, 9.6, 11, 4, 1.2)), line('M4 16.8h11'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('walkie-talkie-upload', 'Upload Walkie Talkie', ['upload', 'send', 'export', 'walkie talkie', 'walkie-talkie'], [line('M7 6V3'), body(R(5, 6, 9, 12.5, 2)), line('M7.5 9.5h4M7.5 11.5h4'), line(D(9.5, 15)), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('antenna-tower-upload', 'Upload Antenna Tower', ['upload', 'send', 'export', 'antenna tower', 'antenna-tower'], [line('M9.5 3.5v2'), line('M9.5 5.5 6 18M9.5 5.5 13 18M7.3 13h4.4M8.3 9h2.4'), line('M5.5 4.5a5 5 0 0 0 0 4M13.5 4.5a5 5 0 0 1 0 4'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
