import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'tools',
  icons: [
    icon('bucket-upload', 'Upload Bucket', ['upload', 'send', 'export', 'bucket', 'bucket'], [line('M4.5 8a5 5 0 0 1 10 0'), body('M3.5 8.5h12l-1.4 8.2a1.5 1.5 0 0 1-1.5 1.3H6.4a1.5 1.5 0 0 1-1.5-1.3Z'), line('M4 11.5h11'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('ladder-upload', 'Upload Ladder', ['upload', 'send', 'export', 'ladder', 'ladder'], [line('M6 3.5v15M13 3.5v15'), line('M6.2 7h6.6M6.2 11h6.6M6.2 15h6.6'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('hard-hat-upload', 'Upload Hard Hat', ['upload', 'send', 'export', 'hard hat', 'hard-hat'], [body('M4 13.5V12a5.5 5.5 0 0 1 11 0v1.5Z'), line('M9.5 6.5v3.5'), body(R(2.8, 14.2, 13.4, 2.3, 1.15)), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('ruler-upload', 'Upload Ruler', ['upload', 'send', 'export', 'ruler', 'ruler'], [body(R(3, 7.5, 13, 6, 1.2)), line('M6 7.7V10M9 7.7v3M12 7.7V10'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('spirit-level-upload', 'Upload Spirit Level', ['upload', 'send', 'export', 'spirit level', 'spirit-level'], [body(R(3, 7.5, 13, 6, 1.5)), line(R(7.5, 9.3, 4, 2.4, 1.2)), line('M5 10.5h1M13 10.5h1'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('nail-upload', 'Upload Nail', ['upload', 'send', 'export', 'nail', 'nail'], [body(R(5.5, 3.5, 8, 2.5, 1)), body('M8 6.5h3v8.5l-1.5 3.5L8 15Z'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('sickle-upload', 'Upload Sickle', ['upload', 'send', 'export', 'sickle', 'sickle'], [line('M5 18l3-3'), body('M8 15C4.5 11 5 5 10 3.5c3.8-1.2 6.5 1.3 6.5 4.5-1.3-1.8-3.2-2.5-5.2-2-3.5.8-4.8 4.4-2.6 8.2Z'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('pipe-upload', 'Upload Pipe', ['upload', 'send', 'export', 'pipe', 'pipe'], [line('M3 6.5h6.5a3.5 3.5 0 0 1 3.5 3.5v8.5M3 10h6.5V18.5'), body(R(2.5, 5, 2, 6.5, 0.6)), body(R(8, 16, 6.5, 2.5, 0.6)), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('valve-upload', 'Upload Valve', ['upload', 'send', 'export', 'valve', 'valve'], [line('M9.5 3.5v4M6.5 3.5h6'), body('M3 9h3l3.5 2.5L13 9h3v6h-3l-3.5-2.5L6 15H3Z'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('safety-vest-upload', 'Upload Safety Vest', ['upload', 'send', 'export', 'safety vest', 'safety-vest'], [body('M5.5 3.5h2.5l1.5 4 1.5-4h2.5l2 3V18H3.5V6.5Z'), line('M3.7 11.5h11.6M3.7 14.5h11.6'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
