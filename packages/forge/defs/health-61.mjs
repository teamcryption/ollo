import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'health',
  icons: [
    icon('glasses-upload', 'Upload Glasses', ['upload', 'send', 'export', 'glasses', 'glasses'], [line(C(6, 11, 2.8) + C(13, 11, 2.8)), line('M8.8 11h1.4M3.2 11 3 8.5M15.8 11l.2-2.5'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('pill-bottle-upload', 'Upload Pill Bottle', ['upload', 'send', 'export', 'pill bottle', 'pill-bottle'], [body(R(5, 3.5, 9, 3, 1)), body(R(5.5, 7.5, 8, 10.5, 1.5)), line('M7.5 11h4M7.5 13.5h4'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('toothpaste-upload', 'Upload Toothpaste', ['upload', 'send', 'export', 'toothpaste', 'toothpaste'], [line('M3.5 7v6'), body('M5 7h8.5l2 1.8v2.4l-2 1.8H5Z'), line('M7.5 10h3'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('ribbon-upload', 'Upload Awareness Ribbon', ['upload', 'send', 'export', 'awareness ribbon', 'ribbon'], [line('M9.5 9.5c-2-2.5-2.5-4-2.5-4.8a2.5 2.5 0 0 1 5 0c0 .8-.5 2.3-2.5 4.8'), line('M9.5 9.5 5 17.5M9.5 9.5l4.5 8'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('crutch-upload', 'Upload Crutch', ['upload', 'send', 'export', 'crutch', 'crutch'], [line('M7 3.5h5M7.5 3.7l2 8M11.5 3.7l-2 8M9.5 11.7V18M8 7.5h3'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('hot-water-bottle-upload', 'Upload Hot Water Bottle', ['upload', 'send', 'export', 'hot water bottle', 'hot-water-bottle'], [body(R(8, 3, 3, 2.5, 0.6)), body('M7 6h5a3.5 3.5 0 0 1 3.5 3.5V15a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V9.5A3.5 3.5 0 0 1 7 6Z'), line('M6.5 10.5h6M6.5 13.5h6'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('heart-monitor-upload', 'Upload Heart Monitor', ['upload', 'send', 'export', 'heart monitor', 'heart-monitor'], [body(R(3, 4, 13, 10, 1.8)), line('M5 9.5h2.5l1.2-2.5 2 5 1.3-2.5H14'), line('M7 17.5h5M9.5 14.2v3'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('x-ray-upload', 'Upload X-ray', ['upload', 'send', 'export', 'x-ray', 'x-ray'], [body(R(3.5, 3.5, 12, 14, 1.8)), line('M9.5 6v9M7 8h5M6.5 10.5h6M7 13h5'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
