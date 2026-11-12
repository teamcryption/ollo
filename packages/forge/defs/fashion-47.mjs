import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'fashion',
  icons: [
    icon('perfume-upload', 'Upload Perfume', ['upload', 'send', 'export', 'perfume', 'perfume'], [line('M8.5 5.2V3.5h2'), body(R(7.5, 5.5, 4, 2.3, 0.6)), body(R(4.5, 8.5, 10, 9.5, 2.5)), line('M7.5 12.5h4'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('glove-upload', 'Upload Glove', ['upload', 'send', 'export', 'glove', 'glove'], [body('M5.5 18v-7.5L4 8.5a1 1 0 0 1 1.6-1.2L7 9V5a1 1 0 0 1 2 0V4a1 1 0 0 1 2 0v1a1 1 0 0 1 2 0v1.5a1 1 0 0 1 2 0V13c0 2.5-1.3 4-3 5Z'), line('M5.8 15.5h7.4'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('sunglasses-upload', 'Upload Sunglasses', ['upload', 'send', 'export', 'sunglasses', 'sunglasses'], [line('M2.5 8h14'), body('M3 8.2h5.5v2.3a2.7 2.7 0 0 1-5.5 0Z'), body('M10.5 8.2H16v2.3a2.7 2.7 0 0 1-5.5 0Z'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('sewing-machine-upload', 'Upload Sewing Machine', ['upload', 'send', 'export', 'sewing machine', 'sewing-machine'], [body('M3.5 7a2 2 0 0 1 2-2h9a1.5 1.5 0 0 1 1.5 1.5V17H12v-7H6.5V12H3.5Z'), line('M8.5 12.3v2.2'), body(R(3, 16, 13, 2, 0.6)), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('thimble-upload', 'Upload Thimble', ['upload', 'send', 'export', 'thimble', 'thimble'], [body('M5.5 17V9a4 4 0 0 1 8 0v8Z'), line(D(8, 9) + D(11, 9) + D(9.5, 11.5) + D(8, 14) + D(11, 14)), line('M4.5 17.5h10'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('raincoat-upload', 'Upload Raincoat', ['upload', 'send', 'export', 'raincoat', 'raincoat'], [body('M7 3.5h5l3.5 4-1.5 1.5-1-1V18H6V8l-1 1-1.5-1.5Z'), line('M9.5 6v12'), line('M7 4.5c1 1.5 4 1.5 5 0'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('heels-upload', 'Upload High Heels', ['upload', 'send', 'export', 'high heels', 'heels'], [body('M3 15c0-1.5 1-2.5 2.5-2.5H8c2 0 3-3 5-6 1-1.5 3-1 3 .5V9l-2 1v7.5h-1.5V12L9.5 15.5H3Z'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('hair-dryer-upload', 'Upload Hair Dryer', ['upload', 'send', 'export', 'hair dryer', 'hair-dryer'], [body('M3.5 7a3.5 3.5 0 0 1 3.5-3.5h6l2.5 1.5v4L13 10.5H7A3.5 3.5 0 0 1 3.5 7Z'), line(C(7, 7, 1.2)), body(R(8, 11, 3, 7, 1.2)), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('razor-upload', 'Upload Razor', ['upload', 'send', 'export', 'razor', 'razor'], [body(R(4, 3.5, 11, 4, 1.2)), line('M5.5 5.5h8'), body(R(8.3, 8.5, 2.4, 9.5, 1.2)), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
