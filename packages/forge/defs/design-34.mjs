import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'design',
  icons: [
    icon('palette-upload', 'Upload Colour Palette', ['upload', 'send', 'export', 'colour palette', 'palette'], [body('M9.5 3.5a7 7 0 0 0 0 14c1.2 0 1.6-.9 1.2-1.8-.5-1-.1-2.2 1.3-2.2h2a2.5 2.5 0 0 0 2.5-2.5c0-4.2-3.1-7.5-7-7.5Z'), line(D(6.5, 8.5) + D(9.5, 6.8) + D(12.5, 8.5) + D(6.2, 12)), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('spool-upload', 'Upload Thread', ['upload', 'send', 'export', 'thread', 'spool'], [body(R(4, 3.5, 11, 2.5, 1)), body(R(4, 15.5, 11, 2.5, 1)), line('M5.5 6.2v9.1M13.5 6.2v9.1'), line('M5.8 8.6l7.4 2M5.8 11.4l7.4 2'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('paint-bucket-upload', 'Upload Paint Bucket', ['upload', 'send', 'export', 'paint bucket', 'paint-bucket'], [line('M4.5 7.5a5 5 0 0 1 10 0'), body(poly([[3.5, 7.8], [15.5, 7.8], [14.5, 18], [4.5, 18]], 0.8, true)), line('M9 7.9c0 2.5 1.5 3 1.5 4.5'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('paint-tube-upload', 'Upload Paint Tube', ['upload', 'send', 'export', 'paint tube', 'paint-tube'], [body('M6 3.5h7l-1 10H7Z'), body(R(7.5, 14, 4, 2, 0.5)), line('M8.5 16.2v2h2v-2'), line('M7 7h5'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('picture-frame-upload', 'Upload Picture Frame', ['upload', 'send', 'export', 'picture frame', 'picture-frame'], [body(R(3.5, 3.5, 12, 15, 1.2)), line(R(6, 6, 7, 10, 0.5)), line('M6.3 13.5l2.3-2.5 1.8 1.8 1.2-1.3 1.2 1.5'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('pen-tool-upload', 'Upload Pen Tool', ['upload', 'send', 'export', 'pen tool', 'pen-tool'], [body('M9.5 3 14 9.5 11.5 15.5h-4L5 9.5Z'), line('M9.5 3.5v5'), line(C(9.5, 9.7, 1.2)), body(R(7, 16.2, 5, 2, 0.5)), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
